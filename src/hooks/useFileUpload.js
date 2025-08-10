import { useState, useCallback, useRef, useEffect } from "react";
import FileService from "../services/FileService";

export const useFileUpload = (options = {}) => {
  const [uploads, setUploads] = useState(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef(new Map());

  useEffect(() => {
    return () => {
      console.log("Cleaning up file upload hook");
      abortControllersRef.current.forEach((controller) => {
        controller.abort();
      });
      abortControllersRef.current.clear();

      if (options.autoCleanup !== false) {
        FileService.cleanup();
      }
    };
  }, [options.autoCleanup]);

  const updateUploadProgress = useCallback(
    (uploadId, update) => {
      setUploads((prev) => {
        const newUploads = new Map(prev);
        const existing = newUploads.get(uploadId);
        if (existing) {
          const updated = { ...existing, ...update };
          newUploads.set(uploadId, updated);
          if (options.onProgress) {
            options.onProgress(updated);
          }
        }
        return newUploads;
      });
    },
    [options.onProgress]
  );

  const uploadFile = useCallback(
    async (file, uploadOptions = {}) => {
      console.log("Starting file upload:", file.name, file.size);
      const uploadId = `upload_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const abortController = new AbortController();

      abortControllersRef.current.set(uploadId, abortController);

      const initialProgress = {
        uploadId,
        fileName: file.name,
        progress: 0,
        status: "pending",
      };

      setUploads((prev) => new Map(prev).set(uploadId, initialProgress));
      setIsUploading(true);

      try {
        updateUploadProgress(uploadId, { status: "uploading", progress: 10 });
        console.log("Upload progress updated to uploading");

        const mergedOptions = { ...options, ...uploadOptions };

        const progressInterval = setInterval(() => {
          updateUploadProgress(uploadId, {
            progress: Math.min(
              90,
              (uploads.get(uploadId)?.progress || 0) + Math.random() * 20
            ),
          });
        }, 500);

        const result = await FileService.uploadFile(file, mergedOptions);
        console.log("File upload result:", result);

        clearInterval(progressInterval);

        if (result.success) {
          updateUploadProgress(uploadId, {
            status: "completed",
            progress: 100,
            result,
          });

          if (options.onComplete) {
            options.onComplete(result);
          }
          console.log("File upload completed successfully");
        } else {
          updateUploadProgress(uploadId, {
            status: "error",
            error: result.error || "Upload failed",
          });

          if (options.onError) {
            options.onError(result.error || "Upload failed");
          }
          console.error("File upload failed:", result.error);
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        console.error("File upload exception:", errorMessage);

        updateUploadProgress(uploadId, {
          status: "error",
          error: errorMessage,
        });

        if (options.onError) {
          options.onError(errorMessage);
        }

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        abortControllersRef.current.delete(uploadId);
        setIsUploading(
          Array.from(uploads.values()).some(
            (upload) =>
              upload.status === "uploading" || upload.status === "pending"
          )
        );

        setTimeout(() => {
          setUploads((prev) => {
            const newUploads = new Map(prev);
            const upload = newUploads.get(uploadId);
            if (
              upload &&
              (upload.status === "completed" || upload.status === "error")
            ) {
              newUploads.delete(uploadId);
            }
            return newUploads;
          });
        }, 5000);
      }
    },
    [uploads, updateUploadProgress, options]
  );

  const cancelUpload = useCallback(
    (uploadId) => {
      const controller = abortControllersRef.current.get(uploadId);
      if (controller) {
        controller.abort();
        updateUploadProgress(uploadId, { status: "cancelled" });
        abortControllersRef.current.delete(uploadId);
      }
    },
    [updateUploadProgress]
  );

  const uploadMultipleFiles = useCallback(
    async (files, uploadOptions = {}) => {
      const fileArray = Array.from(files);
      const results = [];

      for (const file of fileArray) {
        try {
          const result = await uploadFile(file, uploadOptions);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
        }
      }

      return results;
    },
    [uploadFile]
  );

  const clearCompletedUploads = useCallback(() => {
    setUploads((prev) => {
      const newUploads = new Map();
      prev.forEach((upload, id) => {
        if (upload.status === "uploading" || upload.status === "pending") {
          newUploads.set(id, upload);
        }
      });
      return newUploads;
    });
  }, []);

  const getUploadStats = useCallback(() => {
    const uploadsArray = Array.from(uploads.values());
    return {
      total: uploadsArray.length,
      pending: uploadsArray.filter((u) => u.status === "pending").length,
      uploading: uploadsArray.filter((u) => u.status === "uploading").length,
      completed: uploadsArray.filter((u) => u.status === "completed").length,
      failed: uploadsArray.filter((u) => u.status === "error").length,
      cancelled: uploadsArray.filter((u) => u.status === "cancelled").length,
    };
  }, [uploads]);

  return {
    uploads: Array.from(uploads.values()),
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    clearCompletedUploads,
    getUploadStats,
  };
};

export default useFileUpload;
