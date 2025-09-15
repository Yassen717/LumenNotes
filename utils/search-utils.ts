/**
 * Search utility functions for note searching and filtering
 */

import { Note, SearchResult } from '../types';

/**
 * Simple search scoring algorithm
 */
function calculateScore(note: Note, searchTerm: string): number {
  const term = searchTerm.toLowerCase();
  let score = 0;

  // Title matches (highest weight)
  const titleLower = note.title.toLowerCase();
  if (titleLower.includes(term)) {
    score += titleLower.indexOf(term) === 0 ? 100 : 50; // Boost for title start match
  }

  // Content matches (medium weight)
  const contentLower = note.content.toLowerCase();
  if (contentLower.includes(term)) {
    score += 25;
  }

  // Category matches (medium weight)
  if (note.category && note.category.toLowerCase().includes(term)) {
    score += 30;
  }

  // Tag matches (medium weight)
  note.tags.forEach(tag => {
    if (tag.toLowerCase().includes(term)) {
      score += 35;
    }
  });

  // Boost for pinned notes
  if (note.isPinned) {
    score += 10;
  }

  // Penalize deleted notes
  if (note.isDeleted) {
    score -= 50;
  }

  return score;
}

/**
 * Find text matches with positions for highlighting
 */
function findMatches(text: string, searchTerm: string): Array<{ start: number; end: number; text: string }> {
  const matches: Array<{ start: number; end: number; text: string }> = [];
  const textLower = text.toLowerCase();
  const termLower = searchTerm.toLowerCase();
  
  let startIndex = 0;
  while (startIndex < textLower.length) {
    const index = textLower.indexOf(termLower, startIndex);
    if (index === -1) break;
    
    matches.push({
      start: index,
      end: index + termLower.length,
      text: text.substring(index, index + termLower.length)
    });
    
    startIndex = index + termLower.length;
  }
  
  return matches;
}

/**
 * Search notes with scoring and highlighting
 */
export function searchNotes(notes: Note[], searchTerm: string): SearchResult<Note>[] {
  if (!searchTerm.trim()) {
    return notes.map(note => ({
      item: note,
      score: 0,
      highlights: []
    }));
  }

  const results: SearchResult<Note>[] = [];

  notes.forEach(note => {
    const score = calculateScore(note, searchTerm);
    
    // Only include notes with positive scores
    if (score > 0) {
      const highlights: SearchResult<Note>['highlights'] = [];

      // Find highlights in title
      const titleMatches = findMatches(note.title, searchTerm);
      if (titleMatches.length > 0) {
        highlights.push({
          field: 'title',
          matches: titleMatches
        });
      }

      // Find highlights in content
      const contentMatches = findMatches(note.content, searchTerm);
      if (contentMatches.length > 0) {
        highlights.push({
          field: 'content',
          matches: contentMatches
        });
      }

      // Find highlights in category
      if (note.category) {
        const categoryMatches = findMatches(note.category, searchTerm);
        if (categoryMatches.length > 0) {
          highlights.push({
            field: 'category',
            matches: categoryMatches
          });
        }
      }

      // Find highlights in tags
      note.tags.forEach((tag, index) => {
        const tagMatches = findMatches(tag, searchTerm);
        if (tagMatches.length > 0) {
          highlights.push({
            field: `tags[${index}]`,
            matches: tagMatches
          });
        }
      });

      results.push({
        item: note,
        score,
        highlights
      });
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Filter notes by multiple criteria
 */
export function filterNotes(
  notes: Note[],
  filters: {
    categories?: string[];
    tags?: string[];
    isPinned?: boolean;
    isDeleted?: boolean;
    dateRange?: {
      start: Date;
      end: Date;
    };
    hasCategory?: boolean;
    hasTags?: boolean;
  }
): Note[] {
  return notes.filter(note => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!note.category || !filters.categories.includes(note.category)) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => note.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Pinned filter
    if (filters.isPinned !== undefined && note.isPinned !== filters.isPinned) {
      return false;
    }

    // Deleted filter
    if (filters.isDeleted !== undefined && note.isDeleted !== filters.isDeleted) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const noteDate = new Date(note.updatedAt);
      if (noteDate < filters.dateRange.start || noteDate > filters.dateRange.end) {
        return false;
      }
    }

    // Has category filter
    if (filters.hasCategory !== undefined) {
      const hasCategory = Boolean(note.category);
      if (hasCategory !== filters.hasCategory) {
        return false;
      }
    }

    // Has tags filter
    if (filters.hasTags !== undefined) {
      const hasTags = note.tags.length > 0;
      if (hasTags !== filters.hasTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort notes by specified criteria
 */
export function sortNotes(
  notes: Note[],
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'category',
  sortOrder: 'asc' | 'desc' = 'desc'
): Note[] {
  const sorted = [...notes].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'category':
        const catA = a.category || '';
        const catB = b.category || '';
        comparison = catA.localeCompare(catB);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Always put pinned notes first
  return sorted.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
}

/**
 * Get search suggestions based on existing notes
 */
export function getSearchSuggestions(notes: Note[], currentSearch: string = ''): string[] {
  const suggestions = new Set<string>();
  const searchLower = currentSearch.toLowerCase();

  notes.forEach(note => {
    // Add title words
    note.title.split(' ').forEach(word => {
      const wordLower = word.toLowerCase();
      if (wordLower.length > 2 && wordLower.includes(searchLower)) {
        suggestions.add(word);
      }
    });

    // Add categories
    if (note.category && note.category.toLowerCase().includes(searchLower)) {
      suggestions.add(note.category);
    }

    // Add tags
    note.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchLower)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 10); // Limit to 10 suggestions
}

/**
 * Extract keywords from note content for search indexing
 */
export function extractKeywords(text: string): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
    .slice(0, 20); // Limit to 20 keywords
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string, 
  searchTerm: string, 
  highlightStart: string = '<mark>',
  highlightEnd: string = '</mark>'
): string {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `${highlightStart}$1${highlightEnd}`);
}

/**
 * Get excerpt from content with search term context
 */
export function getSearchExcerpt(
  content: string, 
  searchTerm: string, 
  maxLength: number = 150
): string {
  if (!searchTerm.trim()) {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  const termIndex = content.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (termIndex === -1) {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  // Calculate excerpt start and end positions to center the search term
  const halfLength = Math.floor(maxLength / 2);
  let start = Math.max(0, termIndex - halfLength);
  let end = Math.min(content.length, start + maxLength);

  // Adjust start if we're near the end
  if (end - start < maxLength) {
    start = Math.max(0, end - maxLength);
  }

  let excerpt = content.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) {
    excerpt = '...' + excerpt;
  }
  if (end < content.length) {
    excerpt = excerpt + '...';
  }

  return excerpt;
}