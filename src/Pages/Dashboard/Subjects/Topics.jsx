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
  const [toggleReloadTopic, setToggleReloadTopic] = React.useState(false);
  const { topics, isLoading } = useTopics({ toggleReloadTopic });
  const [addTopicModalVisible, setAddTopicModalVisible] = React.useState(false);
  const navigate = useNavigate();
  const { handleSetCurrentTopic, currentSubject } = useAppContext();
  const [mergedTopics, setMergedTopics] = React.useState([]);
  const toggleTopicModalVisible = () =>
    setAddTopicModalVisible((prev) => !prev);

  const handleTopicNavigate = (topic) => {
    handleSetCurrentTopic({
      ...topic,
      isOwnSubject: currentSubject.isOwnSubject,
    });
    navigate("/TopicDetails");
  };

  const addTopicCallback = () => {
    toggleTopicModalVisible();
    setToggleReloadTopic((prev) => !prev);
  };
  const handleTopics = () => {
    if (topics.length === 0) {
      setMergedTopics([]);
      return;
    };
    const weeksId = topics.map((topic) => topic.weekRef.title.split(" ")[1]).map(Number);
   
    const realWeeks = ["123456789".split("").map(Number), 10].flat();
  
    const filteredWeeks = realWeeks.filter((week) => weeksId.includes(week));
    const remainingWeeks = realWeeks.filter(
      (week) => !filteredWeeks.includes(week)
    ).map(week => {
      return {
        title: `Week ${week}`,
        empty: true,
      };
    });
    const merged = [...topics, ...remainingWeeks].sort((a, b) => {
      console.log(a)
      const _weekA = Number(a.empty ? a.title.split(" ")[1] : a.weekRef.title.split(" ")[1]);
      const _weekB = Number(b.empty ? b.title.split(" ")[1] : b.weekRef.title.split(" ")[1]);
      return _weekA - _weekB;
    });
    console.log(merged, remainingWeeks, filteredWeeks);
    setMergedTopics(merged);
    

  }
  React.useEffect(() => {
    handleTopics();
  }, [toggleReloadTopic, topics])
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
        {currentSubject.isOwnSubject && (
          <div className="w-full items-center justify-between flex mt-12 mb-5">
            <p className="text-lg font-semibold text-gray-800">
              Subject:{" "}
              <span className="font-normal text-gray-600">
                {currentSubject.title}
              </span>
            </p>
            <div
              className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
              onClick={toggleTopicModalVisible}
            >
              <CiCirclePlus className="text-xl " />
              Add New Topic
            </div>
          </div>
        )}
        {isLoading && <Loading />}
        {mergedTopics  && mergedTopics.map((topic, key) => {
          return topic.empty ? (
            <div
              key={key}
              className="inline-flex border rounded-md shadow-md p-2 mb-4 hover:bg-gray-200 items-center w-full justify-between cursor-pointer"
              
            >
              <div className="inline-flex gap-6">
                <div>
                  <p className="text-gray-700">{topic.title}</p>

                </div>
              </div>
              
            </div>
          ) : (
            <div
              key={key}
              className="inline-flex border rounded-md shadow-md p-2 mb-4 hover:bg-gray-200 items-center w-full justify-between cursor-pointer"
              onClick={() => handleTopicNavigate(topic)}
            >
              <div className="inline-flex gap-6">
                <img src={topic.weekRef.img} className="h-12" />
                <div>
                  <p className="text-gray-700">{topic.weekRef.title}</p>

                  <p className="font-semibold">{topic.title}</p>
                </div>
              </div>
              <MdKeyboardArrowRight />
            </div>
          ); 
})}
      </div> 
    </div>
  );
};

export default Topics;
