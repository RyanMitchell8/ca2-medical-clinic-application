import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export function usePatients() {
    const { token } = useAuth();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (!token) return;

        const fetchPatients = async () => {
            try {
                const res = await axios.get("/patients", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            }
            
        };

        fetchPatients();
    }, [token]);

    const getPatientNameById = (id) => {
        const patient = patients.find((p) => p.id == id);
        return patient
            ? `${patient.first_name} ${patient.last_name}`
            : "Unknown patient";
    };

    return {
        patients,
        getPatientNameById,
    };
}
