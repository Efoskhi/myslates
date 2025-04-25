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

/**
 * Combines a date string and two 24-hour time strings into start/end Date objects,
 * validating that end > start.
 * 
 * @param dateStr   Date in "YYYY-MM-DD" format
 * @param timeFrom  Start time in "HH:mm"
 * @param timeTo    End   time in "HH:mm"
 * @returns         { startDate, endDate }
 * @throws          Error if timeTo is not after timeFrom or inputs invalid
 */
const getDateTimeRange = (
    dateStr: string,
    timeFrom: string,
    timeTo?: string,
  ): { startDate: Date; endDate: Date } => {
    // Basic validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error("Invalid date format (expected YYYY-MM-DD)");
    }
    if (!/^\d{2}:\d{2}$/.test(timeFrom) || (timeTo && !/^\d{2}:\d{2}$/.test(timeTo))) {
      throw new Error("Invalid time format (expected HH:mm)");
    }
  
    // Build full ISO strings
    const startISO = `${dateStr}T${timeFrom}:00`;
    const endISO   = `${dateStr}T${timeTo  }:00`;
  
    const startDate = new Date(startISO);
    const endDate   = new Date(endISO);
  
    if (Number.isNaN(startDate.getTime()) ||(timeTo && Number.isNaN(endDate.getTime()))) {
      throw new Error("Invalid date or time values");
    }
  
    if ((endDate <= startDate) && timeTo) {
      throw new Error("timeTo must be later than timeFrom");
    }
  
    return { startDate, endDate };
  }
  
  function getDuration(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime(); // difference in milliseconds
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
  
    const hourStr = hours > 0 ? `${hours}h` : "";
    const minStr = minutes > 0 ? `${minutes}m` : "";
  
    return `${hourStr} ${minStr}`.trim();
  }
  

export {
    getCurrentWeekRange,
    getCurrentWeekHeader,
    getLastWeekRange,
    getLastWeekHeader,
    getMonthRange,
    getDateTimeRange,
    getDuration,
};
