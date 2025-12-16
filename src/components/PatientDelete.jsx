import axios from "@/config/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function PatientDelete({ patientId, onDeleted }) {
    const { token } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            // Fetch related appointments
            const appointmentsRes = await axios.get("/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const appointments = appointmentsRes.data.filter(
                (a) => a.patient_id == patientId
            );

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
                (p) => p.patient_id == patientId
            );

            await Promise.all(
                prescriptions.map((prescription) =>
                    axios.delete(`/prescriptions/${prescription.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            // Fetch related diagnoses
            const diagnosesRes = await axios.get("/diagnoses", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const diagnoses = diagnosesRes.data.filter(
                (d) => d.patient_id == patientId
            );

            await Promise.all(
                diagnoses.map((diagnosis) =>
                    axios.delete(`/diagnoses/${diagnosis.id}`, {  
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            // Finally delete patient
            await axios.delete(`/patients/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Tell parent to update state
            if (onDeleted) {
                onDeleted(patientId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return !isDeleting ? (
        <Button
            variant="outline"
            className="text-red-600 hover:border-red-600"
            onClick={() => setIsDeleting(true)}
        >
            Delete Patient
        </Button>
    ) : (
        <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Are you sure?</p>

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
            >
                No
            </Button>
        </div>
    );
}
