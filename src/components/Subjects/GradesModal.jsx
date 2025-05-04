import React from "react";
import Loading from "../../components/Layout/Loading";
import useClasses from "../../Hooks/useClasses";

const GradesModal = ({ toggleModal, callback }) => {
    const { classes } = useClasses({ shouldGetClasses: true, pageSize: 100 });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100" style={{ zIndex: 100 }}>
            {/* Modal Content */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md m-4 relative max-h-[80vh] overflow-y-auto">
                {/* Buttons List */}
                <div className="flex flex-col space-y-2">
                    {classes.map((item, key) => (
                        <button
                            key={key}
                            onClick={() => callback(item.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                        >
                            {item.student_class}
                        </button>
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="mt-6 flex w-full gap-3">
                    <button
                        onClick={toggleModal}
                        className="w-full py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradesModal;
