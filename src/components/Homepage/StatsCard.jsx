import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Profile from "../../assets/Profile.png";
import Graph from "../../assets/Graph.png";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { docQr } from "../../Logics/docQr";
import useDashboard from "../../Hooks/useDashboard";

export default function StatCards() {
  const { 
    isLoading, 
    stats, 
    statsFilter,
    filterLoading,
    handleSubjectFilterChange, 
    handleStudentFilterChange 
  } = useDashboard();

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
      {/* Total Students Card */}
      <div className="bg-[#e4e7ec] p-4 rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <img src={Graph} className="h-6" />
          <div className="flex items-center text-gray-500 text-sm">
            <Select
              value={statsFilter.students}
              onChange={e => handleStudentFilterChange(e.target.value)}
              size="small"
              sx={{ fontSize: "0.875rem" }}
              IconComponent={IoIosArrowDown}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="last 7 days">Last 7 days</MenuItem>
              <MenuItem value="last 30 days">Last 30 days</MenuItem>
            </Select>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          {isLoading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{stats.totalStudents}</h2>
              <p className="text-gray-500 text-sm">Total Students</p>
            </div>
          )}
          <img src={Profile} className="h-12" />
        </div>
        <div className="mt-4">
          {filterLoading.isLoadingStudentsFilter ? (
            <Skeleton variant="text" width={100} height={30} />
          ) : (
            <div>
              <p className="text-sm text-gray-500">
                Students in {statsFilter.students}:{" "}
                <span className="font-bold">{stats.totalStudentsFilter}</span>
              </p>
              <p className="text-sm text-green-800 font-medium bg-green-100 inline-block p-1 rounded-full">
                {stats.studentPercentIncrease}% increase
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Total Subjects Card */}
      <div className="bg-[#e4e7ec] p-4 rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <img src={Graph} className="h-6" />
          <div className="flex items-center text-gray-500 text-sm">
            <Select
              value={statsFilter.subjects}
              onChange={e => handleSubjectFilterChange(e.target.value)}
              size="small"
              sx={{ fontSize: "0.875rem" }}
              IconComponent={IoIosArrowDown}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="last 7 days">Last 7 days</MenuItem>
              <MenuItem value="last 30 days">Last 30 days</MenuItem>
            </Select>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          {isLoading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{stats.totalSubjects}</h2>
              <p className="text-gray-500 text-sm">Total Subjects</p>
            </div>
          )}
          <img src={Profile} className="h-12" />
        </div>
        <div className="mt-4">
          {filterLoading.isLoadingSubjectsFilter ? (
            <Skeleton variant="text" width={100} height={30} />
          ) : (
            <div>
              <p className="text-sm text-gray-500">
                Subjects in {statsFilter.subjects}:{" "}
                <span className="font-bold">{stats.totalSubjectsFilter}</span>
              </p>
              <p className="text-sm text-green-800 font-medium bg-green-100 inline-block p-1 rounded-full">
                {stats.subjectsPercentIncrease}% increase
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
