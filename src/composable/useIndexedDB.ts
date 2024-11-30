// src/composables/useIndexedDB.ts

import { ref } from 'vue';

interface IndexedDBOptions {
  dbName: string; // DB name
  storeName: string; // table name
  keyPath: string; // key（ID）
}

export function useIndexedDB(options: IndexedDBOptions) {
  const { dbName, storeName, keyPath } = options;
  const db = ref<IDBDatabase | null>(null);
  const error = ref<string | null>(null);

  // open
  const openDatabase = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = (event) => {
        error.value = 'Database error: ' + (event.target as any).errorCode;
        reject(error.value);
      };

      request.onsuccess = (event) => {
        db.value = (event.target as any).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath });
        }
      };
    });
  };

  // close
  const closeDatabase = (): void => {
    if (db.value) {
      db.value.close();
    }
  };

  const addData = async (data: any): Promise<void> => {
    if (!db.value) return;

    const transaction = db.value.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        reject('Failed to add data: ' + (event.target as any).error);
      };
    });
  };

  const updateData = async (data: any): Promise<void> => {
    if (!db.value) return;

    const transaction = db.value.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        reject('Failed to update data: ' + (event.target as any).error);
      };
    });
  };

  const getData = async (id: string): Promise<any | null> => {
    if (!db.value) return null;

    const transaction = db.value.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = (event) => resolve((event.target as any).result);
      request.onerror = (event) => {
        reject('Failed to get data: ' + (event.target as any).error);
      };
    });
  };

  const deleteData = async (id: string): Promise<void> => {
    if (!db.value) return;

    const transaction = db.value.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        reject('Failed to delete data: ' + (event.target as any).error);
      };
    });
  };

  const getAllData = async (): Promise<any[]> => {
    if (!db.value) return [];

    const transaction = db.value.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = (event) => resolve((event.target as any).result);
      request.onerror = (event) => {
        reject('Failed to get all data: ' + (event.target as any).error);
      };
    });
  };

  const clearAllData = async (): Promise<void> => {
    if (!db.value) return;

    const transaction = db.value.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        reject('Failed to clear data: ' + (event.target as any).error);
      };
    });
  };

  return {
    openDatabase,
    closeDatabase,
    addData,
    updateData,
    getData,
    deleteData,
    getAllData,
    clearAllData,
    error
  };
}
