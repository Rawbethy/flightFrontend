const months = {
    "01": 'January',
    "02": 'February',
    "03": 'March',
    "04": 'April',
    "05": 'May',
    "06": 'June',
    "07": 'July',
    "08": 'August',
    "09": 'September',
    "10": 'October',
    "11": 'November',
    "12": 'December'
}

export const DateFormat = (date: Date) => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

export const MonthFirstDate = (date: string) => {
    const inputDate = new Date(date);

    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const monthName = months[month as keyof typeof months]
    const day = inputDate.getDate().toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${monthName} ${day}, ${year}`
}

export const AddDays = (date: string, numDays: number) => {
    const inputDate = new Date(date);
    const newDate = new Date(inputDate.getTime() + numDays* 24 * 60 * 60 * 1000)
    
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    const year = newDate.getFullYear();

    return `${year}-${month}-${day}`;
}
