import tinycolor from 'tinycolor2';

export const isDark = (value): boolean => {
  if (!value) return false;
  const color = value.toString();
  const lum = tinycolor(color).getLuminance();
  return lum < 0.55;
};

export function isPromise(value: any) {
  return Boolean(value && typeof value.then === 'function');
}
