export function calculateCategoryTotalRecursively(obj: any) {
if (!isJsonObject(obj)) {
    return obj;
}
let sum = 0;
for (const key in obj) {
    sum += calculateCategoryTotalRecursively(obj[key]);
}
return sum;
}

export const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
};
  
export function isJsonObject(value : any) {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
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
  