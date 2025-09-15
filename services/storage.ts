/**
 * Storage service wrapper for AsyncStorage with error handling and type safety
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionResult } from '../types';

/**
 * Storage service class
 */
export class StorageService {
  /**
   * Store data in AsyncStorage
   */
  static async setItem<T>(key: string, value: T): Promise<ActionResult<void>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return { success: true };
    } catch (error) {
      console.error(`Storage setItem error for key ${key}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to store data'
      };
    }
  }

  /**
   * Retrieve data from AsyncStorage
   */
  static async getItem<T>(key: string): Promise<ActionResult<T | null>> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return { success: true, data: null };
      }
      const parsedValue = JSON.parse(jsonValue) as T;
      return { success: true, data: parsedValue };
    } catch (error) {
      console.error(`Storage getItem error for key ${key}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve data'
      };
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  static async removeItem(key: string): Promise<ActionResult<void>> {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error(`Storage removeItem error for key ${key}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove data'
      };
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  static async clear(): Promise<ActionResult<void>> {
    try {
      await AsyncStorage.clear();
      return { success: true };
    } catch (error) {
      console.error('Storage clear error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to clear storage'
      };
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  static async getAllKeys(): Promise<ActionResult<string[]>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return { success: true, data: [...keys] };
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get keys'
      };
    }
  }

  /**
   * Get multiple items from AsyncStorage
   */
  static async multiGet(keys: string[]): Promise<ActionResult<Array<[string, string | null]>>> {
    try {
      const result = await AsyncStorage.multiGet(keys);
      return { success: true, data: result as Array<[string, string | null]> };
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get multiple items'
      };
    }
  }

  /**
   * Set multiple items in AsyncStorage
   */
  static async multiSet(keyValuePairs: Array<[string, string]>): Promise<ActionResult<void>> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return { success: true };
    } catch (error) {
      console.error('Storage multiSet error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to set multiple items'
      };
    }
  }

  /**
   * Get storage usage information
   */
  static async getStorageInfo(): Promise<ActionResult<{
    totalKeys: number;
    approximateSize: number;
  }>> {
    try {
      const keysResult = await this.getAllKeys();
      if (!keysResult.success || !keysResult.data) {
        return { success: false, error: 'Failed to get keys' };
      }

      const keys = keysResult.data;
      const multiGetResult = await this.multiGet(keys);
      if (!multiGetResult.success || !multiGetResult.data) {
        return { success: false, error: 'Failed to get storage data' };
      }

      let approximateSize = 0;
      multiGetResult.data.forEach(([key, value]) => {
        approximateSize += key.length + (value?.length || 0);
      });

      return {
        success: true,
        data: {
          totalKeys: keys.length,
          approximateSize,
        }
      };
    } catch (error) {
      console.error('Storage getStorageInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get storage info'
      };
    }
  }

  /**
   * Check if a key exists in storage
   */
  static async hasKey(key: string): Promise<ActionResult<boolean>> {
    try {
      const value = await AsyncStorage.getItem(key);
      return { success: true, data: value !== null };
    } catch (error) {
      console.error(`Storage hasKey error for key ${key}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check key existence'
      };
    }
  }

  /**
   * Merge data with existing data in AsyncStorage
   */
  static async mergeItem<T extends Record<string, any>>(
    key: string, 
    value: Partial<T>
  ): Promise<ActionResult<void>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem(key, jsonValue);
      return { success: true };
    } catch (error) {
      console.error(`Storage mergeItem error for key ${key}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to merge data'
      };
    }
  }
}

/**
 * Utility functions for common storage operations
 */
export const storage = {
  /**
   * Store data with automatic error handling
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    const result = await StorageService.setItem(key, value);
    if (!result.success) {
      console.error(`Failed to store ${key}:`, result.error);
    }
    return result.success;
  },

  /**
   * Retrieve data with automatic error handling
   */
  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    const result = await StorageService.getItem<T>(key);
    if (!result.success) {
      console.error(`Failed to retrieve ${key}:`, result.error);
      return defaultValue || null;
    }
    return result.data || defaultValue || null;
  },

  /**
   * Remove data with automatic error handling
   */
  async remove(key: string): Promise<boolean> {
    const result = await StorageService.removeItem(key);
    if (!result.success) {
      console.error(`Failed to remove ${key}:`, result.error);
    }
    return result.success;
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await StorageService.hasKey(key);
    return result.success && result.data === true;
  },
};