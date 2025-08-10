class FileService {
  static DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  static ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  static DANGEROUS_EXTENSIONS = [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".pif",
    ".scr",
    ".vbs",
    ".js",
    ".jar",
    ".sh",
    ".ps1",
    ".app",
    ".deb",
    ".rpm",
    ".dmg",
    ".pkg",
  ];

  static uploadQueue = new Map();
  static tempUrls = new Set();

  static async uploadFile(file, options = {}) {
    const uploadId = this.generateUploadId();
    const abortController = new AbortController();

    try {
      this.uploadQueue.set(uploadId, abortController);

      const validation = await this.validateFile(file, options);
      if (!validation.isValid) {
        return {
          success: false,
          error: "File validation failed",
          validationErrors: validation.errors,
        };
      }

      if (this.isFileBeingProcessed(file.name)) {
        return {
          success: false,
          error: "File is currently being processed. Please wait.",
        };
      }

      const result = await this.processFileUpload(
        file,
        options,
        abortController.signal
      );

      return {
        success: true,
        fileId: result.fileId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url: result.url,
      };
    } catch (error) {
      console.error("File upload failed:", error);

      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Upload was cancelled",
        };
      }

      return {
        success: false,
        error: error.message || "Upload failed",
      };
    } finally {
      this.uploadQueue.delete(uploadId);
    }
  }

  static async validateFile(file, options = {}) {
    const errors = [];
    const warnings = [];
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.ALLOWED_TYPES;

    if (file.size > maxSize) {
      errors.push(
        `File size (${this.formatFileSize(
          file.size
        )}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`
      );
    }

    if (file.size === 0) {
      errors.push("File is empty");
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type '${file.type}' is not allowed`);
    }

    const extension = this.getFileExtension(file.name);
    if (this.DANGEROUS_EXTENSIONS.includes(extension.toLowerCase())) {
      errors.push(
        `File extension '${extension}' is not allowed for security reasons`
      );
    }

    if (!this.isValidFileName(file.name)) {
      errors.push("File name contains invalid characters");
    }

    if (options.validateContent && errors.length === 0) {
      try {
        const contentValidation = await this.validateFileContent(file);
        if (!contentValidation.isValid) {
          errors.push(...contentValidation.errors);
        }
        warnings.push(...contentValidation.warnings);
      } catch {
        warnings.push("Could not validate file content");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      detectedType: file.type,
      actualSize: file.size,
    };
  }

  static async processFileUpload(file, options, signal) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileId = this.generateFileId();

      signal.addEventListener("abort", () => {
        reader.abort();
        reject(new Error("Upload cancelled"));
      });

      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result;

          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);

          this.tempUrls.add(url);

          this.storeFileMetadata(fileId, {
            name: file.name,
            size: file.size,
            type: file.type,
            url,
            uploadDate: new Date(),
          });

          resolve({ fileId, url });
        } catch {
          reject(new Error("Failed to process file data"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onabort = () => reject(new Error("File reading was aborted"));

      reader.readAsArrayBuffer(file);
    });
  }

  static async validateFileContent(file) {
    const errors = [];
    const warnings = [];

    try {
      const headerBuffer = await this.readFileHeader(file, 512);
      const header = new Uint8Array(headerBuffer);

      if (this.hasExecutableSignature(header)) {
        errors.push("File appears to be an executable and is not allowed");
      }

      const expectedType = this.getExpectedMimeType(file.name);
      if (expectedType && !this.validateFileSignature(header, expectedType)) {
        warnings.push("File content does not match its extension");
      }

      if (file.type.includes("document") || file.type.includes("pdf")) {
        const hasScripts = await this.checkForEmbeddedScripts(file);
        if (hasScripts) {
          warnings.push("Document contains embedded scripts");
        }
      }
    } catch {
      warnings.push("Could not fully validate file content");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static generateFileUrl(fileId, fileName) {
    const baseUrl = window.location.origin;
    const encodedFileName = encodeURIComponent(fileName);
    return `${baseUrl}/api/files/${fileId}/${encodedFileName}`;
  }

  static async deleteFile(fileId) {
    try {
      const metadata = this.getFileMetadata(fileId);
      if (!metadata) {
        console.warn(`File metadata not found for ID: ${fileId}`);
        return false;
      }

      if (metadata.url && this.tempUrls.has(metadata.url)) {
        URL.revokeObjectURL(metadata.url);
        this.tempUrls.delete(metadata.url);
      }

      this.removeFileMetadata(fileId);

      console.log(`File deleted successfully: ${fileId}`);
      return true;
    } catch (error) {
      console.error("Failed to delete file:", error);
      return false;
    }
  }

  static cancelUpload(uploadId) {
    const controller = this.uploadQueue.get(uploadId);
    if (controller) {
      controller.abort();
      this.uploadQueue.delete(uploadId);
      return true;
    }
    return false;
  }

  static cleanup() {
    this.uploadQueue.forEach((controller) => controller.abort());
    this.uploadQueue.clear();

    this.tempUrls.forEach((url) => URL.revokeObjectURL(url));
    this.tempUrls.clear();

    console.log("FileService cleanup completed");
  }

  // Private helpers

  static generateUploadId() {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateFileId() {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static isFileBeingProcessed(fileName) {
    return Array.from(this.uploadQueue.keys()).some((id) =>
      id.includes(fileName)
    );
  }

  static getFileExtension(fileName) {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot !== -1 ? fileName.substring(lastDot) : "";
  }

  static isValidFileName(fileName) {
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    return (
      !invalidChars.test(fileName) &&
      fileName.length > 0 &&
      fileName.length <= 255
    );
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  static readFileHeader(file, bytes) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file header"));
      reader.readAsArrayBuffer(file.slice(0, bytes));
    });
  }

  static hasExecutableSignature(header) {
    const signatures = [
      [0x4d, 0x5a],
      [0x7f, 0x45, 0x4c, 0x46],
      [0xcf, 0xfa, 0xed, 0xfe],
      [0x50, 0x4b, 0x03, 0x04],
    ];

    return signatures.some((sig) =>
      sig.every((byte, index) => header[index] === byte)
    );
  }

  static getExpectedMimeType(fileName) {
    const extension = this.getFileExtension(fileName).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".txt": "text/plain",
    };
    return mimeTypes[extension] || null;
  }

  static validateFileSignature(header, expectedType) {
    const signatures = {
      "application/pdf": [0x25, 0x50, 0x44, 0x46],
      "image/jpeg": [0xff, 0xd8, 0xff],
      "image/png": [0x89, 0x50, 0x4e, 0x47],
      "image/gif": [0x47, 0x49, 0x46, 0x38],
    };

    const signature = signatures[expectedType];
    if (!signature) return true;

    return signature.every((byte, index) => header[index] === byte);
  }

  static async checkForEmbeddedScripts(file) {
    try {
      const text = await file.text();
      const scriptPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i,
      ];
      return scriptPatterns.some((pattern) => pattern.test(text));
    } catch {
      return false;
    }
  }

  static storeFileMetadata(fileId, metadata) {
    try {
      const stored = JSON.parse(localStorage.getItem("file_metadata") || "{}");
      stored[fileId] = metadata;
      localStorage.setItem("file_metadata", JSON.stringify(stored));
    } catch (error) {
      console.error("Failed to store file metadata:", error);
    }
  }

  static getFileMetadata(fileId) {
    try {
      const stored = JSON.parse(localStorage.getItem("file_metadata") || "{}");
      return stored[fileId] || null;
    } catch (error) {
      console.error("Failed to get file metadata:", error);
      return null;
    }
  }

  static removeFileMetadata(fileId) {
    try {
      const stored = JSON.parse(localStorage.getItem("file_metadata") || "{}");
      delete stored[fileId];
      localStorage.setItem("file_metadata", JSON.stringify(stored));
    } catch (error) {
      console.error("Failed to remove file metadata:", error);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    FileService.cleanup();
  });
}

export default FileService;
