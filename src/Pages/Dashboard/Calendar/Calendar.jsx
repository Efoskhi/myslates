import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import { CiCirclePlus } from "react-icons/ci";
import MyCalendar from "../../../components/Calendar/MyCalendar";
import Schedule from "../../../components/Calendar/Schedule";
import AddScheduleModal from "../../../components/Calendar/AddScheduleModal";
import useSchedule from "../../../Hooks/useSchedule";

const Calendar = () => {
  const hooks = useSchedule();

  return (
    <div>
      <Header />
      <div className="p-6 flex items-center justify-between">
        <p className="text-2xl font-bold">November 2024</p>
        <div className="inline-flex gap-6">
          <div
            onClick={hooks.toggleModal}
            className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
          >
            <CiCirclePlus className="text-xl " />
            Add Schedule
          </div>
        </div>
      </div>

      {hooks.isModalOpen && (
        <AddScheduleModal hooks={hooks}/>
      )}
      <MyCalendar hooks={hooks}/>
      <Schedule hooks={hooks} />
    </div>
  );
};

export default Calendar;
