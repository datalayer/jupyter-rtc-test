export const strip = (s: string | undefined, max = 10) => {
  if (!s) {
    return "";
  }
  if (s.length > max * 2) {
    return s.substring(0, max) + "..." + s.substring(s.length - max, s.length);
  }
  return s;
};
