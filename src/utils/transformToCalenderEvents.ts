// types.ts
export interface RawEvent {
    id: string;
    title: string;
    start: { seconds: number; nanoseconds: number };
    end: { seconds: number; nanoseconds: number };
    reminder?: { seconds: number; nanoseconds: number };
    isOnline?: boolean;
    location?: string | null;
    subjectRef?: any;
    // …other fields
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
}

/**
 * Convert Firestore timestamp object to JS Date
 */
export function fromFirestoreTs(ts: { seconds: number; nanoseconds: number }): Date {
    return new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6));
}

/**
 * Transforms your backend data into react-big-calendar events
 */
const transformToCalendarEvents = (data: RawEvent[]): CalendarEvent[] => {
    return data.map((item) => {
        const start = fromFirestoreTs(item.start);
        const end = fromFirestoreTs(item.end);

        return {
            id: item.id,
            title: item.title,
            start,
            end,
            // optionally mark all-day if start/end are midnight
            allDay: start.getHours() === 0 && end.getHours() === 0,
            resource: {
                isOnline: item.isOnline,
                location: item.location,
                reminder: item.reminder
                    ? fromFirestoreTs(item.reminder)
                    : null,
                subject: item.subjectRef,
            },
        };
    });
}

export default transformToCalendarEvents;