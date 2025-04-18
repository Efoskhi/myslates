import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
import useAssignment from "../../Hooks/useAssignment";
import Loading from "../Layout/Loading";

const AssignmentCard = () => {

    const hooks = useAssignment();
    const {
        isLoading,
        assignments,
        assignmentModalVisible,
        handleAssignmentClick,
        toggleAssignmentModalVisible,
    } = hooks;
    
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-blue-700 text-lg font-semibold">
                    📂 <span>Assignment</span>
                </div>
                <button onClick={() => toggleAssignmentModalVisible("Add")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                    Add Assignment
                </button>
            </div>

            {assignmentModalVisible && 
                <AssignmentDetailsModal hooks={hooks} />
            }
            {isLoading && <Loading/>}
            {!isLoading && assignments.length === 0 &&
                <div className="p-6">
                    <p className="text-center text-gray-500">No assignment available.</p>
                </div>
            }

            {assignments.map((assignment, key) => (
                <div
                    key={key}
                    className="inline-flex items-center w-full justify-between cursor-pointer mb-2"
                    onClick={() => handleAssignmentClick(assignment)}
                >
                    <div className="flex align-center gap-10">
                        <div>
                            <img src={assignment.image} className="w-[100px] h-[100px]" />
                            <p className="text-gray-700">Assignment {assignment.assignment_no}</p>

                            <p className="font-semibold overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {assignment.question}
                            </p>
                        </div>
                    </div>
                    <MdKeyboardArrowRight />
                </div>
            ))}
        </div>
    );
};

export default AssignmentCard;
