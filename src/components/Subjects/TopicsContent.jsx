import React from "react";

const TopicsContent = () => {
    return (
        <div>
            {/** Accordion Item: Lessons */}
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => toggleSection("lessons")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">Lessons</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                {openSection === "lessons" && (
                    <div className="p-4">
                        <div className="inline-flex items-center w-full justify-between cursor-pointer">
                            <div className="inline-flex gap-6">
                                <img src={Book} className="h-12" />
                                <div>
                                    <p className="text-gray-700">LESSON 1</p>

                                    <p className="font-semibold">
                                        Introduction to Economics
                                    </p>
                                </div>
                            </div>
                            <MdKeyboardArrowRight />
                        </div>

                        <div className="w-full items-center justify-center flex mt-12">
                            <div
                                className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <CiCirclePlus className="text-xl " />
                                Add New Lessons
                            </div>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <LessonDetailsModal onClose={() => setIsModalOpen(false)} />
                )}
            </div>

            {/** Accordion Item: Assignment */}
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => toggleSection("assignment")}
                >
                    <div className="flex items-center gap-3">
                        <FaClipboard className="text-blue-400" />
                        <span className="text-lg font-medium">Assignment</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                {openSection === "assignment" && (
                    <div className="p-4">
                        <div className="inline-flex items-center w-full justify-between cursor-pointer">
                            <div className="inline-flex gap-6">
                                <img src={Book2} className="h-12" />
                                <div>
                                    <p className="text-gray-700">
                                        How do you search for inspiration when
                                        discussing the MVP of your design
                                    </p>

                                    <p className="font-semibold">
                                        LESSON 1-Introduction to Economics
                                    </p>
                                </div>
                            </div>
                            <MdKeyboardArrowRight />
                        </div>

                        <div className="w-full items-center justify-center flex mt-12">
                            <div
                                onClick={() => setIsModal2Open(true)}
                                className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
                            >
                                <CiCirclePlus className="text-xl " />
                                Add New Assignment
                            </div>
                        </div>
                    </div>
                )}
                {isModal2Open && (
                    <AssignmentDetailsModal
                        onClose={() => setIsModal2Open(false)}
                    />
                )}
            </div>

            {/** Accordion Item: Quizzes */}
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => toggleSection("quizzes")}
                >
                    <div className="flex items-center gap-3">
                        <FaQuestionCircle className="text-blue-400" />
                        <span className="text-lg font-medium">Quizzes</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                {openSection === "quizzes" && (
                    <div className="p-4">❓ Quiz Content Here</div>
                )}
            </div>
        </div>
    );
};

export default TopicsContent;
