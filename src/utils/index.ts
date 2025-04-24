const getCurrentWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMon);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
        dateFrom: monday,
        dateTo: sunday,
    };
};

const getLastWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMon - 7); // go back an extra 7 days
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 5); // 5 is saturday
    sunday.setHours(23, 59, 59, 999);

    return { dateFrom: monday, dateTo: sunday };
};

const formatLocalDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const getCurrentWeekHeader = (): string[] => {
    const { dateFrom } = getCurrentWeekRange();

    const dates = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(dateFrom); // clone
        d.setDate(dateFrom.getDate() + i); // add i days
        return formatLocalDate(d);
    });

    return dates;
};

const getLastWeekHeader = (): string[] => {
    const { dateFrom } = getLastWeekRange();

    const dates = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(dateFrom); // clone
        d.setDate(dateFrom.getDate() + i); // add i days
        return formatLocalDate(d);
    });

    return dates;
};

const getMonthRange = (month: string) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) {
        throw new Error("Invalid month name");
    }

    const year = new Date().getFullYear();

    const dateFrom = new Date(year, monthIndex, 1);
    const dateTo = new Date(year, monthIndex + 1, 0); // 0th day of next month = last day of current month

    return { dateFrom, dateTo };
};

export {
    getCurrentWeekRange,
    getCurrentWeekHeader,
    getLastWeekRange,
    getLastWeekHeader,
    getMonthRange,
};
