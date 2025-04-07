import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Face from "../../assets/Face2.png";
import { ClipLoader } from "react-spinners";
import { docQr } from "../../Logics/docQr";
import { AddData } from "../../Logics/addData";
import toast from "react-hot-toast";
import { collection } from "firebase/firestore";  
import { db } from "../../firebase.config";
import {format} from 'date-fns'
const TakeManuallyModal = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState(new Map());
  const [loading, setLoading] = useState(true); // Track loading state
const [date,setDate]=useState(new Date())
  // Fetch student data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await docQr("users", {
          max: 6000,
          whereClauses: [{ field: "role", operator: "==", value: "learner" }],
        });
        const ___=data.map((_)=>{
          return {
            id:_.docId,
            name:_.display_name,
            status:null,
            student_id:_.student_id,
            teacher_id:null,//current teacher id
          }
        })
        setStudents(___); // Set students state
      
        const initialMap = new Map();
        data.forEach((_, index) => initialMap.set(index, null)); // Initialize status map
        setStatusMap(initialMap); // Set status map
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when fetch is done
      }
    };
    fetchData(); // Fetch students only once
  }, []); // Empty dependency array to ensure it runs only once

  // Function to toggle student status
  const toggleStatus = useCallback((id, status) => {
    setStatusMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, status);
      return newMap;
    });
  }, []);

  // Function to mark all students as present
  const markAllPresent = () => {
    const newMap = new Map();
    students.forEach((s) => newMap.set(s.id, "present"));
    setStatusMap(newMap);
  };

  const [search, setSearch] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
  
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
  
    return date.toLocaleString("en-US", options);
  };
  const handleSubmit=async()=>{
    try{
      setSubmitting(true)
    const attendance=students.filter((e)=>{
      const _=statusMap.get(e.id)
      return _;
    });
for(let i=0;i<attendance.length;i++){
  const addData=attendance[i];

    await AddData(collection(db,"Attendance"),{...addData,date:formatDate(date)})
}
toast.success("Attendance marked successfully")
onClose()
setStudents([])
setStatusMap(new Map())
}

    catch(err){
      toast.error(err.messae)
    }
    finally{
      setSubmitting(false)
    }
  }
  // Render student list
  const renderedList = useMemo(() => {
    const data=search ? students.filter((student) => student?.name?.toLowerCase()?.includes(search?.toLowerCase()||"")):students
    const finalData=(search ? data:students);
    if(finalData.length===0 && search) return <span>No user found</span>
    return finalData.map((student) => {
      const status = statusMap.get(student.id);
      return (
        <div key={student.id} className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center">
            <img src={Face} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
            <span>{student.name}</span>
          </div>

          <div className="flex space-x-2">
            <button onClick={() => toggleStatus(student.id, "present")}>
              <FaCheckCircle className={`text-lg ${status === "present" ? "text-green-500" : "text-gray-300"}`} />
            </button>
            <button onClick={() => toggleStatus(student.id, "absent")}>
              <FaTimesCircle className={`text-lg ${status === "absent" ? "text-red-500" : "text-gray-300"}`} />
            </button>
            <button onClick={() => toggleStatus(student.id, "excused")}>
              <FaExclamationCircle className={`text-lg ${status === "excused" ? "text-slate-500" : "text-gray-300"}`} />
            </button>
          </div>
        </div>
      );
    });
  }, [students, statusMap, toggleStatus,search]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-full justify-end">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <button onClick={onClose}>
            <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold">Grade</label>
          <select className="w-full p-2 border rounded mt-1">
            <option>Grade A</option>
          </select>
          <label className="text-sm font-semibold mt-4 block">Course</label>
          <select className="w-full p-2 border rounded mt-1">
            <option>Supply and Demand</option>
          </select>

          <label className="text-sm font-semibold mt-4 block">Date</label>
          <input
            type="date"
           value={typeof date==='string'? date:format(date,"yyyy-MM-dd")}
           onChange={(e)=>{
            const {target:{value}}=e;
            setDate(value);
           }}
            className="w-full p-2 border rounded mt-1"
            defaultValue="2024-06-08"
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <input type="text"  onChange={(e)=>{
              const {target:{value}}=e;
              setSearch(value);
            }} value={search} placeholder="Search" className="w-2/3 p-2 border rounded" />
            <button className="ml-2 px-3 py-1 text-black inline-flex gap-2 text-sm rounded" onClick={markAllPresent}>
              <input type="checkbox" readOnly checked={false} />
              Mark all as Present
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? <ClipLoader size={28} /> : renderedList}
          </div>
        </div>

        <button disabled={submitting} type="button" onClick={()=>handleSubmit()} className="w-full bg-[#0598ce] text-white p-2 rounded mt-4">
          {submitting ? <ClipLoader size={20} /> : "Submit"}</button>
      </div>
    </div>
  );
};

export default TakeManuallyModal;
