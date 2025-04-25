import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    startOfMonth,
    endOfMonth,
    startOfDay,
    endOfDay,
    startOfWeek as dfStartOfWeek,
    endOfWeek as dfEndOfWeek,
} from "date-fns";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import Loading from "../Layout/Loading";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const MyCalendar = ({ hooks }) => {
	const [ selectedEvent, setSelectedEvent ] = React.useState();

    const {
        view,
		isLoading,
		schedules,
        onNavigate,
        onViewChange
    } = hooks;

    return (
        <div className="p-4 bg-white shadow-md rounded-xl">
			{isLoading && <Loading/>}
            <Calendar
                localizer={localizer}
                events={schedules} // your events
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={["month", "week", "day"]}
                view={view}
                onView={onViewChange}
                onNavigate={onNavigate}
                defaultDate={new Date()}
				onSelectEvent={(event) => setSelectedEvent(event)}
            />
			{selectedEvent && (
				<div className="mt-4 p-4 bg-white shadow-md rounded-md border border-gray-200">
					<h2 className="text-lg font-semibold mb-2">{selectedEvent.title}</h2>
					<p><strong>Start:</strong> {format(selectedEvent.start, "dd MMM yyyy h:mm a")}</p>
					<p><strong>End:</strong> {format(selectedEvent.end, "dd MMM yyyy h:mm a")}</p>
					
					{selectedEvent.resource && (
						<>
							<p><strong>Online:</strong> {selectedEvent.resource.isOnline ? "Yes" : "No"}</p>
							{!selectedEvent.resource.isOnline && <p><strong>Location:</strong> {selectedEvent.resource.location}</p>}
							{selectedEvent.resource.reminder && <p><strong>Reminder:</strong> {format(selectedEvent.resource.reminder, "h:mm a")}</p>}
							{selectedEvent.resource.subject && 
								<>
									<p><strong>Subject:</strong> {selectedEvent.resource.subject.title}</p>
									<img
										src={selectedEvent.resource.subject.thumbnail}
										alt="Subject Thumbnail"
										className="mt-2 w-32 h-32 object-cover rounded"
									/>
								</>
							}
						</>
					)}
				</div>
			)}

        </div>
    );
}

export default MyCalendar;
