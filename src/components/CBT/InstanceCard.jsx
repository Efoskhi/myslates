import React from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatFirebaseDateToInputString, formatFirestoreTimestamp } from "../../utils";

const InstanceCard = ({ instance, setIsOpenAddModal, setIsAddInstance, setInputs, setDeleteModalData }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleEditClick = () => {        
        setInputs(prev => ({
            ...prev,
            instance: {
                ...instance,
                subject_id: instance.subject_ref.id,
                class_id: instance.class_ref.id,
                closing_date: formatFirebaseDateToInputString(instance.closing_date),
            }
        }))

        setIsAddInstance(false);
        setMenuOpen(false);
        setIsOpenAddModal(true)
    }

    React.useEffect(() => {
        return () => {
            setMenuOpen(false);
        }
    }, [])

    return (
        <div className="relative">
            {/* Options Dropdown */}
            {menuOpen && (
                <div className="absolute top-8 right-2 bg-white border rounded shadow z-10 w-24">
                    <button
                        onClick={handleEditClick}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setDeleteModalData(instance)}
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

                <Link to={`/QuestionsList/${instance.id}`}>
                    <img
                        alt=""
                        src={ instance.thumbnail }
                        className="h-20 w-full rounded-md object-cover"
                    />
    
                    <div className="mt-2">
                        <dl>
                            <div>
                                <dd className="text-sm text-gray-500">{ instance.title }</dd>
                            </div>
                            <div>
                                <dd className="text-xs">CBT for { instance.subject_ref.name }</dd>
                            </div>
                        </dl>
    
                        <div className="mt-6 flex items-center justify-between text-xs w-full">
                            <p>Closing Date</p>
                            <p>{ formatFirestoreTimestamp(instance.closing_date) }</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default InstanceCard;