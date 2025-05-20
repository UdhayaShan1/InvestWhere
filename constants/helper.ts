  export const parseDate = (dateString: string | null): Date => {
    if (!dateString) return new Date();

    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  export const yearDifference = (ref1: string | null): number => {
    const parsedBirthdate = parseDate(ref1);
    
    parsedBirthdate.setHours(parsedBirthdate.getHours() + 8);
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 8);

    let years = currentDate.getFullYear() - parsedBirthdate.getFullYear();
    if (
        currentDate.getMonth() < parsedBirthdate.getMonth() ||
        (currentDate.getMonth() == parsedBirthdate.getMonth() &&
            currentDate.getDate() < parsedBirthdate.getDate())
    ) {
        years -= 1;
    }
    return years;
}