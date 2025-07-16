import { useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import Face from "../../assets/Avatar.png";
import useSubject from "../../Hooks/useSubject";
import Loading from "../Layout/Loading";

const users = [
  {
    id: 1,
    name: "Vee Bona-Egun",
    email: "vee@myschool.com",
    phone: "09045376942",
    avatar: Face, // Replace with actual image URL
  },
  {
    id: 2,
    name: "Vee Bona-Egun",
    email: "vee@myschool.com",
    phone: "09045376942",
    avatar: Face, // Replace with actual image URL
  },
];

const UserCard = ({ user }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center w-full ">
    <img src={user.photo_url} alt={user.name} className="object-filll w-40 h-40 rounded-full" />
    <h3 className="mt-2 text-lg font-semibold">{user.display_name}</h3>
    <p className="flex items-center gap-2 text-gray-600">
      <FaEnvelope className="text-blue-400" /> {user.email}
    </p>
    <p className="flex items-center gap-2 text-gray-600">
      <FaPhone className="text-blue-400" /> {user.phone_number}
    </p>
  </div>
);

const StudentList = () => {
  const [search, setSearch] = useState("");

  const { subjectStudents, isLoadingSubjectStudents } = useSubject({ shouldGetSubjectStudents: true })

  const filteredUsers = subjectStudents.filter((user) =>
    user.display_name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-4">
      {isLoadingSubjectStudents && <Loading/> }

      <div className="mb-4 border rounded-lg p-2 flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default StudentList;
