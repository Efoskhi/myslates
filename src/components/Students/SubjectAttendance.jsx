import { format } from "date-fns";
import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import Loading from "../Layout/Loading";

export default function SubjectAttendance({ subjects, hooks }) {
    const { isLoading, filters, attendance, handleFilter } = hooks;

    // Step 1: Remove duplicates by date (keep first occurrence)
    const uniqueAttendance = Object.values(
        attendance.reduce((acc, curr) => {
            const dateKey = curr.date.seconds;
            if (!acc[dateKey]) acc[dateKey] = curr;
            return acc;
        }, {})
    );

    // Step 2: Calculate total and status counts
    const total = uniqueAttendance.length;

    const statusCount = uniqueAttendance.reduce((acc, curr) => {
        const status = curr.status?.toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // Step 3: Format data for visualization
    const data = [
        {
            name: "Present",
            value: Math.round(((statusCount["present"] || 0) / total) * 100),
            color: "#1E90FF",
            originalValue: statusCount["present"] || 0,
        },
        {
            name: "Absent",
            value: Math.round(((statusCount["absent"] || 0) / total) * 100),
            color: "#ADD8E6",
            originalValue: statusCount["absent"] || 0,
        },
        {
            name: "Excused",
            value: Math.round(((statusCount["excused"] || 0) / total) * 100),
            color: "#FFD700",
            originalValue: statusCount["excused"] || 0,
        },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, payload: innerPayload } = payload[0];
			const value = innerPayload.originalValue;

            return (
                <div className="bg-white border px-3 py-2 rounded shadow text-sm">
                    <p className="text-gray-700 font-medium">{name}</p>
                    <p className="text-gray-500">
                        {value} day{value > 1 ? "s" : ""}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-white p-6 w-full ">
            {isLoading && <Loading />}
            {/* Dropdowns */}
            <div className="flex justify-between mb-4">
                <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    value={filters.subject}
                    onChange={(e) => handleFilter("subject", e.target.value)}
                >
                    <option value="">Select Subject</option>
                    {subjects.map((item, key) => (
                        <option value={item.id} key={key}>
                            {item.title.split("by")[0]}
                        </option>
                    ))}
                </select>
                <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    onChange={(e) => handleFilter("month", e.target.value)}
                    value={filters.month}
                >
                    {Array.from({ length: 12 }, (_, i) => {
                        const currentYear = new Date().getFullYear();
                        const monthName = format(
                            new Date(currentYear, i, 1),
                            "MMMM"
                        );
                        return (
                            <option key={i} value={monthName}>
                                {monthName}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Chart */}
            <h2 className="text-lg font-semibold mb-2">Subject Attendance</h2>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
