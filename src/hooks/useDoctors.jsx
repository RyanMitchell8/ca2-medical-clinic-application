import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

export function useDoctors() {
    const { token } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchDoctors = async () => {
            try {
                const res = await axios.get("/doctors", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDoctors(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [token]);

    const getDoctorNameById = (id) => {
        const doctor = doctors.find((d) => d.id == id);
        return doctor
            ? `${doctor.first_name} ${doctor.last_name}`
            : "Unknown doctor";
    };

    return {
        doctors,
        loading,
        getDoctorNameById,
    };
}
