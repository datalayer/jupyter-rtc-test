export const strip = (s: string | undefined, max = 20) => {
  if (!s) {
    return "";
  }
  if (s.length > max) {
    return s.substring(0, max) + "..."
  }
  return s;
};
