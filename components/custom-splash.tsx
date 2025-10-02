import { useTheme } from '@/context';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CustomSplashProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export function CustomSplash({ onComplete }: CustomSplashProps) {
  const { theme, isDark } = useTheme();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create animated sequence
    const animateSequence = Animated.sequence([
      // Initial fade in with scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // Slide up text with rotation
      Animated.parallel([
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(1200),
      // Final fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    animateSequence.start(() => {
      onComplete();
    });
  }, [fadeAnim, scaleAnim, slideUpAnim, logoRotateAnim, onComplete]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.background} />
      <ThemedView style={styles.container}>
        {/* Gradient Background Effect */}
        <View style={[
          styles.gradientBackground,
          { backgroundColor: theme.surface }
        ]}>
          {/* Decorative circles */}
          <View style={[
            styles.decorativeCircle,
            styles.circle1,
            { backgroundColor: theme.primary + '15' }
          ]} />
          <View style={[
            styles.decorativeCircle,
            styles.circle2,
            { backgroundColor: theme.secondary + '10' }
          ]} />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                backgroundColor: theme.primary,
                transform: [{ rotate: logoRotation }],
              },
            ]}
          >
            <View style={[styles.logoInner, { backgroundColor: theme.accent }]}>
              <ThemedText style={[styles.logoText, { color: '#FFFFFF' }]}>
                L
              </ThemedText>
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <View style={styles.brandContainer}>
              <ThemedText style={[styles.brandLumen, { color: '#2196F3' }]}>
                Lumen
              </ThemedText>
              <ThemedText style={[styles.brandNotes, { color: theme.text }]}>
                Notes
              </ThemedText>
            </View>
            
            <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
              Illuminate your thoughts
            </ThemedText>
          </Animated.View>

          {/* Animated dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: theme.primary,
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1 - index * 0.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 200,
  },
  circle1: {
    width: 300,
    height: 300,
    top: '15%',
    right: '-20%',
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: '20%',
    left: '-15%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoInner: {
    width: 65,
    height: 65,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  brandLumen: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  brandNotes: {
    fontSize: 36,
    fontWeight: '300',
    letterSpacing: -1,
    marginLeft: 2,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});