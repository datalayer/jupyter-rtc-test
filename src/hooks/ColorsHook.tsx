import { useMemo } from 'react';
import { useTheme } from '@primer/react';

export const useColors = () => {
  const { theme } = useTheme();
  const okColor = useMemo(() => theme?.colorSchemes.light.colors.success.muted, []);
  const nokColor = useMemo(() => theme?.colorSchemes.light.colors.severe.muted, []);
  return { okColor, nokColor };
};

export default useColors;
