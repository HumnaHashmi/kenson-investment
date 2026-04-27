import { useColorScheme } from 'react-native';
import { colors, spacing, fonts, fontSizes } from '../theme';

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? { ...colors, ...colors.dark } : colors,
    spacing,
    fonts,
    fontSizes,
  };
};
