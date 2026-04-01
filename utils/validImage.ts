export const isValidImageUrl = (url: string) => {
  return url?.startsWith("http") && !url?.includes("<!doctype");
};