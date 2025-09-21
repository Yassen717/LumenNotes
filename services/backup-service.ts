/**
 * Backup service for data backup and restore functionality
 */

import { APP_CONFIG, STORAGE_KEYS } from '../constants/storage-keys';
import { ActionResult, AppSettings, Note } from '../types';
import { NotesService } from './notes-service';
import { StorageService, storage } from './storage';

/**
 * Backup data structure
 */
interface BackupData {
  version: string;
  timestamp: Date;
  notes: Note[];
  settings: AppSettings;
  metadata: {
    notesCount: number;
    categoriesCount: number;
    tagsCount: number;
    backupSource: 'manual' | 'auto';
  };
}

/**
 * Backup metadata
 */
interface BackupMetadata {
  id: string;
  timestamp: Date;
  notesCount: number;
  size: number;
  source: 'manual' | 'auto';
}

/**
 * Backup service class
 */
export class BackupService {
  /**
   * Create a backup of all app data
   */
  static async createBackup(source: 'manual' | 'auto' = 'manual'): Promise<ActionResult<BackupMetadata>> {
    try {
      // Load notes
      const notesResult = await NotesService.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      // Load settings
      const settingsResult = await StorageService.getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
      if (!settingsResult.success) {
        return { success: false, error: settingsResult.error };
      }

      const notes = notesResult.data || [];
      const settings = settingsResult.data || {} as AppSettings;

      // Create backup data
      const timestamp = new Date();
      const backupData: BackupData = {
        version: APP_CONFIG.VERSION,
        timestamp,
        notes,
        settings,
        metadata: {
          notesCount: notes.length,
          categoriesCount: new Set(notes.map(n => n.category).filter(Boolean)).size,
          tagsCount: new Set(notes.flatMap(n => n.tags)).size,
          backupSource: source,
        }
      };

      // Generate backup ID
      const backupId = `backup_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
      const backupKey = `${STORAGE_KEYS.BACKUP_DATA}_${backupId}`;

      // Save backup
      const saveResult = await StorageService.setItem(backupKey, backupData);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      // Create backup metadata
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        notesCount: notes.length,
        size: JSON.stringify(backupData).length,
        source,
      };

      // Update backup list
      await this.updateBackupList(metadata);

      // Update last backup timestamp
      await storage.set(STORAGE_KEYS.LAST_BACKUP, timestamp);

      // Clean up old backups if needed
      await this.cleanupOldBackups();

      return { success: true, data: metadata };
    } catch (error) {
      console.error('Failed to create backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create backup'
      };
    }
  }

  /**
   * Restore from backup
   */
  static async restoreBackup(backupId: string): Promise<ActionResult<void>> {
    try {
      const backupKey = `${STORAGE_KEYS.BACKUP_DATA}_${backupId}`;
      
      // Load backup data
      const backupResult = await StorageService.getItem<BackupData>(backupKey);
      if (!backupResult.success) {
        return { success: false, error: backupResult.error };
      }

      if (!backupResult.data) {
        return { success: false, error: 'Backup not found' };
      }

      const backupData = backupResult.data;

      // Restore notes
      const saveNotesResult = await NotesService.saveNotes(backupData.notes);
      if (!saveNotesResult.success) {
        return { success: false, error: saveNotesResult.error };
      }

      // Restore settings
      const saveSettingsResult = await StorageService.setItem(STORAGE_KEYS.SETTINGS, backupData.settings);
      if (!saveSettingsResult.success) {
        return { success: false, error: saveSettingsResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to restore backup'
      };
    }
  }

  /**
   * Get list of available backups
   */
  static async getBackupList(): Promise<ActionResult<BackupMetadata[]>> {
    try {
      const result = await StorageService.getItem<BackupMetadata[]>(`${STORAGE_KEYS.BACKUP_DATA}_list`);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      const backups = result.data || [];
      
      // Sort by timestamp (newest first)
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return { success: true, data: backups };
    } catch (error) {
      console.error('Failed to get backup list:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get backup list'
      };
    }
  }

  /**
   * Delete a backup
   */
  static async deleteBackup(backupId: string): Promise<ActionResult<void>> {
    try {
      const backupKey = `${STORAGE_KEYS.BACKUP_DATA}_${backupId}`;
      
      // Remove backup data
      const removeResult = await StorageService.removeItem(backupKey);
      if (!removeResult.success) {
        return { success: false, error: removeResult.error };
      }

      // Update backup list
      const listResult = await this.getBackupList();
      if (listResult.success && listResult.data) {
        const updatedList = listResult.data.filter(backup => backup.id !== backupId);
        await StorageService.setItem(`${STORAGE_KEYS.BACKUP_DATA}_list`, updatedList);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete backup'
      };
    }
  }

  /**
   * Export backup as JSON string
   */
  static async exportBackup(backupId: string): Promise<ActionResult<string>> {
    try {
      const backupKey = `${STORAGE_KEYS.BACKUP_DATA}_${backupId}`;
      
      const backupResult = await StorageService.getItem<BackupData>(backupKey);
      if (!backupResult.success) {
        return { success: false, error: backupResult.error };
      }

      if (!backupResult.data) {
        return { success: false, error: 'Backup not found' };
      }

      const jsonString = JSON.stringify(backupResult.data, null, 2);
      return { success: true, data: jsonString };
    } catch (error) {
      console.error('Failed to export backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export backup'
      };
    }
  }

  /**
   * Import backup from JSON string
   */
  static async importBackup(jsonString: string): Promise<ActionResult<BackupMetadata>> {
    try {
      // Parse JSON
      const backupData = JSON.parse(jsonString) as BackupData;

      // Validate backup data structure
      if (!this.validateBackupData(backupData)) {
        return { success: false, error: 'Invalid backup format' };
      }

      // Create new backup ID
      const timestamp = new Date();
      const backupId = `backup_imported_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
      const backupKey = `${STORAGE_KEYS.BACKUP_DATA}_${backupId}`;

      // Update timestamp
      backupData.timestamp = timestamp;

      // Save imported backup
      const saveResult = await StorageService.setItem(backupKey, backupData);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      // Create metadata
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        notesCount: backupData.notes.length,
        size: jsonString.length,
        source: 'manual',
      };

      // Update backup list
      await this.updateBackupList(metadata);

      return { success: true, data: metadata };
    } catch (error) {
      console.error('Failed to import backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to import backup'
      };
    }
  }

  /**
   * Check if automatic backup is needed
   */
  static async needsAutoBackup(): Promise<boolean> {
    try {
      const lastBackup = await storage.get<Date>(STORAGE_KEYS.LAST_BACKUP);
      if (!lastBackup) {
        return true;
      }

      const timeSinceLastBackup = Date.now() - new Date(lastBackup).getTime();
      return timeSinceLastBackup >= APP_CONFIG.AUTO_BACKUP_INTERVAL;
    } catch (error) {
      console.error('Failed to check backup status:', error);
      return false;
    }
  }

  /**
   * Update backup list with new backup metadata
   */
  private static async updateBackupList(metadata: BackupMetadata): Promise<void> {
    try {
      const listResult = await this.getBackupList();
      const existingList = listResult.success ? listResult.data || [] : [];
      
      const updatedList = [metadata, ...existingList];
      await StorageService.setItem(`${STORAGE_KEYS.BACKUP_DATA}_list`, updatedList);
    } catch (error) {
      console.error('Failed to update backup list:', error);
    }
  }

  /**
   * Clean up old backups to maintain storage limits
   */
  private static async cleanupOldBackups(): Promise<void> {
    try {
      const listResult = await this.getBackupList();
      if (!listResult.success || !listResult.data) {
        return;
      }

      const backups = listResult.data;
      if (backups.length <= APP_CONFIG.MAX_BACKUP_FILES) {
        return;
      }

      // Sort by timestamp and keep only the most recent ones
      const sortedBackups = backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const backupsToDelete = sortedBackups.slice(APP_CONFIG.MAX_BACKUP_FILES);
      
      // Delete old backups
      for (const backup of backupsToDelete) {
        await this.deleteBackup(backup.id);
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Validate backup data structure
   */
  private static validateBackupData(data: any): data is BackupData {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.version === 'string' &&
      data.timestamp &&
      Array.isArray(data.notes) &&
      data.settings &&
      data.metadata &&
      typeof data.metadata.notesCount === 'number'
    );
  }

  /**
   * Get backup statistics
   */
  static async getBackupStats(): Promise<ActionResult<{
    totalBackups: number;
    totalSize: number;
    lastBackup: Date | null;
    autoBackupEnabled: boolean;
  }>> {
    try {
      const listResult = await this.getBackupList();
      if (!listResult.success) {
        return { success: false, error: listResult.error };
      }

      const backups = listResult.data || [];
      const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
      const lastBackup = await storage.get<Date>(STORAGE_KEYS.LAST_BACKUP);

      return {
        success: true,
        data: {
          totalBackups: backups.length,
          totalSize,
          lastBackup,
          autoBackupEnabled: true, // This should come from settings
        }
      };
    } catch (error) {
      console.error('Failed to get backup stats:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get backup stats'
      };
    }
  }
}