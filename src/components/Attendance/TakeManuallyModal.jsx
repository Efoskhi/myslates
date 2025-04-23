import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaTimesCircle,
} from "react-icons/fa";
import Face from "../../assets/Face2.png";
import { ClipLoader } from "react-spinners";
import { docQr } from "../../Logics/docQr";
import { AddData } from "../../Logics/addData";
import toast from "react-hot-toast";
import { collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import { format } from "date-fns";
import useStudents from "../../Hooks/useStudents";
import useClasses from "../../Hooks/useClasses";
import useSubjects from "../../Hooks/useSubject";

const TakeManuallyModal = ({ onClose, attendanceHooks }) => {
    const { students, loading: isLoadingStudents } = useStudents({ shouldGetStudents: true, pageSize: 2000 });
	const { classes } = useClasses({ shouldGetClasses: true, pageSize: 100 });
	const { subjects } = useSubjects({ shouldGetSubjects: true, pageSize: 100 });

	const {
        statusMap,
		isSaving,
		search,
		inputs,
		handleInput,
		setSearch,
        handleSubmitAttendance,
        toggleStatus,
        markAllPresent,
    } = attendanceHooks;


    
    // Render student list
    const RenderedList = useMemo(() => {
        const data = search
            ? students.filter((student) =>
                  student?.display_name
                      ?.toLowerCase()
                      ?.includes(search?.toLowerCase() || "")
              )
            : students;
        const finalData = search ? data : students;
		
        return finalData.map((student) => {
            const status = statusMap.get(student.student_id);
            return (
                <div
                    key={student.id}
                    className="flex justify-between items-center p-2 border-b"
                >
                    <div className="flex items-center">
                        <img
                            src={student.photo_url}
                            alt="avatar"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <span>{student.display_name}</span>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleStatus(student.student_id, "present")}
                        >
                            <FaCheckCircle
                                className={`text-lg ${
                                    status === "present"
                                        ? "text-green-500"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                        <button
                            onClick={() => toggleStatus(student.student_id, "absent")}
                        >
                            <FaTimesCircle
                                className={`text-lg ${
                                    status === "absent"
                                        ? "text-red-500"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                        <button
                            onClick={() => toggleStatus(student.student_id, "excused")}
                        >
                            <FaExclamationCircle
                                className={`text-lg ${
                                    status === "excused"
                                        ? "text-slate-500"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            );
        });
    }, [students, statusMap, toggleStatus, search]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-full justify-end">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Attendance</h2>
                    <button onClick={onClose}>
                        <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <div className="mt-4">
                    <label className="text-sm font-semibold">Grade</label>
                    <select 
						value={inputs.grade}
						onChange={e => handleInput("grade", e.target.value)}
						className="w-full p-2 border rounded mt-1"
					>
                        <option value="">Select Grade</option>
						{classes.map((item, key) => (
							<option value={item.student_class} key={key}>{item.student_class}</option>
						))}
                    </select>
                    <label className="text-sm font-semibold mt-4 block">
                        Course
                    </label>
                    <select 
						value={inputs.subject}
						onChange={e => handleInput("subject", e.target.value)}
						className="w-full p-2 border rounded mt-1"
					>
						<option value="">Select Subject</option>
						{subjects.map((item, key) => (
							<option value={item.id} key={key}>{item.title}</option>
						))}
                    </select>

                    <label className="text-sm font-semibold mt-4 block">
                        Date
                    </label>
                    <input
                        type="date"
                        value={inputs.date}
                        onChange={e => handleInput("date", e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        defaultValue="2024-06-08"
                    />
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <input
                            type="text"
                            onChange={(e) => {
                                const {
                                    target: { value },
                                } = e;
                                setSearch(value);
                            }}
                            value={search}
                            placeholder="Search"
                            className="w-2/3 p-2 border rounded"
                        />
                        <button
                            className="ml-2 px-3 py-1 text-black inline-flex gap-2 text-sm rounded"
                            onClick={markAllPresent}
                        >
                            <input type="checkbox" readOnly checked={false} />
                            Mark all as Present
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {isLoadingStudents ? <ClipLoader size={28} /> : RenderedList}
                    </div>
                </div>

                <button
                    disabled={isSaving}
                    type="button"
                    onClick={() => handleSubmitAttendance()}
                    className="w-full bg-[#0598ce] text-white p-2 rounded mt-4"
                >
                    {isSaving ? <ClipLoader size={20} /> : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default TakeManuallyModal;
