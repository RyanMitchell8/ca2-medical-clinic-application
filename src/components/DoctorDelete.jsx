import axios from "@/config/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function DoctorDelete({ doctorId }) {
    const { token } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            // Fetch related appointments
            const appointmentsRes = await axios.get("/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const appointments = appointmentsRes.data.filter(
                (a) => a.doctor_id == doctorId
            );

            // Delete appointments
            await Promise.all(
                appointments.map((appointment) =>
                    axios.delete(`/appointments/${appointment.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            // Fetch related prescriptions
            const prescriptionsRes = await axios.get("/prescriptions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const prescriptions = prescriptionsRes.data.filter(
                (p) => p.doctor_id == doctorId
            );

            // Delete prescriptions
            await Promise.all(
                prescriptions.map((prescription) =>
                    axios.delete(`/prescriptions/${prescription.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            // Finally delete doctor
            await axios.delete(`/doctors/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Redirect to the doctors list and force a full page load so the list refreshes
            window.location.replace("/doctors");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        !isDeleting ? (
            <Button
                variant="outline"
                className="text-red-600 hover:border-red-600"
                onClick={() => setIsDeleting(true)}
            >
                Delete Doctor
            </Button>
        ) : (
            <div className="flex items-center gap-3">
                <p className="text-sm text-gray-700">Are you sure?</p>
                <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:text-red-700 hover:border-red-700"
                >
                    Yes
                </Button>
                <Button
                    onClick={() => setIsDeleting(false)}
                    variant="outline"
                    className="text-slate-600 border-slate-300 hover:text-slate-800"
                >
                    No
                </Button>
            </div>
        )
    );
}
