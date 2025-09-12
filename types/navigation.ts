/**
 * Navigation types for Expo Router
 */

/**
 * Root navigation stack params
 */
export type RootStackParamList = {
  '(tabs)': undefined;
  'note/[id]': { id: string };
  'note/create': undefined;
  'note/edit/[id]': { id: string };
  'modal': undefined;
  '(onboarding)': undefined;
  'splash': undefined;
};

/**
 * Tab navigation params
 */
export type TabParamList = {
  'index': undefined;
  'pinned': undefined;
  'settings': undefined;
  'explore': undefined;
};

/**
 * Note-related screen params
 */
export type NoteStackParamList = {
  '[id]': { id: string };
  'create': undefined;
  'edit/[id]': { id: string };
};

/**
 * Onboarding flow params
 */
export type OnboardingStackParamList = {
  'welcome': undefined;
  'features': undefined;
};

/**
 * Modal types
 */
export type ModalType = 
  | 'note-actions'
  | 'delete-confirmation'
  | 'category-selector'
  | 'tag-editor'
  | 'color-picker'
  | 'export-options';

/**
 * Modal props
 */
export interface ModalProps {
  type: ModalType;
  data?: any;
  onClose: () => void;
  onAction?: (action: string, data?: any) => void;
}

/**
 * Navigation action types
 */
export type NavigationAction = 
  | { type: 'navigate'; screen: string; params?: any }
  | { type: 'goBack' }
  | { type: 'reset'; routes: any[] }
  | { type: 'push'; screen: string; params?: any }
  | { type: 'replace'; screen: string; params?: any };