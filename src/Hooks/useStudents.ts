import { useState, useEffect } from "react";
import { docQr } from "../Logics/docQr_ORGate";

export const useStudents = () => {
  const [students, setStudents] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await docQr("users", {
          max: 6000,
          whereClauses: [{ field: "role", operator: "==", value: "learner" }],
        });
        // console.log("we got data", data.length);
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { students, loading };
};