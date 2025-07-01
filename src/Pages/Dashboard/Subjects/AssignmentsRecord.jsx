import React from "react";
import { FaArrowLeft, FaSearch, FaSlidersH } from "react-icons/fa";
import { AiOutlineAppstore, AiOutlineUser } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { MdSubject } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useAssignments from "../../../Hooks/useAssignment";
import Loading from "../../../components/Layout/Loading";

export default function AssignmentsRecord() {
  const [ assignmentRecords, setAssignmentRecords ] = React.useState({});
  const { assignmentRecords: records, isLoading } = useAssignments({ shouldGetAssignmentRecords: true, shouldGetAssignment: false });

  const navigate = useNavigate();

  const handleSearch = (value) => {
    const filtered = records.SubmittedAnswer?.filter(item =>
      item.student.display_name.toLowerCase().includes(value.toLowerCase())
    );

    setAssignmentRecords({ ...assignmentRecords, SubmittedAnswer: filtered })
  }

  React.useEffect(() => {
    setAssignmentRecords(records);
  }, [isLoading])
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <FaArrowLeft className="mr-3 text-gray-700" onClick={() => navigate(-1) } />
        <h1 className="text-cyan-500 font-semibold text-lg">
          Assignment Records
        </h1>
      </div>

      <h2 className="text-cyan-500 font-semibold text-lg p-4 border-b">
        { assignmentRecords.question }
      </h2>

      {/* Search Bar */}
      <div className="mx-4 mt-4 flex items-center border rounded px-3 py-2 bg-gray-50">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-sm"
          onChange={e => handleSearch(e.target.value)}
        />
        <FaSlidersH className="text-gray-400 ml-2" />
      </div>

      {/* Table */}
      <div className="mt-4 mx-4 overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left font-semibold">
            <tr>
              <th className="p-3">Students</th>
              <th className="p-3">Score</th>
              <th className="p-3">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {assignmentRecords?.SubmittedAnswer?.map((item, key) => (
              <tr className="border-t" key={key}>
                <td className="p-3">
                  {/* <div className="text-xs text-gray-500 mb-1">ASSIGNMENT 1</div> */}
                  <div className="font-medium">{ item.student.display_name }</div>
                </td>
                <td className="p-3">{ item.score }/{ assignmentRecords.max_mark }</td>
                <td className="p-3 text-cyan-500 font-semibold">{ item.score / assignmentRecords.max_mark * 100 }%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <Loading/>}

    </div>
  );
}
