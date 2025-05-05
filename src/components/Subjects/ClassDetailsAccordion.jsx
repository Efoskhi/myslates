import { useState } from "react";
import { FaBook, FaClipboard, FaQuestionCircle, FaUsers } from "react-icons/fa";
import Book from "../../assets/Book.png";

import Book2 from "../../assets/Book2.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import StudentList from "./StudentList";
import LessonDetailsModal from "./LessonDetailsModal";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
import { useNavigate } from "react-router-dom";
import useTopics from "../../Hooks/useTopics";
import Loading from "../Layout/Loading";
import AddTopicModal from "./AddTopicModal";
import { useAppContext } from "../../context/AppContext";

const ClassDetailsAccordion = ({ isOwnSubject }) => {
    const [openSection, setOpenSection] = useState(null);

    const [addTopicModalVisible, setAddTopicModalVisible] = useState(false);

	const navigate = useNavigate();
    const { handleSetCurrentTopic } = useAppContext();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

	const { topics, isLoading } = useTopics();


	const handleTopicNavigate = (topic) => {
        handleSetCurrentTopic({...topic, isOwnSubject});
		navigate("/TopicDetails");
	}

	const toggleTopicModalVisible = () => setAddTopicModalVisible(prev => !prev);

    return (
        <div className="mx-auto p-4 bg-white shadow-md rounded-2xl">
            {/** Accordion Item: Lessons */}
            <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => toggleSection("lessons")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">Topics</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                {openSection === "lessons" && (
                    <div className="p-4">
						{isOwnSubject && 
                            <div className="w-full items-center justify-center flex mt-12 mb-5">
                                <div
                                    className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
                                    onClick={toggleTopicModalVisible}
                                >
                                    <CiCirclePlus className="text-xl " />
                                    Add New Topic
                                </div>
                            </div>
                        }
						{isLoading && <Loading/>} 
                        {topics.map((topic, key) => (
							<div key={key} className="inline-flex items-center w-full justify-between cursor-pointer" onClick={ () => handleTopicNavigate(topic) }>
								<div className="inline-flex gap-6">
									<img src={topic.weekRef.img} className="h-12" />
									<div>
										<p className="text-gray-700">{topic.weekRef.title}</p>

										<p className="font-semibold">
											{ topic.title }
										</p>
									</div>
								</div>
								<MdKeyboardArrowRight />
							</div>
						))}
                    </div>
                )}

                {addTopicModalVisible && (
                    <AddTopicModal handleCloseModal={toggleTopicModalVisible} />
                )}
            </div>
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
