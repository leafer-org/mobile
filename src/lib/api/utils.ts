export const serializeToFormData = (src?: Record<string, string | Blob>) => {
  const formData = new FormData();

  if (src) {
    for (const key in src) {
      if (Object.hasOwn(src, key)) {
        formData.append(key, src[key]);
      }
    }
  }

  return formData;
};
