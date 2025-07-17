import { useEffect, useState } from "react";
import {
  FaBook,
  FaClipboard,
  FaQuestionCircle,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import StudentList from "./StudentList";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { getFirebaseData, addFirebaseData } from "../../utils/firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase.config";
import Loading from "../Layout/Loading";
const LearningWeeksModal = ({ isOpen, setIsOpen }) => {
  const [weeks, setWeeks] = useState({
    "Week 1": false,
    "Week 2": false,
    "Week 3": false,
    "Week 4": false,
    "Week 5": false,
    "Week 6": false,
    "Week 7": false,
    "Week 8": false,
    "Week 8": false,
    "Week 10": false,
  });
  const { user, currentSubject } = useAppContext();
  const [loading, setLoading] = useState(false);
  useEffect(function () {
    const subjectRef = doc(db, "subjects", currentSubject?.id);

    getFirebaseData({
      collection: `users`,
      subcollections: ["active_weeks"],
      query: [["uid", "==", user.id]],
    }).then((data) => {
      if (data?.data?.users?.[0]?.active_weeks) {
        const activeWeeks = data.data.users[0].active_weeks.find(
          (week) => week.subject_ref?.path === subjectRef.path
        );

        if (activeWeeks) {
          const updatedWeeks = activeWeeks.weeks.reduce(
            (acc, curr) => ({ ...acc, [curr]: true }),
            weeks
          );

          setWeeks(updatedWeeks);
        }
      }
    });
  }, []);
  async function handleSubmit() {
    setLoading(true);
    const filteredWeeks = Object.keys(weeks).filter(
      (val) => weeks[val] === true
    );
      const subjectRef = doc(db, "subjects", currentSubject.id);
      const activeWeekRef = collection(db, "users", user.id, "active_weeks");
      const q = query(activeWeekRef, where("subject_ref", "==", subjectRef));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      if (querySnapshot.empty) {
          const _response = await addFirebaseData({
              collection: "users",
              id: user.id,
              subCollectionData: {
                  active_weeks: {
                      subject_ref: subjectRef,
                      weeks: filteredWeeks,
                  },
              },
          });
          
      } else {
          const existingDoc = querySnapshot.docs[0];
          const docRef = doc(db, "users", user.id, "active_weeks", existingDoc.id);
          await updateDoc(docRef, {
              week_title: filteredWeeks
          });
          console.log("success")
      }
      setLoading(false);
      toast.success("Successfully updated");
      setIsOpen(false)
  }
  if (!isOpen) return;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="w-1/2 p-4 bg-white rounded-md">
        <div className=" flex flex-row justify-end">
          <FaTimes
            onClick={() => setIsOpen(false)}
            size={24}
            className="text-right"
            color="black"
          />
        </div>
        <div>
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Learning Weeks</h1>
            <p className="text-slate-600">
              Lock or unlock learning weeks. your students can only access
              unlocked weeks content
            </p>
          </div>
          <form>
            {Object.keys(weeks)
              .sort((a, b) => Number(a.split(" ")[1]) - Number(b.split(" ")[1]))
              .map(function (name, index) {
                return (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold mt-4 block">
                      Week {index + 1}
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={() =>
                          setWeeks((prev) => ({
                            ...prev,
                            [name]: !weeks[name],
                          }))
                        }
                        checked={weeks[name]}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 relative transition-colors duration-300">
                        <div className="absolute left-1 top-1 bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 peer-checked:translate-x-50"></div>
                      </div>
                      <span className="ml-2 text-gray-600">
                        {weeks[name] ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                );
              })}
          </form>
          {!loading ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white p-3 rounded-md mt-6 font-medium"
            >
              Continue
            </button>
          ) : (
            <Loading />
          )}
        </div>
        {/* Continue button */}
      </div>
    </div>
  );
};
const ClassDetailsAccordion = ({ isOwnSubject }) => {
  const [openSection, setOpenSection] = useState(null);
  const [learningWeeksModal, setLearningWeeksModal] = useState(false);
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mx-auto p-4 bg-white shadow-md rounded-2xl">
      <LearningWeeksModal
        isOpen={learningWeeksModal}
        setIsOpen={setLearningWeeksModal}
      />
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
      {/* <div>
                <div
                    className="flex items-center justify-between py-4 border-b cursor-pointer"
                    onClick={() => toast.error("CBT is coming soon")}
                >
                    <div className="flex items-center gap-3">
                        <FaBook className="text-blue-400" />
                        <span className="text-lg font-medium">CBT</span>
                    </div>
                    <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
            </div> */}
      <div>
        <div
          className="flex items-center justify-between py-4 border-b cursor-pointer"
          onClick={() => navigate("/subject/Assignments")}
        >
          <div className="flex items-center gap-3">
            <FaBook className="text-blue-400" />
            <span className="text-lg font-medium">Assignment</span>
          </div>
          <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
        </div>
      </div>
      <div>
        <div
          className="flex items-center justify-between py-4 border-b cursor-pointer"
          onClick={() => setLearningWeeksModal(true)}
        >
          <div className="flex items-center gap-3">
            <FaBook className="text-blue-400" />
            <span className="text-lg font-medium">Learning Weeks</span>
          </div>
          <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
        </div>
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
