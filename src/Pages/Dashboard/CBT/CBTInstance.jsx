import React, { useState } from "react";
import Header from "../../../components/Layout/Header";

import { CiCirclePlus } from "react-icons/ci";
import AddCBTModal from "../../../components/CBT/AddCBTModal";
import useCBT from "../../../Hooks/useCBT";
import InstanceCard from "../../../components/CBT/InstanceCard";
import Loading from "../../../components/Layout/Loading";

const CBTInstance = () => {

  const hooks = useCBT({ shouldGetInstances: true })
  const { isLoading, instances, isOpenAddModal, isSaving, setIsOpenAddModal, setInputs, resetInstanceInput, handleConfirmInstanceDelete } = hooks;
  const [ isAddInstance, setIsAddInstance ] = React.useState(true);
  const [ deleteModalData , setDeleteModalData] = useState(null);

  const openCBTModal = () => {
    resetInstanceInput();
    setIsAddInstance(true);
    setIsOpenAddModal(true);
  }

  const deleteCallback = () => setDeleteModalData(null);

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
              onClick={openCBTModal}
              className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
            >
              <CiCirclePlus className="text-xl " />
              Add CBT
            </div>
          </div>

          {/* Modal */}
          {isOpenAddModal && 
            <AddCBTModal 
              setIsOpen={setIsOpenAddModal} 
              hooks={hooks} 
              isAddInstance={isAddInstance}
            />
          }

          {/* Delete Modal */}
          {deleteModalData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg relative h-auto">
                <div className="text-center">
                  <div className="text-5xl mb-4">🗑️</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Instance?</h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this instance? All questions and results will also be deleted. This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setDeleteModalData(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmInstanceDelete(deleteModalData, deleteCallback)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loading/> : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && <Loading/>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {instances.map((item, key) => (
              <InstanceCard 
                instance={item} 
                key={key} 
                setIsOpenAddModal={setIsOpenAddModal}
                setIsAddInstance={setIsAddInstance}
                setInputs={setInputs}
                setDeleteModalData={setDeleteModalData}
              />
          ))}

        </div>

        {instances.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-700">No instance was found</h2>
            <p className="text-gray-500 mt-2">Please create a new instance to get started.</p>
          </div>
        )}
        
      </div>
    </>
  );
};

export default CBTInstance;
