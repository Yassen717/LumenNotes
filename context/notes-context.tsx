/**
 * Notes Context Provider for managing note state across the app
 */

import React, { createContext, useCallback, useContext, useReducer } from 'react';
import { CreateNoteInput, Note, UpdateNoteInput } from '../types';

/**
 * Notes state interface
 */
interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredNotes: Note[];
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  viewMode: 'list' | 'grid';
}

/**
 * Notes actions
 */
type NotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'RESTORE_NOTE'; payload: string }
  | { type: 'TOGGLE_PIN_NOTE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERED_NOTES'; payload: Note[] }
  | { type: 'SET_CATEGORY_FILTER'; payload: string | null }
  | { type: 'SET_TAG_FILTER'; payload: string[] }
  | { type: 'SET_SORT'; payload: { sortBy: 'createdAt' | 'updatedAt' | 'title'; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_VIEW_MODE'; payload: 'list' | 'grid' }
  | { type: 'CLEAR_FILTERS' };

/**
 * Context interface
 */
interface NotesContextType extends NotesState {
  // Note operations
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (input: UpdateNoteInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;
  duplicateNote: (id: string) => Promise<Note>;
  
  // Search and filtering
  searchNotes: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  filterByTags: (tags: string[]) => void;
  clearFilters: () => void;
  
  // Sorting and view
  setSortOption: (sortBy: 'createdAt' | 'updatedAt' | 'title', sortOrder: 'asc' | 'desc') => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  
  // Data operations
  loadNotes: () => Promise<void>;
  refreshNotes: () => Promise<void>;
  
  // Utility functions
  getNoteById: (id: string) => Note | undefined;
  getCategories: () => string[];
  getTags: () => string[];
  getNotesStats: () => {
    total: number;
    pinned: number;
    categories: number;
    tags: number;
  };
}

/**
 * Initial state
 */
const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  filteredNotes: [],
  selectedCategory: null,
  selectedTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  viewMode: 'list',
};

/**
 * Notes reducer
 */
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
      
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
      
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        ),
      };
      
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isDeleted: true } : note
        ),
      };
      
    case 'RESTORE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isDeleted: false } : note
        ),
      };
      
    case 'TOGGLE_PIN_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isPinned: !note.isPinned } : note
        ),
      };
      
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
      
    case 'SET_FILTERED_NOTES':
      return { ...state, filteredNotes: action.payload };
      
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategory: action.payload };
      
    case 'SET_TAG_FILTER':
      return { ...state, selectedTags: action.payload };
      
    case 'SET_SORT':
      return { 
        ...state, 
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };
      
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
      
    case 'CLEAR_FILTERS':
      return {
        ...state,
        searchQuery: '',
        selectedCategory: null,
        selectedTags: [],
        filteredNotes: state.notes,
      };
      
    default:
      return state;
  }
}

/**
 * Create context
 */
const NotesContext = createContext<NotesContextType | undefined>(undefined);

/**
 * Notes Context Provider component
 */
export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // We'll implement these functions when we create the notes service
  const createNote = useCallback(async (input: CreateNoteInput): Promise<Note> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const updateNote = useCallback(async (input: UpdateNoteInput): Promise<Note> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const restoreNote = useCallback(async (id: string): Promise<void> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const togglePinNote = useCallback(async (id: string): Promise<void> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const duplicateNote = useCallback(async (id: string): Promise<Note> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  // Search and filtering functions
  const searchNotes = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query.trim()) {
      dispatch({ type: 'SET_FILTERED_NOTES', payload: state.notes });
      return;
    }

    const filtered = state.notes.filter(note => {
      const searchTerm = query.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (note.category && note.category.toLowerCase().includes(searchTerm))
      );
    });

    dispatch({ type: 'SET_FILTERED_NOTES', payload: filtered });
  }, [state.notes]);

  const filterByCategory = useCallback((category: string | null) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
  }, []);

  const filterByTags = useCallback((tags: string[]) => {
    dispatch({ type: 'SET_TAG_FILTER', payload: tags });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Sorting and view
  const setSortOption = useCallback((sortBy: 'createdAt' | 'updatedAt' | 'title', sortOrder: 'asc' | 'desc') => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  }, []);

  const setViewMode = useCallback((mode: 'list' | 'grid') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  // Data operations
  const loadNotes = useCallback(async (): Promise<void> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  const refreshNotes = useCallback(async (): Promise<void> => {
    // TODO: Implement with notes service
    throw new Error('Not implemented yet');
  }, []);

  // Utility functions
  const getNoteById = useCallback((id: string): Note | undefined => {
    return state.notes.find(note => note.id === id);
  }, [state.notes]);

  const getCategories = useCallback((): string[] => {
    const categories = new Set<string>();
    state.notes.forEach(note => {
      if (note.category && !note.isDeleted) {
        categories.add(note.category);
      }
    });
    return Array.from(categories).sort();
  }, [state.notes]);

  const getTags = useCallback((): string[] => {
    const tags = new Set<string>();
    state.notes.forEach(note => {
      if (!note.isDeleted) {
        note.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [state.notes]);

  const getNotesStats = useCallback(() => {
    const activeNotes = state.notes.filter(note => !note.isDeleted);
    return {
      total: activeNotes.length,
      pinned: activeNotes.filter(note => note.isPinned).length,
      categories: getCategories().length,
      tags: getTags().length,
    };
  }, [state.notes, getCategories, getTags]);

  // Context value
  const contextValue: NotesContextType = {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    togglePinNote,
    duplicateNote,
    searchNotes,
    filterByCategory,
    filterByTags,
    clearFilters,
    setSortOption,
    setViewMode,
    loadNotes,
    refreshNotes,
    getNoteById,
    getCategories,
    getTags,
    getNotesStats,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

/**
 * Hook to use notes context
 */
export function useNotes(): NotesContextType {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

/**
 * Hook to get a specific note by ID
 */
export function useNote(id: string): Note | undefined {
  const { getNoteById } = useNotes();
  return getNoteById(id);
}
