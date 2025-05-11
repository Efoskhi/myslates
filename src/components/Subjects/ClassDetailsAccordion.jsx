import { useState } from "react";
import { FaBook, FaClipboard, FaQuestionCircle, FaUsers } from "react-icons/fa";
import StudentList from "./StudentList";
import { useNavigate } from "react-router-dom";

const ClassDetailsAccordion = ({ isOwnSubject }) => {
    const [openSection, setOpenSection] = useState(null);

    const navigate = useNavigate();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };


    return (
        <div className="mx-auto p-4 bg-white shadow-md rounded-2xl">
            {/** Accordion Item: Lessons */}
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => navigate("/subject/topics")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">Topics</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
            </div>
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => navigate("/subject/topics")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">CBT</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
            </div>
            {/* <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => navigate("/subject/assignment")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">Assignment</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
            </div> */}
            {/** Accordion Item: Students */}
            <div>
                <div
                    className="flex items-center justify-between py-4 cursor-pointer"
                    onClick={() => toggleSection("students")}
                >
                    <div className="flex items-center gap-3">
                        <FaUsers className="text-blue-400" />
                        <span className="text-lg font-medium">Students</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                {openSection === "students" && (
                    <div className="p-4">
                        <StudentList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassDetailsAccordion;
