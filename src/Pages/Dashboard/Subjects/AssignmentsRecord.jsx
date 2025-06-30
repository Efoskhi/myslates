import { FaArrowLeft, FaSearch, FaSlidersH } from "react-icons/fa";
import { AiOutlineAppstore, AiOutlineUser } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { MdSubject } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

export default function AssignmentsRecord() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <FaArrowLeft className="mr-3 text-gray-700" />
        <h1 className="text-cyan-500 font-semibold text-lg">
          Assignment Records
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mx-4 mt-4 flex items-center border rounded px-3 py-2 bg-gray-50">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-sm"
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
            <tr className="border-t">
              <td className="p-3">
                <div className="text-xs text-gray-500 mb-1">ASSIGNMENT 1</div>
                <div className="font-medium">Onimisi Salihu</div>
              </td>
              <td className="p-3">17/20</td>
              <td className="p-3 text-cyan-500 font-semibold">85.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
