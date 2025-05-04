import React from "react";
import Loading from "../../components/Layout/Loading";

const ConfirmDuplicateSubjectModal = ({ toggleModal, subject, isSaving, handleDuplicateSubject, callback }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
      {/* Modal Content */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4 relative">
        {/* Close Button */}

        {/* Modal Header */}
        <h2 className="text-xl text-center pt-4 font-semibold text-gray-900 mb-4">
          Copy Subject
        </h2>
        <p className="text-md font-semibold text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg border border-blue-300 dark:border-blue-700 shadow-md">
            You are about to copy this subject, do you want to proceed?
        </p>

        {/* Modal Content */}
       

        {/* Modal Footer */}
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={toggleModal}
            className="w-full py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={ () => handleDuplicateSubject(subject, callback) } 
            className="w-full py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {isSaving ? <Loading/> : "Copy" }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDuplicateSubjectModal;