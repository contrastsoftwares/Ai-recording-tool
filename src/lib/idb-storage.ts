import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

/**
 * IndexedDB-backed storage for Zustand's persist middleware.
 *
 * We use this instead of localStorage for data that can grow large — notes now
 * embed base64 images and multi-format HTML, and localStorage's ~5MB cap would
 * silently fail (throwing on setItem), causing new notes to vanish on reload.
 * IndexedDB offers a much larger quota.
 *
 * On first read it transparently migrates any existing localStorage value under
 * the same key into IndexedDB, so users don't lose notes saved before this
 * change.
 */
/** No-op storage used on the server (Node build/SSR) where IndexedDB is absent. */
const noopStorage: StateStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

const realIdbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get<string>(name);
      if (value != null) return value;
    } catch {
      // fall through to migration / null
    }

    // One-time migration from the old localStorage key.
    try {
      if (typeof localStorage !== "undefined") {
        const legacy = localStorage.getItem(name);
        if (legacy != null) {
          await set(name, legacy);
          localStorage.removeItem(name);
          return legacy;
        }
      }
    } catch {
      // ignore migration failures
    }

    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

/**
 * IndexedDB storage on the client, no-op on the server. Guarding here prevents
 * "indexedDB is not defined" during Next.js build/prerender.
 */
export const idbStorage: StateStorage =
  typeof window !== "undefined" && typeof indexedDB !== "undefined"
    ? realIdbStorage
    : noopStorage;
