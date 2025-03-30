import { useEffect, useState } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { docQr } from "../../Logics/docQr";
import { Skeleton } from "@mui/material";
import ReactPaginate from "react-paginate";

export default function StudentList() {
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const toggleSelectAll = () => {
    if (selected.length === students.length) {
      setSelected([]);
    } else {
      setSelected(students.map((s) => s.docId));
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await docQr("users", {
        max: 6000,
        whereClauses: [{ field: "role", operator: "==", value: "learner" }],
      });
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pageCount = Math.ceil(students.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = students.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="bg-white border p-4 rounded-lg shadow-md w-full overflow-x-auto">
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">List of Students</h2>
        <button className="flex items-center border text-xs px-3 py-2 rounded-lg">
          <IoFilterSharp className="mr-2" /> Apply filter
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#e3f4fa] text-left">
            <th className="p-2">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selected.length === students.length}
              />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Student ID</th>
            <th className="p-2">Class</th>
            <th className="p-2">Age</th>
            <th className="p-2">School</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width="80%" />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width="60%" />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width="50%" />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width="40%" />
                  </td>
                  <td className="p-2">
                    <Skeleton variant="text" width="70%" />
                  </td>
                </tr>
              ))
            : currentItems.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(student.docId)}
                      onChange={() => toggleSelect(student.docId)}
                    />
                  </td>
                  <td className="p-2 font-semibold">{student?.display_name}</td>
                  <td className="p-2 text-gray-500">{student?.student_id}</td>
                  <td className="p-2 text-gray-500">{student?.student_class}</td>
                  <td className="p-2 text-gray-500">{student?.student_age}</td>
                  <td className="p-2 text-gray-500">{student?.student_name}</td>
                </tr>
              ))}
        </tbody>
      </table>
      {/* Pagination */}
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center space-x-2 mt-4"}
        pageClassName={"px-3 py-1 border rounded-md"}
        previousClassName={"px-3 py-1 border rounded-md"}
        nextClassName={"px-3 py-1 border rounded-md"}
        activeClassName={"bg-blue-500 text-white"}
      />
    </div>
  );
}
