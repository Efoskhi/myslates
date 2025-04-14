import { useState, useEffect } from "react";
import { docQr } from "../Logics/docQr_ORGate";
import { getFirebaseData } from "../utils/firebase";
import toast from "react-hot-toast";

let fetchedStudents = [];

const useStudents = () => {
    const [students, setStudents] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const getSubjects = async () => {
		const user = JSON.parse(sessionStorage.getItem("user") ?? "null");
		if(!user) {
			throw new Error("User is not logged in " + user)
		}

        const response = await getFirebaseData({
            collection: "Subjects",
            refFields: ["classRef", "deptRef"],
            query: [["teacher_id", "==", user.teacher_id]],
            page: 1,
            pageSize: 10,
        });

		return response.data.Subjects;
    };

    const getStudents = async () => {
		try {
			setLoading(true);

			if(fetchedStudents.length > 0){
				return setStudents(fetchedStudents);
			}
	
			const subjects = await getSubjects();
	
			const curriculumSet = new Set<string>();
			const departmentSet = new Set<string>();
			const classSet = new Set<string>();
	
			subjects.forEach(item => {
				if (item.curriculum) curriculumSet.add(item.curriculum);
				if (item.deptRef) departmentSet.add(item.deptRef.title);
				if (item.classRef) classSet.add(item.classRef.student_class);
			});
	
			const curriculums = Array.from(curriculumSet);
			const departments = Array.from(departmentSet);
			const classes = Array.from(classSet);
	
			const response = await getFirebaseData({
				collection: "users",
				query: [
					["curriculum", "in", curriculums],
					["student_class", "in", classes],
					["student_dept", "in", departments],
				],
				page: 1,
				pageSize: 1000,
			});
	
			const users = response.data.users ?? [];
	
			// Attach matching subjects to each user
			const studentsWithSubjects = users.map(student => {
				const matchedSubjects = subjects.filter(subject =>
					subject.curriculum === student.curriculum &&
					subject.classRef?.student_class === student.student_class &&
					subject.deptRef?.title === student.student_dept
				);
	
				return {
					...student,
					subjects: matchedSubjects.map(sub => sub.title.split("by")[0]),
				};
			});

			setStudents(studentsWithSubjects);
			fetchedStudents = studentsWithSubjects;
	
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	

    useEffect(() => {
        getStudents();
    }, []);

    return { 
		students, 
		loading 
	}
};

export default useStudents;