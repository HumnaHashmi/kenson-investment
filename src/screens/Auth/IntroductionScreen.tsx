import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../../theme';
import { ROUTES } from '../../constants/routes';
import type { IntroScreenProps } from '../../types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const { width } = Dimensions.get('window');

const SLIDES: { id: string; icon: IoniconsName; title: string; description: string; bg: string }[] = [
  {
    id: '1',
    icon: 'stats-chart',
    title: 'Track Your Investments',
    description: 'Monitor your portfolio performance in real-time with detailed analytics and smart insights.',
    bg: colors.primary,
  },
  {
    id: '2',
    icon: 'cash',
    title: 'Grow Your Wealth',
    description: 'Maximize your returns with our expert-guided investment plans and profit tracking tools.',
    bg: colors.primaryDark,
  },
  {
    id: '3',
    icon: 'shield-checkmark',
    title: 'Safe & Secure',
    description: 'Your investments are protected with bank-grade security and transparent reporting.',
    bg: '#0D2B5E',
  },
];

export const IntroductionScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      navigation.replace(ROUTES.AUTH.LOGIN);
    }
  };

  const handleSkip = () => navigation.replace(ROUTES.AUTH.LOGIN);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={e => {
          setCurrent(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width, backgroundColor: item.bg }]}>
            <View style={styles.slideIconBox}>
              <Ionicons name={item.icon} size={64} color="rgba(255,255,255,0.95)" />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>
          {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons
          name={current === SLIDES.length - 1 ? 'rocket' : 'arrow-forward'}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  skip: { position: 'absolute', top: 60, right: spacing.base, zIndex: 10 },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: fontSizes.sm },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: 160,
  },
  slideIconBox: {
    width: 120, height: 120, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  slideTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  slideDesc: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: { backgroundColor: colors.accent, width: 24 },
  btn: {
    position: 'absolute',
    bottom: 44,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.accent,
    paddingVertical: spacing.base,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.base },
});
