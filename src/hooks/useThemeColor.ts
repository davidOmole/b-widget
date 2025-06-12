import { useEffect } from 'react';
import { Colors } from 'mainstack-design-system';

export const useThemeColor = (themeColor?: string) => {
    console.log('themeColor', themeColor);
  useEffect(() => {
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
      root.style.setProperty('--booking-custom-color', themeColor || Colors.black300);
    }
  }, [themeColor]);
}; 