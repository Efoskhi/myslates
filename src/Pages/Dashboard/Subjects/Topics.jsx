import React from "react";
import Header from "../../../components/Layout/Header";
import useTopics from "../../../Hooks/useTopics";
import Loading from "../../../components/Layout/Loading";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { MdKeyboardArrowRight } from "react-icons/md";
import AddTopicModal from "../../../components/Subjects/AddTopicModal";

const Topics = () => {
    const [ toggleReloadTopic, setToggleReloadTopic ] = React.useState(false);
    const { topics, isLoading } = useTopics({toggleReloadTopic});
    const [addTopicModalVisible, setAddTopicModalVisible] = React.useState(false);

    const navigate = useNavigate();
    const { handleSetCurrentTopic, currentSubject } = useAppContext();

    const toggleTopicModalVisible = () => setAddTopicModalVisible((prev) => !prev);

    const handleTopicNavigate = (topic) => {
        handleSetCurrentTopic({ ...topic, isOwnSubject: true });
        navigate("/TopicDetails");
    };

    const addTopicCallback = () => {
        toggleTopicModalVisible();
        setToggleReloadTopic(prev => !prev);
    }

    return (
        <div>
            <Header />
            <div className="p-4">
                {addTopicModalVisible && (
                    <AddTopicModal 
                        handleCloseModal={toggleTopicModalVisible} 
                        callback={addTopicCallback}
                    />
                )}
                {/* {isOwnSubject &&  */}
                <div className="w-full items-center justify-between flex mt-12 mb-5">
                    <p className="text-lg font-semibold text-gray-800">
                        Subject: <span className="font-normal text-gray-600">{currentSubject.title}</span>
                    </p>
                    <div
                        className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
                        onClick={toggleTopicModalVisible}
                    >
                        <CiCirclePlus className="text-xl " />
                        Add New Topic
                    </div>
                </div>
                {/* } */}
                {isLoading && <Loading />}
                {topics.map((topic, key) => (
                    <div
                        key={key}
                        className="inline-flex items-center w-full justify-between cursor-pointer"
                        onClick={() => handleTopicNavigate(topic)}
                    >
                        <div className="inline-flex gap-6">
                            <img src={topic.weekRef.img} className="h-12" />
                            <div>
                                <p className="text-gray-700">
                                    {topic.weekRef.title}
                                </p>

                                <p className="font-semibold">{topic.title}</p>
                            </div>
                        </div>
                        <MdKeyboardArrowRight />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Topics;
