import { useRef, useState } from "react";
import { FaImages, FaUpload } from "react-icons/fa";
import useWeeks from "../../Hooks/useWeeks";
import useTerms from "../../Hooks/useTerms";

const AddTopic = ({ hooks }) => {
    const { weeks, isLoading: isLoadingWeeks } = useWeeks({shouldGetWeeks: true});
    const { terms, isLoading: isLoadingTerms } = useTerms({shouldGetTerms: true});

    const {
        inputs,
        handleInput
    } = hooks;

    return (
        <div className="py-6 grid lg:grid-cols-2 grid-cols-1 gap-6 w-full">
            <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <label className="block text-gray-700 text-xs ">
                            Week
                        </label>
                        <select 
                            className="w-full p-2 border rounded-lg" 
                            onChange={e => handleInput("topic.week", e.target.value)}
                            value={inputs.topic.week}
                        >
                            <option option="">Select Week</option>
                            {weeks.map((week, key) => (
                                <option option={JSON.stringify(week)} key={key}>{week.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-xs">
                            Term
                        </label>
                        <select 
                            className="w-full p-2 border rounded-lg" 
                            onChange={e => handleInput("topic.term", e.target.value)}
                            value={inputs.topic.term}
                        >
                            <option value="">Select Term</option>
                            {terms.map((terms, key) => (
                                <option option={terms.title} key={key}>{terms.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 text-xs">
                        Topic Name
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Tell us about the subject"
                        onChange={e => handleInput("topic.title", e.target.value)}
                        value={inputs.topic.title}
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 text-xs">
                        Serial Number
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Serial number of the topic"
                        onChange={e => handleInput("topic.serial_no", e.target.value)}
                        value={inputs.topic.serial_no}
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 text-xs">Lesson Plan</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        placeholder="Tell us about the lesson plan"
                        onChange={e => handleInput("topic.lesson_plan", e.target.value)}
                        value={inputs.topic.lesson_plan}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddTopic;
