import React, { useState } from "react";
import Header from "../../../components/Layout/Header";

import { CiCirclePlus } from "react-icons/ci";
import AddCBTModal from "../../../components/CBT/AddCBTModal";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

const CBTInstance = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow-md">
        <div className="border-b  pb-2 mb-6 inline-flex items-center justify-between w-full">
          <div>
            <p className="text-3xl font-extrabold">CBT Instance</p>
            <p className="text-xs">List of avaliable Instance</p>
          </div>
          <div className="inline-flex gap-6">
            <div
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
            >
              <CiCirclePlus className="text-xl " />
              Add CBT
            </div>
          </div>

          {/* Modal */}
          {isOpen && <AddCBTModal setIsOpen={setIsOpen} />}
        </div>

        <div className="grid grid-cols-4">
          <div className="relative">
            {/* Options Dropdown */}
            {menuOpen && (
              <div className="absolute top-8 right-2 bg-white border rounded shadow z-10 w-24">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // trigger edit action here
                    console.log("Edit clicked");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // trigger delete action here
                    console.log("Delete clicked");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Main Card (Wrapped in Link, but only inner content) */}
            <div className="relative block rounded-lg p-4 hover:shadow-xl shadow-indigo-100 bg-cyan-100 cursor-pointer">
              <BsThreeDotsVertical
                className="absolute top-2 right-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              />

              <Link to="/QuestionsList">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80"
                  className="h-20 w-full rounded-md object-cover"
                />

                <div className="mt-2">
                  <dl>
                    <div>
                      <dd className="text-sm text-gray-500">Title</dd>
                    </div>
                    <div>
                      <dd className="text-xs">CBT for Maths</dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex items-center justify-between text-xs w-full">
                    <p>Closing Date</p>
                    <p>12/2/93</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CBTInstance;
