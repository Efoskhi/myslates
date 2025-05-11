import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
import useAssignment from "../../Hooks/useAssignment";
import Loading from "../Layout/Loading";
import { useAppContext } from "../../context/AppContext";

const AssignmentCard = ({ isOwnSubject }) => {

    const { currentSubject } = useAppContext();
    const hooks = useAssignment();
    const {
        isLoading,
        assignments,
        assignmentModalVisible,
        handleAssignmentClick,
        toggleAssignmentModalVisible,
    } = hooks;
    
    return (
        <div className="p-1">
            <div className="flex items-center justify-end mb-5">
                {/* <p className="text-lg font-semibold text-gray-800">
                    Subject: <span className="font-normal text-gray-600">{currentSubject.title}</span>
                </p> */}
                {isOwnSubject && 
                    <button onClick={() => toggleAssignmentModalVisible("Add")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                        Add Assignment
                    </button>
                }
            </div>

            {assignmentModalVisible && 
                <AssignmentDetailsModal hooks={hooks} isOwnSubject={isOwnSubject}/>
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
