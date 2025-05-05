import React from "react";
import useLessons from "../../Hooks/useLessons";
import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";

const StartTeaching = ({ closeModal }) => {
    const { lessons } = useLessons({ shouldGetLesson: true });
    const [ currentLessonType, setCurrentLessonType ] = React.useState(null);
    const [ currentLessonIndex, setCurrentLessonIndex ] = React.useState(1);
    const lesson = lessons.filter(item => item.lesson_number === currentLessonIndex)[0];

    const { currentTopic: topic } = useAppContext();

    const handlePaginate = (page) => {
        setCurrentLessonIndex(page < 0 ? 0 : page);
    } 

    const RenderLessonContent = ({ imageWidth = 48, style="p-4 rounded-md space-y-4 mt-5", RenderCloseButton=null }) => {

        return (
            <div className={`bg-cyan-50 border border-cyan-400 ${style}`}>
                <div className="flex items-center justify-between text-cyan-700 font-semibold my-5">
                    <div>Note:</div>
                    {RenderCloseButton && <RenderCloseButton/>}
                </div>
                {lesson?.img_content &&
                    <img
                        src={lesson?.img_content}
                        alt=""
                        className={`mx-auto w-${imageWidth}`}
                    />
                }
                <p className="text-cyan-800 text-sm mt-5" style={{ whiteSpace: "pre-wrap" }}>{lesson?.content}</p>
            </div>
        )
    }

    const RenderLessonExamples = ({ imageWidth = 48, style="p-4 rounded-md space-y-4 mt-5", RenderCloseButton=null }) => {

        return (
            <div className={`bg-red-50 border border-red-400 ${style}`}>
                <div className="flex items-center justify-between text-red-700 font-semibold my-5">
                    <div>Examples:</div>
                    {RenderCloseButton && <RenderCloseButton/>}
                </div>
                {lesson?.img_example &&
                    <img
                        src={lesson?.img_example}
                        alt=""
                        className={`mx-auto w-${imageWidth}`}
                    />
                }
                <p className="text-red-800 text-sm mt-5" style={{ whiteSpace: "pre-wrap" }}>{lesson?.examples}</p>
            </div>
        )
    }

    const RenderCloseButton = ({ color }) => {
        return (
            <IoClose onClick={() => setCurrentLessonType(null)} className={`text-${color}-700 cursor-pointer text-xl`} style={{fontSize: "30px"}} />
        )
    }

    if(!lessons){
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {/* Modal Content */}

                <div className="bg-white rounded-lg h-100 w-100 lg:max-w-7xl p-6 relative overflow-y-auto">
                     {/* Close Button */}
                     <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                        onClick={closeModal}
                    >
                        &times;
                    </button>
                    <p className="my-2">No lesson available for this topic</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {currentLessonType && 
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100" style={{zIndex: 100}}>
                    {/* Modal Content */}
            
                    {currentLessonType === "content" ? (
                        <RenderLessonContent 
                            style="max-h-[90vh] w-full lg:max-w-6xl p-6 absolute overflow-y-auto z-10"
                            RenderCloseButton={() => RenderCloseButton({color: "cyan"})}
                            imageWidth={100}
                        />
                    ) : (
                        <RenderLessonExamples 
                            style="max-h-[90vh] w-full lg:max-w-6xl p-6 absolute overflow-y-auto z-10"
                            RenderCloseButton={() => RenderCloseButton({color: "red"})}
                            imageWidth={100}
                        />
                    )}                 
                </div>
            }
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {/* Modal Content */}

                <div className="bg-white rounded-lg h-screen w-full lg:max-w-7xl p-6 relative overflow-y-auto">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                        onClick={closeModal}
                    >
                        &times;
                    </button>

                    {/* Modal Body */}
                    <div className="bg-cyan-500 text-white px-4 py-2  rounded-md mb-4 font-semibold ">
                        Lesson {currentLessonIndex}
                        <div className="text-sm font-normal">
                            Topic {topic?.serial_no}: { topic?.title }
                        </div>
                    </div>
                    {/* Note */}
                    <div 
                        className="cursor-pointer"
                        onClick={() => setCurrentLessonType("content")}
                    >
                        {/* You can replace this image with a local import if you want */}
                        <RenderLessonContent/>
                    </div>

                    {/* Watch Video Link */}
                    {/* <div className="flex justify-end mt-2 pb-5">
                        <button className="text-cyan-600 text-sm hover:underline flex items-center">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M10 8.64v6.72L15.27 12 10 8.64z" />
                            <path d="M24 0v24H0V0h24z" fill="none" />
                        </svg>
                        Watch Video
                        </button>
                    </div> */}

                    {/* Examples */}
                    <div 
                        className="cursor-pointer"
                        onClick={() => setCurrentLessonType("examples")}
                    >
                        <RenderLessonExamples/>
                    </div>

                    {/* Watch Video Link */}
                    {/* <div className="flex justify-end mt-2 pb-12">
                        <button className="text-red-600 text-sm hover:underline flex items-center">
                        Simplify
                        </button>
                    </div> */}
                    <div className="w-full flex gap-4 mt-5 align-center">
                        {currentLessonIndex > 1 && currentLessonIndex < (lessons?.length ?? 0) + 1 && (
                            <button
                                onClick={() => handlePaginate(currentLessonIndex - 1)}
                                className="w-full cursor-pointer bg-gray-500 hover:bg-gray-600 mx-auto text-center py-4 text-white rounded-md"
                            >
                                Previous
                            </button>
                        )}
                        {currentLessonIndex === lessons.length ? (
                            <button
                                onClick={closeModal}
                                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 mx-auto text-center py-4 text-white rounded-md"
                            >
                                Finish Lesson
                            </button>
                        ) : ( 
                            <button
                                onClick={() => handlePaginate(currentLessonIndex + 1)}
                                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 mx-auto text-center py-4 text-white rounded-md"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StartTeaching;