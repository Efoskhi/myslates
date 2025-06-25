import { FaBookReader, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import Face from "../../assets/Face.png";
import useUser from "../../Hooks/useUser";
import { useAppContext } from "../../context/AppContext";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";

import { BsFileBarGraph } from "react-icons/bs";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { GoStack } from "react-icons/go";
import {
  MdOutlineLogout,
  MdOutlineSettings,
  MdOutlineWifiTethering,
} from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { TbTools } from "react-icons/tb";

export default function Header() {
  const { user } = useAppContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add these functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getLinkClassName = (path) => {
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-lg mt-2 cursor-pointer";
    const isActive = location.pathname === path;

    return isActive
      ? `${baseClasses} text-[#2c0d10] bg-[#f8fdff]`
      : `${baseClasses} text-gray-600 hover:bg-gray-100`;
  };

  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      {/* Greeting Text */}
      <h1 className="text-lg font-bold">Hello, {user?.display_name}</h1>

      {/* Search Bar */}
      <div className="lg:inline-flex  gap-8 ">
        <div className="relative w-96 hidden lg:block">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Icons: Notification + Profile */}
        <div className="flex items-center gap-4">
          <IoNotificationsOutline className="text-xl text-gray-600 cursor-pointer lg:flex hidden" />
          <img
            src={user?.photo_url || Face} // Update with correct path
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-300"
          />
          <IoMdMenu
            className="lg:hidden flex cursor-pointer text-2xl"
            onClick={toggleMobileMenu}
          />

          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={closeMobileMenu}
            >
              <div
                className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <IoMdClose
                    className="text-2xl cursor-pointer hover:text-gray-600"
                    onClick={closeMobileMenu}
                  />
                </div>

                {/* Menu Items */}
                <div className="p-4">
                  <ul className="space-y-2">
                    <>
                      <Link
                        to="/Dashboard"
                        className={`${getLinkClassName(
                          "/Dashboard"
                        )} flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors`}
                        onClick={closeMobileMenu}
                      >
                        <BsFileBarGraph className="text-lg" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                    </>

                    <>
                      <Link
                        to="/Subjects"
                        className={`${getLinkClassName(
                          "/Subjects"
                        )} flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors`}
                        onClick={closeMobileMenu}
                      >
                        <RiCheckboxMultipleLine className="text-lg" />
                        <span className="text-sm font-medium">Subjects</span>
                      </Link>
                    </>

                    <>
                      <Link
                        to="/Students"
                        className={`${getLinkClassName(
                          "/Students"
                        )} flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors`}
                        onClick={closeMobileMenu}
                      >
                        <LuUsers className="text-lg" />
                        <span className="text-sm font-medium">Students</span>
                      </Link>
                    </>

                    <Link to="/CBT" className={getLinkClassName("/CBT")}>
                      <FaBookReader className="text-lg" />
                      <span className="text-sm font-medium">CBT</span>
                    </Link>
                    <Link
                      to="/TeachingTools"
                      className={getLinkClassName("/TeachingTools")}
                    >
                      <TbTools className="text-lg" />
                      <span className="text-sm font-medium">
                        Teaching Tools
                      </span>
                    </Link>
                    <Link
                      to="/ChatPage"
                      className={getLinkClassName("/ChatPage")}
                    >
                      <MdOutlineWifiTethering className="text-lg" />
                      <span className="text-sm font-medium">
                        Communication Tools
                      </span>
                    </Link>

                    {user?.is_class_teacher && (
                      <>
                        <Link
                          to="/Attendance"
                          className={`${getLinkClassName(
                            "/Attendance"
                          )} flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors`}
                          onClick={closeMobileMenu}
                        >
                          <GoStack className="text-lg" />
                          <span className="text-sm font-medium">
                            Attendances
                          </span>
                        </Link>
                      </>
                    )}

                    <>
                      <Link
                        to="/Calendar"
                        className={`${getLinkClassName(
                          "/Calendar"
                        )} flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors`}
                        onClick={closeMobileMenu}
                      >
                        <GoStack className="text-lg" />
                        <span className="text-sm font-medium">
                          Calendar & Schedule
                        </span>
                      </Link>
                    </>

                    <Link
                      to="/Settings"
                      //   className="flex items-center justify-start gap-3  py-4"
                      className={getLinkClassName("/Settings")}
                    >
                      <button className=" text-[#344054] text-2xl hover:text-gray-600">
                        <MdOutlineSettings />
                      </button>
                      <p className="text-sm font-bold text-[#344054]">
                        Settings
                      </p>
                    </Link>
                    {/* User Info */}
                    <Link
                      to="/Login"
                      onClick={() => {
                        sessionStorage.clear();
                        localStorage.clear();
                      }}
                      className={getLinkClassName("/Login")}
                      //</div>  className="flex items-center justify-start gap-3 border-t  pt-4"
                    >
                      <button className=" text-[#344054] text-2xl hover:text-gray-600">
                        <MdOutlineLogout />
                      </button>
                      <p className="text-sm font-bold text-[#344054]">Logout</p>
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
