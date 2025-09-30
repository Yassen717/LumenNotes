/**
 * Custom themed Alert dialog component that respects dark mode
 */

import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { Button } from './button';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onRequestClose?: () => void;
}

export function ThemedAlert({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onRequestClose,
}: ThemedAlertProps) {
  const { theme } = useTheme();

  const handleBackdropPress = () => {
    // Find cancel button and call its onPress, or close if no cancel button
    const cancelButton = buttons.find(button => button.style === 'cancel');
    if (cancelButton?.onPress) {
      cancelButton.onPress();
    } else if (onRequestClose) {
      onRequestClose();
    }
  };

  const getButtonVariant = (style?: string) => {
    switch (style) {
      case 'destructive':
        return 'destructive';
      case 'cancel':
        return 'outline';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <ThemedView style={[
              styles.alertBox,
              { 
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: theme.text,
              }
            ]}>
              {/* Title */}
              <ThemedText style={[styles.title, { color: theme.text }]}>
                {title}
              </ThemedText>

              {/* Message */}
              {message && (
                <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
                  {message}
                </ThemedText>
              )}

              {/* Buttons */}
              <View style={[
                styles.buttonContainer,
                buttons.length === 1 && styles.singleButtonContainer
              ]}>
                {buttons.map((button, index) => {
                  const buttonStyle: ViewStyle = buttons.length === 1 
                    ? styles.singleButton
                    : styles.button;
                  
                  return (
                    <Button
                      key={index}
                      title={button.text}
                      variant={getButtonVariant(button.style)}
                      onPress={button.onPress || (() => {})}
                      style={buttonStyle}
                      size="medium"
                    />
                  );
                })}
              </View>
            </ThemedView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/**
 * Hook to show themed alerts
 */
export function useThemedAlert() {
  const [alertState, setAlertState] = React.useState<{
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = React.useCallback((
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
  }, []);

  const hideAlert = React.useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = React.useCallback(() => (
    <ThemedAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      buttons={alertState.buttons?.map(button => ({
        ...button,
        onPress: () => {
          button.onPress?.();
          hideAlert();
        },
      }))}
      onRequestClose={hideAlert}
    />
  ), [alertState, hideAlert]);

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  alertBox: {
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: 400,
    width: '100%',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  singleButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
  singleButton: {
    minWidth: 120,
    paddingHorizontal: 24,
  },
});