import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export function useDiagnoses() {
    const { token } = useAuth();
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchDiagnoses = async () => {
            try {
                const res = await axios.get("/diagnoses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDiagnoses(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnoses();
    }, [token]);

    const getDiagnosisNameById = (id) => {
        const diagnosis = diagnoses.find((d) => d.id == id);
        return diagnosis ? diagnosis.condition : "Unknown diagnosis";
    };

    return {
        diagnoses,
        loading,
        getDiagnosisNameById,
    };
}
