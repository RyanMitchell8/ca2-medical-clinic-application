import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
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

    useEffect(() => {
        fetchPatient();
        fetchAppointments();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const { data } = await axios.get(`/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatient(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await axios.get(`/patients/${id}/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!patient) return <p>Loading...</p>;

    return (
        <div className="flex flex-col gap-6">

            {/* Patient Card */}
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>
                        {patient.first_name} {patient.last_name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Phone:</strong> {patient.phone}</p>
                    <p><strong>Date of Birth:</strong> {formatDate(patient.date_of_birth)}</p>
                    <p><strong>Address:</strong> {patient.address}</p>
                </CardContent>

                <CardFooter className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link to="/patients">Back</Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link to={`/patients/${patient.id}/edit`}>Edit</Link>
                    </Button>
                </CardFooter>
            </Card>

            {/* Appointments Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                </CardHeader>

                <CardContent>
                    {appointments.length === 0 ? (
                        <p>No appointments found for this patient.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Appointment Date</TableHead>
                                    <TableHead>Doctor ID</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{appointment.id}</TableCell>
                                        <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                                        <TableCell>{appointment.doctor_id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
