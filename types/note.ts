/**
 * Core Note interface defining the structure of a note in LumenNotes
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  
  /** Note title */
  title: string;
  
  /** Note content/body */
  content: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last modification timestamp */
  updatedAt: Date;
  
  /** Whether the note is pinned/favorited */
  isPinned: boolean;
  
  /** Optional category/tag for organization */
  category?: string;
  
  /** Array of tags for flexible organization */
  tags: string[];
  
  /** Text color for the note (hex color) */
  color?: string;
  
  /** Indicates if the note has been deleted (soft delete) */
  isDeleted: boolean;
}

/**
 * Input type for creating a new note
 */
export interface CreateNoteInput {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  color?: string;
}

/**
 * Input type for updating an existing note
 */
export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
}

/**
 * Options for querying/filtering notes
 */
export interface NotesQueryOptions {
  /** Search term to filter by title and content */
  searchTerm?: string;
  
  /** Filter by category */
  category?: string;
  
  /** Filter by tags */
  tags?: string[];
  
  /** Filter by pinned status */
  isPinned?: boolean;
  
  /** Include deleted notes */
  includeDeleted?: boolean;
  
  /** Sort field */
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  
  /** Maximum number of results */
  limit?: number;
  
  /** Offset for pagination */
  offset?: number;
}

/**
 * Display modes for notes list
 */
export type NotesViewMode = 'list' | 'grid';

/**
 * Sort options for notes
 */
export type NotesSortOption = {
  field: 'createdAt' | 'updatedAt' | 'title';
  order: 'asc' | 'desc';
  label: string;
};

/**
 * Note statistics for analytics
 */
export interface NoteStats {
  totalNotes: number;
  pinnedNotes: number;
  categoriesCount: number;
  tagsCount: number;
  averageLength: number;
  lastModified?: Date;
}
