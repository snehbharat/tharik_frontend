// Jest setup file for AMOAGC Platform testing

import "@testing-library/jest-dom";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mocked-url");
global.URL.revokeObjectURL = jest.fn();

// Mock File and FileReader
global.File = class File {
  constructor(chunks, filename, options) {
    return {
      name: filename,
      size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
      type: (options && options.type) || "text/plain",
      lastModified: Date.now(),
    };
  }
};

global.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.error = null;
    this.readyState = 0;
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
  }

  readAsText() {
    this.readyState = 2;
    this.result = "mocked file content";
    if (this.onload) this.onload({ target: this });
  }

  readAsDataURL() {
    this.readyState = 2;
    this.result = "data:text/plain;base64,bW9ja2VkIGZpbGUgY29udGVudA==";
    if (this.onload) this.onload({ target: this });
  }

  readAsArrayBuffer() {
    this.readyState = 2;
    this.result = new ArrayBuffer(8);
    if (this.onload) this.onload({ target: this });
  }

  abort() {
    this.readyState = 2;
    if (this.onabort) this.onabort({ target: this });
  }
};

// Mock Audio for notification sounds
global.Audio = class Audio {
  constructor() {
    this.play = jest.fn().mockResolvedValue(undefined);
    this.pause = jest.fn();
    this.load = jest.fn();
    this.volume = 1;
    this.currentTime = 0;
    this.duration = 0;
    this.paused = true;
    this.ended = false;
  }
};

// Mock WebSocket for real-time features
global.WebSocket = class WebSocket {
  constructor() {}
  send = jest.fn();
  close = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  readyState = 1;
};

// Mock Notification API
global.Notification = class Notification {
  constructor() {}
  static permission = "granted";
  static requestPermission = jest.fn().mockResolvedValue("granted");
};

// Mock crypto for UUID generation
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mocked-uuid"),
    getRandomValues: jest.fn((arr) =>
      arr.map(() => Math.floor(Math.random() * 256))
    ),
  },
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
