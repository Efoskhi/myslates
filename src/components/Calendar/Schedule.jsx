import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { fromFirestoreTs } from "../../utils/transformToCalenderEvents";
import { format } from "date-fns";
import { getDuration } from "../../utils";
import Loading from "../Layout/Loading";

const scheduleData = [
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
  // Duplicate the data for multiple cards
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
  {
    title: "IELTS Exam Class with Ethna Luk",
    time: "3:40PM - 4:50PM",
    duration: "(1h 12m)",
    location: "341 Windy Ridge Road, LA",
  },
];

const Schedule = ({ hooks }) => {
  const {
    isLoadingToday,
    todaySchedules,
  } = hooks;

  return (
    <div className="bg-[#F2F2F7] p-6 rounded-xl shadow-md m-4">
      <h2 className="text-xl font-semibold mb-4 inline-flex items-center">
        Today's Schedule <MdOutlineKeyboardArrowDown />
      </h2>
      {isLoadingToday && <Loading/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {todaySchedules.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border flex gap-2"
          >
            <div className="bg-blue-500 h-full w-2" />
            <div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-gray-600">
                {format(fromFirestoreTs(item.start), "dd MMM yyyy h:mm a")}{" "}
                <span className="text-sm text-gray-500">{getDuration(fromFirestoreTs(item.start), fromFirestoreTs(item.end))}</span>
              </p>
              <div className="flex items-center text-gray-600 mt-2">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <span className="text-sm">{item.location ?? "Online"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
