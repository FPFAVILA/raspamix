/// <reference types="vite/client" />

// Facebook Pixel types
declare global {
  interface Window {
    fbq: (action: string, event: string, params?: any) => void;
  }
}
