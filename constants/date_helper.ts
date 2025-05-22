export const stringToDate = (dateString: string | null): Date => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const yearDifference = (ref1: string | null): number => {
    const parsedBirthdate = stringToDate(ref1);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - parsedBirthdate.getFullYear();
    if (
        currentDate.getMonth() < parsedBirthdate.getMonth() ||
        (currentDate.getMonth() === parsedBirthdate.getMonth() &&
            currentDate.getDate() < parsedBirthdate.getDate())
    ) {
        years -= 1;
    }
    return years;
};

export function getCurrentDate() {
    return new Date();
}

export function getCurrentDateString() {
    return dateToString(getCurrentDate());
}

export function dateToString(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}