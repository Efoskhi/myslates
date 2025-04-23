import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import useClasses from "../../Hooks/useClasses";
import useSubject from "../../Hooks/useSubject";
import { getCurrentWeekRange, getLastWeekRange } from "../../utils";

const Dropdown = ({ label, options, openDropdown, setOpenDropdown, hooks }) => {
    const isOpen = openDropdown === label;
    const [ title, setTitle ] = React.useState(label)

    const toggleDropdown = () => {
        setOpenDropdown(isOpen ? null : label);
    };

    const handleClickDropdown = (option) => {
        setTitle(option.label)
        setOpenDropdown(null);

        if(label === "Date"){
            let dateRange;

            if (option.value === "this_week") {
                dateRange = getCurrentWeekRange();
            } else if (option.value === "last_week") {
                dateRange = getLastWeekRange();
            }

            hooks.setWeekHeader(option.value);

            return hooks.getAttendance(dateRange);
        }        

        hooks.getAttendance({ [label.toLowerCase()]: option.value })
    }

    return (
        <div className="relative inline-block text-left">
            <div
                className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs"
                onClick={toggleDropdown}
            >
                {title}
                <MdKeyboardArrowDown />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1 text-sm">
                        {options.map((option, i) => (
                            <div
                                key={i}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleClickDropdown(option)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const DropdownsGroup = ({ hooks }) => {
    const [openDropdown, setOpenDropdown] = useState();
    const { classes } = useClasses({ shouldGetClasses: true, pageSize: 100 });
    const { subjects } = useSubject({ shouldGetSubjects: true, pageSize: 100 });

    const [ transformedData, setTransformedData ] = React.useState({
        classes: [],
        subjects: [],
        dates: [
            {
                label: "This week",
                value: "this_week",
            },
            {
                label: "Last week",
                value: "last_week",
            },
        ]
    })

    React.useEffect(() => {
        const transformedClass = classes.map(item => ({ value: item.student_class, label: item.student_class }));

        setTransformedData(prev => ({
            ...prev,
            classes: transformedClass,
        }))

    }, [classes])

    React.useEffect(() => {
        const transformedSubject = subjects.map(item => ({ value: item.id, label: item.title.split("by")[0] }));

        setTransformedData(prev => ({
            ...prev,
            subjects: transformedSubject
        }))

    }, [subjects])

    return (
        <div className="space-x-4 flex">
            <Dropdown
                label="Date"
                options={transformedData.dates}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                hooks={hooks}
            />
            <Dropdown
                label="Grade"
                options={transformedData.classes}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                hooks={hooks}
            />
            <Dropdown
                label="Subject"
                options={transformedData.subjects}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                hooks={hooks}
            />
        </div>
    );
};

export default DropdownsGroup;
