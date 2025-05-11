import React from "react";
import AddTopic from "./TopicDetails";

const AddTopicModal = ({handleCloseModal, callback}) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
            <AddTopic 
                section="Add" 
                handleCloseModal={handleCloseModal}
                callback={callback}
            />
        </div>
    )
}

export default AddTopicModal;