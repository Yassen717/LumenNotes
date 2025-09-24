/**
 * Notes service for managing note CRUD operations with AsyncStorage
 */

import { APP_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '../constants/storage-keys';
import { ActionResult, CreateNoteInput, Note, NotesQueryOptions, UpdateNoteInput } from '../types';
import { StorageService, storage } from './storage';

/**
 * Generate unique ID for notes
 */
function generateNoteId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate note input
 */
function validateNoteInput(input: CreateNoteInput | UpdateNoteInput): string | null {
  if ('title' in input && input.title !== undefined) {
    if (!input.title.trim()) {
      return ERROR_MESSAGES.TITLE_REQUIRED;
    }
    if (input.title.length > APP_CONFIG.MAX_TITLE_LENGTH) {
      return ERROR_MESSAGES.TITLE_TOO_LONG;
    }
  }

  if ('content' in input && input.content !== undefined) {
    if (input.content.length > APP_CONFIG.MAX_NOTE_LENGTH) {
      return ERROR_MESSAGES.NOTE_TOO_LONG;
    }
  }

  if ('tags' in input && input.tags !== undefined) {
    if (input.tags.length > APP_CONFIG.MAX_TAGS_PER_NOTE) {
      return ERROR_MESSAGES.MAX_TAGS_REACHED;
    }
  }

  return null;
}

/**
 * Filter and search notes based on query options
 */
function filterNotes(notes: Note[], options: NotesQueryOptions): Note[] {
  let filtered = [...notes];

  // Filter out deleted notes unless specifically requested
  if (!options.includeDeleted) {
    filtered = filtered.filter(note => !note.isDeleted);
  }

  // Filter by pinned status
  if (options.isPinned !== undefined) {
    filtered = filtered.filter(note => note.isPinned === options.isPinned);
  }

  // Filter by category
  if (options.category) {
    filtered = filtered.filter(note => note.category === options.category);
  }

  // Filter by tags
  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter(note => 
      options.tags!.some(tag => note.tags.includes(tag))
    );
  }

  // Search by term
  if (options.searchTerm) {
    const searchTerm = options.searchTerm.toLowerCase();
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (note.category && note.category.toLowerCase().includes(searchTerm))
    );
  }

  // Sort notes
  const sortField = options.sortBy || 'updatedAt';
  const sortOrder = options.sortOrder || 'desc';

  filtered.sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Convert dates to timestamps for comparison
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // String comparison for title
    if (sortField === 'title') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Apply pagination
  if (options.offset || options.limit) {
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : undefined;
    filtered = filtered.slice(start, end);
  }

  return filtered;
}

/**
 * Notes service class
 */
export class NotesService {
  /**
   * Load all notes from storage
   */
  static async loadNotes(): Promise<ActionResult<Note[]>> {
    try {
      const result = await StorageService.getItem<Note[]>(STORAGE_KEYS.NOTES);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      const notes = result.data || [];
      
      // Convert date strings back to Date objects
      const processedNotes = notes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        // Backward compatibility for older notes that don't have isFavorite
        isFavorite: (note as any).isFavorite ?? false,
      }));

      return { success: true, data: processedNotes };
    } catch (error) {
      console.error('Failed to load notes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.STORAGE_READ_ERROR
      };
    }
  }

  /**
   * Save all notes to storage
   */
  static async saveNotes(notes: Note[]): Promise<ActionResult<void>> {
    try {
      const result = await StorageService.setItem(STORAGE_KEYS.NOTES, notes);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Update notes index for faster searching
      await this.updateNotesIndex(notes);

      return { success: true };
    } catch (error) {
      console.error('Failed to save notes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.STORAGE_ERROR
      };
    }
  }

  /**
   * Create a new note
   */
  static async createNote(input: CreateNoteInput): Promise<ActionResult<Note>> {
    try {
      // Validate input
      const validationError = validateNoteInput(input);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Load existing notes
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];

      // Check if we've reached the maximum number of notes
      if (existingNotes.length >= APP_CONFIG.MAX_NOTES) {
        return { success: false, error: ERROR_MESSAGES.MAX_NOTES_REACHED };
      }

      // Create new note
      const now = new Date();
      const newNote: Note = {
        id: generateNoteId(),
        title: input.title.trim(),
        content: input.content || '',
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        isFavorite: false,
        category: input.category,
        tags: input.tags || [],
        color: input.color,
        isDeleted: false,
      };

      // Add to notes array
      const updatedNotes = [newNote, ...existingNotes];

      // Save to storage
      const saveResult = await this.saveNotes(updatedNotes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: newNote };
    } catch (error) {
      console.error('Failed to create note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NOTE_SAVE_FAILED
      };
    }
  }

  /**
   * Update an existing note
   */
  static async updateNote(input: UpdateNoteInput): Promise<ActionResult<Note>> {
    try {
      // Validate input
      const validationError = validateNoteInput(input);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Load existing notes
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];
      const noteIndex = existingNotes.findIndex(note => note.id === input.id);

      if (noteIndex === -1) {
        return { success: false, error: ERROR_MESSAGES.NOTE_NOT_FOUND };
      }

      // Update note
      const existingNote = existingNotes[noteIndex];
      const updatedNote: Note = {
        ...existingNote,
        ...input,
        updatedAt: new Date(),
      };

      // Update the notes array
      const updatedNotes = [...existingNotes];
      updatedNotes[noteIndex] = updatedNote;

      // Save to storage
      const saveResult = await this.saveNotes(updatedNotes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, data: updatedNote };
    } catch (error) {
      console.error('Failed to update note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NOTE_SAVE_FAILED
      };
    }
  }

  /**
   * Delete a note (soft delete)
   */
  static async deleteNote(id: string): Promise<ActionResult<void>> {
    try {
      const updateResult = await this.updateNote({ 
        id, 
        isDeleted: true 
      });

      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to delete note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NOTE_DELETE_FAILED
      };
    }
  }

  /**
   * Restore a deleted note
   */
  static async restoreNote(id: string): Promise<ActionResult<Note>> {
    try {
      const updateResult = await this.updateNote({ 
        id, 
        isDeleted: false 
      });

      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }

      return { success: true, data: updateResult.data! };
    } catch (error) {
      console.error('Failed to restore note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to restore note'
      };
    }
  }

  /**
   * Permanently delete a note
   */
  static async permanentlyDeleteNote(id: string): Promise<ActionResult<void>> {
    try {
      // Load existing notes
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];
      const updatedNotes = existingNotes.filter(note => note.id !== id);

      // Save to storage
      const saveResult = await this.saveNotes(updatedNotes);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : ERROR_MESSAGES.NOTE_DELETE_FAILED
      };
    }
  }

  /**
   * Toggle pin status of a note
   */
  static async togglePinNote(id: string): Promise<ActionResult<Note>> {
    try {
      // Load existing notes
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];
      const note = existingNotes.find(note => note.id === id);

      if (!note) {
        return { success: false, error: ERROR_MESSAGES.NOTE_NOT_FOUND };
      }

      // Update pin status
      const updateResult = await this.updateNote({ 
        id, 
        isPinned: !note.isPinned 
      });

      return updateResult;
    } catch (error) {
      console.error('Failed to toggle pin note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to toggle pin status'
      };
    }
  }

  /**
   * Toggle favorite status of a note
   */
  static async toggleFavoriteNote(id: string): Promise<ActionResult<Note>> {
    try {
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];
      const note = existingNotes.find(n => n.id === id);
      if (!note) {
        return { success: false, error: ERROR_MESSAGES.NOTE_NOT_FOUND };
      }

      const updateResult = await this.updateNote({ id, isFavorite: !note.isFavorite });
      return updateResult;
    } catch (error) {
      console.error('Failed to toggle favorite note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle favorite status',
      };
    }
  }

  /**
   * Duplicate a note
   */
  static async duplicateNote(id: string): Promise<ActionResult<Note>> {
    try {
      // Load existing notes
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const existingNotes = notesResult.data || [];
      const originalNote = existingNotes.find(note => note.id === id);

      if (!originalNote) {
        return { success: false, error: ERROR_MESSAGES.NOTE_NOT_FOUND };
      }

      // Create duplicate
      const createResult = await this.createNote({
        title: `${originalNote.title} (Copy)`,
        content: originalNote.content,
        category: originalNote.category,
        tags: [...originalNote.tags],
        color: originalNote.color,
      });

      return createResult;
    } catch (error) {
      console.error('Failed to duplicate note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to duplicate note'
      };
    }
  }

  /**
   * Get notes with filtering and searching
   */
  static async getNotes(options: NotesQueryOptions = {}): Promise<ActionResult<Note[]>> {
    try {
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const allNotes = notesResult.data || [];
      const filteredNotes = filterNotes(allNotes, options);

      return { success: true, data: filteredNotes };
    } catch (error) {
      console.error('Failed to get notes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve notes'
      };
    }
  }

  /**
   * Get a single note by ID
   */
  static async getNoteById(id: string): Promise<ActionResult<Note | null>> {
    try {
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const notes = notesResult.data || [];
      const note = notes.find(note => note.id === id);

      return { success: true, data: note || null };
    } catch (error) {
      console.error('Failed to get note by ID:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve note'
      };
    }
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<ActionResult<string[]>> {
    try {
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const notes = notesResult.data || [];
      const categories = new Set<string>();

      notes.forEach(note => {
        if (note.category && !note.isDeleted) {
          categories.add(note.category);
        }
      });

      return { success: true, data: Array.from(categories).sort() };
    } catch (error) {
      console.error('Failed to get categories:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve categories'
      };
    }
  }

  /**
   * Get all tags
   */
  static async getTags(): Promise<ActionResult<string[]>> {
    try {
      const notesResult = await this.loadNotes();
      if (!notesResult.success) {
        return { success: false, error: notesResult.error };
      }

      const notes = notesResult.data || [];
      const tags = new Set<string>();

      notes.forEach(note => {
        if (!note.isDeleted) {
          note.tags.forEach(tag => tags.add(tag));
        }
      });

      return { success: true, data: Array.from(tags).sort() };
    } catch (error) {
      console.error('Failed to get tags:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve tags'
      };
    }
  }

  /**
   * Update notes search index for faster searching
   */
  private static async updateNotesIndex(notes: Note[]): Promise<void> {
    try {
      const searchIndex = notes.map(note => ({
        id: note.id,
        title: note.title.toLowerCase(),
        content: note.content.toLowerCase(),
        category: note.category?.toLowerCase() || '',
        tags: note.tags.map(tag => tag.toLowerCase()),
        isDeleted: note.isDeleted,
      }));

      await storage.set(STORAGE_KEYS.NOTES_INDEX, searchIndex);
    } catch (error) {
      console.error('Failed to update notes index:', error);
    }
  }

  /**
   * Clear all notes data
   */
  static async clearAllNotes(): Promise<ActionResult<void>> {
    try {
      const removeResult = await StorageService.removeItem(STORAGE_KEYS.NOTES);
      if (!removeResult.success) {
        return { success: false, error: removeResult.error };
      }

      await storage.remove(STORAGE_KEYS.NOTES_INDEX);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear all notes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to clear notes'
      };
    }
  }
}
