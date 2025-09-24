/**
 * Notes Context Provider for managing note state across the app
 */

import React, { createContext, useCallback, useContext, useReducer } from 'react';
import { NotesService } from '../services';
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
  | { type: 'TOGGLE_FAVORITE_NOTE'; payload: string }
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
  toggleFavoriteNote: (id: string) => Promise<void>;
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
      
    case 'TOGGLE_FAVORITE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload ? { ...note, isFavorite: !note.isFavorite } : note
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

  // Helper to recompute filtered notes based on current filters/search/sort
  const computeFilteredNotes = useCallback((notes: Note[]): Note[] => {
    let filtered = [...notes];

    // Apply search query
    const query = state.searchQuery?.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (note.category && note.category.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(note => note.category === state.selectedCategory);
    }

    // Apply tag filters (any-match)
    if (state.selectedTags && state.selectedTags.length > 0) {
      filtered = filtered.filter(note => state.selectedTags.some(tag => note.tags.includes(tag)));
    }

    // Sort
    const sortField = state.sortBy || 'updatedAt';
    const sortOrder = state.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let aValue: any = (a as any)[sortField];
      let bValue: any = (b as any)[sortField];

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (sortField === 'title') {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return filtered;
  }, [state.searchQuery, state.selectedCategory, state.selectedTags, state.sortBy, state.sortOrder]);

  // We'll implement these functions with the notes service
  const createNote = useCallback(async (input: CreateNoteInput): Promise<Note> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.createNote(input);
      
      if (result.success && result.data) {
        dispatch({ type: 'ADD_NOTE', payload: result.data });
        // Keep filteredNotes in sync
        const newNotes = [result.data, ...state.notes];
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create note');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const updateNote = useCallback(async (input: UpdateNoteInput): Promise<Note> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.updateNote(input);
      
      if (result.success && result.data) {
        dispatch({ type: 'UPDATE_NOTE', payload: result.data });
        // Keep filteredNotes in sync
        const newNotes = state.notes.map(n => n.id === result.data!.id ? result.data! : n);
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update note');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.deleteNote(id);
      
      if (result.success) {
        dispatch({ type: 'DELETE_NOTE', payload: id });
        // Keep filteredNotes in sync (soft delete)
        const newNotes = state.notes.map(n => n.id === id ? { ...n, isDeleted: true } : n);
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
      } else {
        throw new Error(result.error || 'Failed to delete note');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const restoreNote = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.restoreNote(id);
      
      if (result.success) {
        dispatch({ type: 'RESTORE_NOTE', payload: id });
        const newNotes = state.notes.map(n => n.id === id ? { ...n, isDeleted: false } : n);
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
      } else {
        throw new Error(result.error || 'Failed to restore note');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const togglePinNote = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.togglePinNote(id);
      
      if (result.success) {
        dispatch({ type: 'TOGGLE_PIN_NOTE', payload: id });
        const newNotes = state.notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
      } else {
        throw new Error(result.error || 'Failed to toggle pin status');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle pin status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const toggleFavoriteNote = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.toggleFavoriteNote(id);
      
      if (result.success) {
        dispatch({ type: 'TOGGLE_FAVORITE_NOTE', payload: id });
        const newNotes = state.notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n);
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
      } else {
        throw new Error(result.error || 'Failed to toggle favorite status');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favorite status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  const duplicateNote = useCallback(async (id: string): Promise<Note> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const result = await NotesService.duplicateNote(id);
      
      if (result.success && result.data) {
        dispatch({ type: 'ADD_NOTE', payload: result.data });
        const newNotes = [result.data, ...state.notes];
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(newNotes) });
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to duplicate note');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, [state.notes, computeFilteredNotes]);

  // Search and filtering functions
  const searchNotes = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query.trim()) {
      // When clearing search, reflect current notes and filters
      const recomputed = computeFilteredNotes(state.notes);
      dispatch({ type: 'SET_FILTERED_NOTES', payload: recomputed });
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
  }, [state.notes, computeFilteredNotes]);

  const filterByCategory = useCallback((category: string | null) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
    const recomputed = computeFilteredNotes(state.notes);
    dispatch({ type: 'SET_FILTERED_NOTES', payload: recomputed });
  }, [state.notes, computeFilteredNotes]);

  const filterByTags = useCallback((tags: string[]) => {
    dispatch({ type: 'SET_TAG_FILTER', payload: tags });
    const recomputed = computeFilteredNotes(state.notes);
    dispatch({ type: 'SET_FILTERED_NOTES', payload: recomputed });
  }, [state.notes, computeFilteredNotes]);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Sorting and view
  const setSortOption = useCallback((sortBy: 'createdAt' | 'updatedAt' | 'title', sortOrder: 'asc' | 'desc') => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
    const recomputed = computeFilteredNotes(state.notes);
    dispatch({ type: 'SET_FILTERED_NOTES', payload: recomputed });
  }, [state.notes, computeFilteredNotes]);

  const setViewMode = useCallback((mode: 'list' | 'grid') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  // Data operations
  const loadNotes = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const result = await NotesService.loadNotes();
      
      if (result.success && result.data) {
        dispatch({ type: 'SET_NOTES', payload: result.data });
        dispatch({ type: 'SET_FILTERED_NOTES', payload: computeFilteredNotes(result.data) });
      } else {
        throw new Error(result.error || 'Failed to load notes');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load notes';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [computeFilteredNotes]);

  const refreshNotes = useCallback(async (): Promise<void> => {
    await loadNotes();
  }, [loadNotes]);

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

  // Load notes on component mount
  React.useEffect(() => {
    loadNotes().catch(console.error);
  }, [loadNotes]);

  // Context value
  const contextValue: NotesContextType = {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    togglePinNote,
    toggleFavoriteNote,
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
