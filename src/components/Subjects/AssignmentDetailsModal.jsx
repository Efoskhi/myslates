import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaTimesCircle,
} from "react-icons/fa";
import Face from "../../assets/Face2.png";
import AssignmentDeleteModal from "./AssignmentDeleteModal";
import Loading from "../Layout/Loading";

const AssignmentDetailsModal = ({ hooks }) => {
    const [selectedLesson, setSelectedLesson] = useState("Supply and Demand");
    const [question, setQuestion] = useState("");
    const [file, setFile] = useState(null);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile.name);
        }
    };

    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

    const {
        inputs,
        handleInputs,
        classes,
        isLoadingClasses,
        section,
        isSaving,
        toggleAssignmentModalVisible,
        handleAddAssignment,
        handleUpdateAssignment,
        handleDeleteAssignment,
    } = hooks;

    const toggleDeleteModal = () => setDeleteModalVisible((prev) => !prev);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          {section === "Update" && deleteModalVisible && (
            <AssignmentDeleteModal
                toggleModal={toggleDeleteModal}
                handleDeleteAssignment={handleDeleteAssignment}
                isSaving={isSaving}
                assignment={inputs}
            />
          )}

            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-full justify-end overflow-y-auto overscroll-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 ">
                    <h2 className="text-xl font-semibold">
                        Assignment Details
                    </h2>
                    <button onClick={toggleAssignmentModalVisible}>
                        <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1">
                        Assignment Number
                    </label>
                    <input
                        type="tel"
                        placeholder="Enter assignment number"
                        className="w-full p-2 border rounded-md"
                        value={inputs.assignment_no}
                        onChange={(e) => handleInputs("assignment_no", e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1">
                        Max Mark
                    </label>
                    <input
                        type="text"
                        placeholder="Enter maximum mark"
                        className="w-full p-2 border rounded-md"
                        value={inputs.max_mark}
                        onChange={(e) => handleInputs("max_mark", e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        placeholder="Enter maximum mark"
                        className="w-full p-2 border rounded-md"
                        value={inputs.due_date}
                        onChange={(e) => handleInputs("due_date", e.target.value)}
                    />
                </div>

                {/* Associated Lesson */}
                <div className="my-4">
                    <label className="block font-semibold text-sm mb-1">
                        Associated Class
                    </label>
                    <select
                        value={inputs.className}
                        onChange={(e) => handleInputs("className", e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select Class</option>
                        {classes.map((item, key) => (
                            <option value={item.student_class} key={key}>
                                {item.student_class}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Question */}

                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1">
                        Question
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your question"
                        className="w-full p-2 border rounded-md"
                        value={inputs.question}
                        onChange={(e) => handleInputs("question", e.target.value)}
                    />
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <label className="block font-semibold text-sm mb-1">
                        File
                    </label>
                    <div className="border p-4 flex items-center justify-between rounded-md cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            id="fileUpload"
                            accept="image/jpeg, image/png, image/svg"
                            onChange={e => handleInputs("image", e.target.files[0])}
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer">
                            {inputs.image ? (
                                <span className="text-sm">{inputs.image.name}</span>
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    Tap to Upload
                                </span>
                            )}
                            {typeof inputs.image === "string" && inputs.image && 
                              <img src={inputs.image} className="w-full" />
                            }
                        </label>
                        <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
                            Upload
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, SVG | 10MB max.
                    </p>
                </div>

                {/* Action Buttons */}
                {section === "Update" ? (
                    <div className="flex justify-between mt-4">
                        <button
                            disabled={isSaving}
                            onClick={handleUpdateAssignment}
                            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md"
                        >
                            {isSaving ? <Loading /> : "Edit Assignment"}
                        </button>
                        <button
                            onClick={toggleDeleteModal}
                            className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
                        >
                            Delete Assignment
                        </button>
                    </div>
                ) : (
                    <button
                        disabled={isSaving}
                        onClick={handleAddAssignment}
                        className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md"
                    >
                        {isSaving ? <Loading /> : "Add Assignment"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssignmentDetailsModal;
