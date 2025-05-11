import React from "react";
import AssignmentCard from "../../../components/Subjects/AssignmentCard";
import Header from "../../../components/Layout/Header";

const Assignment = () => {

    return (
        <div>
            <Header/>
            <AssignmentCard isOwnSubject={true}/>
        </div>
    )
}

export default Assignment;