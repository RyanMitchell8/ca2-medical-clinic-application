import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useDoctors } from "@/hooks/useDoctors";
import { formatDate } from "@/utils/formatDate";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Show() {
    const { id } = useParams();
    const { token } = useAuth();

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const { getDoctorNameById } = useDoctors();
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Show/Hide logic for appointments, prescriptions, and diagnoses
    const MAX_VISIBLE = 5;

    const [showAllAppointments, setShowAllAppointments] = useState(false);
    const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
    const [showAllDiagnoses, setShowAllDiagnoses] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchAll = async () => {
            setLoading(true);

            try {
                const [patientRes, apptRes, presRes, diagRes] = await Promise.all([
                    axios.get(`/patients/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`/patients/${id}/appointments`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`/prescriptions`, {
                        params: { patient_id: id },
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`/diagnoses`, {
                        params: { patient_id: id },
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    // doctors list now retrieved via hook
                ]);

                setPatient(patientRes.data);
                setAppointments(apptRes.data || []);
                setPrescriptions(presRes.data || []);
                // doctors handled by hook for name lookups
                setDiagnoses(diagRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id, token]);

    // doctor name lookup provided by useDoctors hook

    if (loading || !patient) return <p>Loading patient...</p>;

    return (
        <div className="space-y-10">

            
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b py-3">
                <div className="flex items-center justify-between max-w-5xl mx-auto px-1">
                    <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>

                    <div className="flex gap-3">
                        <Button asChild variant="outline">
                            <Link to="/patients">Back</Link>
                        </Button>

                        <Button asChild>
                            <Link to={`/patients/${patient.id}/edit`}>Edit</Link>
                        </Button>
                    </div>
                </div>
            </div>

            
            <Card className="shadow-md border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        {patient.first_name} {patient.last_name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <InfoRow label="Email" value={patient.email} />
                    <InfoRow label="Phone" value={patient.phone} />
                    <InfoRow label="Date of Birth" value={formatDate(patient.date_of_birth)} />
                    <InfoRow label="Address" value={patient.address} />
                </CardContent>
            </Card>

            
            <DataSection title="Appointments">
                {appointments.length === 0 ? (
                    <EmptyState message="No appointments found." />
                ) : (
                    <>
                        <StyledTable
                            headers={["ID", "Date", "Doctor Name"]}
                            rows={(showAllAppointments ? appointments : appointments.slice(0, MAX_VISIBLE))
                                .map((a) => [
                                    a.id,
                                    formatDate(a.appointment_date),
                                    getDoctorNameById(a.doctor_id),
                                ])
                            }
                        />

                        {appointments.length > MAX_VISIBLE && (
                            <button
                                className="text-blue-600 text-sm font-medium mt-2"
                                onClick={() => setShowAllAppointments(prev => !prev)}
                            >
                                {showAllAppointments ? "View Less" : "View More"}
                            </button>
                        )}
                    </>
                )}
            </DataSection>

            
            <DataSection title="Prescriptions">
                {prescriptions.length === 0 ? (
                    <EmptyState message="No prescriptions found." />
                ) : (
                    <>
                        <StyledTable
                            headers={["ID", "Medication", "Doctor Name"]}
                            rows={(showAllPrescriptions ? prescriptions : prescriptions.slice(0, MAX_VISIBLE))
                                .map((p) => [
                                    p.id,
                                    p.medication || p.medication_name || p.name,
                                    getDoctorNameById(p.doctor_id),
                                ])
                            }
                        />

                        {prescriptions.length > MAX_VISIBLE && (
                            <button
                                className="text-blue-600 text-sm font-medium mt-2"
                                onClick={() => setShowAllPrescriptions(prev => !prev)}
                            >
                                {showAllPrescriptions ? "View Less" : "View More"}
                            </button>
                        )}
                    </>
                )}
            </DataSection>

            
            <DataSection title="Diagnoses">
                {diagnoses.length === 0 ? (
                    <EmptyState message="No diagnoses found." />
                ) : (
                    <>
                        <StyledTable
                            headers={["ID", "Condition", "Date"]}
                            rows={(showAllDiagnoses ? diagnoses : diagnoses.slice(0, MAX_VISIBLE))
                                .map((d) => [
                                    d.id,
                                    d.condition,
                                    formatDate(d.diagnosis_date),
                                ])
                            }
                        />

                        {diagnoses.length > MAX_VISIBLE && (
                            <button
                                className="text-blue-600 text-sm font-medium mt-2"
                                onClick={() => setShowAllDiagnoses(prev => !prev)}
                            >
                                {showAllDiagnoses ? "View Less" : "View More"}
                            </button>
                        )}
                    </>
                )}
            </DataSection>
        </div>
    );
}

/* --- Styled Helper Components --- */

function InfoRow({ label, value }) {
    return (
        <p>
            <strong>{label}:</strong> {value}
        </p>
    );
}

function DataSection({ title, children }) {
    return (
        <Card className="shadow-sm border">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function StyledTable({ headers, rows }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        {row.map((cell, j) => (
                            <TableCell key={j}>{cell}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function EmptyState({ message }) {
    return (
        <div className="text-sm text-muted-foreground bg-gray-50 border rounded-md p-3">
            {message}
        </div>
    );
}