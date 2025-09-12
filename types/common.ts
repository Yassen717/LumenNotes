/**
 * Common utility types and interfaces
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async operation state
 */
export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Search result with highlighting
 */
export interface SearchResult<T = any> {
  item: T;
  score: number;
  highlights: {
    field: string;
    matches: Array<{
      start: number;
      end: number;
      text: string;
    }>;
  }[];
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Date range filter
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Generic filter interface
 */
export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Query parameters
 */
export interface QueryParams {
  filters?: Filter[];
  sort?: SortConfig[];
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Action result
 */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

/**
 * File info
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  path?: string;
}

/**
 * Color theme
 */
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Position
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Rect (position + dimensions)
 */
export interface Rect extends Position, Dimensions {}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

/**
 * Gesture event data
 */
export interface GestureEvent {
  type: 'tap' | 'swipe' | 'pinch' | 'rotate' | 'pan';
  position: Position;
  velocity?: Position;
  scale?: number;
  rotation?: number;
}

/**
 * Component props base
 */
export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: any;
  children?: React.ReactNode;
}