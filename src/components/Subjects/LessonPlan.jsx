import React from "react";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const LessonPlan = ({ closeModal }) => {
    const topic = JSON.parse(sessionStorage.getItem("currentTopic"));

    return (
        <>
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
                    <div className="text-white px-4 py-2  rounded-md mb-4 font-semibold ">
                        <div className="bg-cyan-500 text-white my-5 p-3 rounded">
                            Lesson Plan
                            <div className="text-sm font-normal">
                                Topic: { topic?.title }
                            </div>
                        </div>

                        <div className={`bg-cyan-50 border border-cyan-400 text-black p-5 rounded`}>
                            <MathJaxContext>
                                <ReactMarkdown
                                    components={{
                                    p: ({ children }) => <p>{children}</p>,
                                    code: ({ inline, children }) =>
                                        inline ? <MathJax style={{color: "black"}} inline>{String(children)}</MathJax> : <pre style={{color: "black"}}>{children}</pre>,
                                    }}
                                >
                                    {topic?.lesson_plan ?? "No lesson plan for this topic"}
                                </ReactMarkdown>
                            </MathJaxContext>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LessonPlan;