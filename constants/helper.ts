export function calculateCategoryTotalRecursively(obj: any): number {
  if (typeof obj === "number" && !isNaN(obj)) {
    return obj;
  }
  if (!isJsonObject(obj)) {
    return 0;
  }
  let sum = 0;
  for (const key in obj) {
    sum += calculateCategoryTotalRecursively(obj[key]);
  }
  return sum;
}

export function calculateSpecificCategoryTotalRecursively(
  obj: any,
  find: string,
  parent: string
): number {
  if (typeof obj === "number" && !isNaN(obj) && parent === find) {
    return obj;
  }
  if (!isJsonObject(obj)) {
    return 0;
  }
  let found = 0;
  for (const key in obj) {
    found = Math.max(
      calculateSpecificCategoryTotalRecursively(obj[key], find, key),
      found
    );
  }
  return found;
}

export function recursiveMapper(obj: any, factor: number) {
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] = factor * obj[key];
    } else if (isJsonObject(obj[key])) {
      recursiveMapper(obj[key], factor);
    }
  }
}

export const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export function isJsonObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const toggleSection = (
  section: string,
  setSection: (
    value: React.SetStateAction<{
      [key: string]: boolean;
    }>
  ) => void
) => {
  setSection((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};
