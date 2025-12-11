import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { formatDate } from "@/utils/formatDate";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Index() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [apptsRes, doctorsRes, patientsRes] = await Promise.all([
                    axios.get("/appointments", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/doctors", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/patients", { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setAppointments(Array.isArray(apptsRes.data) ? apptsRes.data : []);
                setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : []);
                setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
            } catch (err) {
                console.log(err);
                setAppointments([]);
                setDoctors([]);
                setPatients([]);
            }
        };

        if (token) fetchAll();
    }, [token]);

    // function to get patient name by id
    const getPatientNameById = (id) => {
        const patient = patients.find((p) => Number(p.id) === Number(id));
        return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown";
    };

    // function to get doctor name by id
    const getDoctorNameById = (id) => {
        const doctor = doctors.find((d) => Number(d.id) === Number(id));
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : "Unknown";
    };

    const onDeleteCallback = (id) => {
        toast.success("Appointment deleted successfully");

        setAppointments(
            appointments.filter(appointment => appointment.id !== id)
        );
    };

    return (
        <>
            <Button
                asChild
                variant="outline"
                className="mb-4 mr-auto block"
            >
                <Link size="sm" to={`/appointments/create`}>
                    Create New Appointment
                </Link>
            </Button>

            <Table>
                <TableCaption>List of appointments.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Appointment Date</TableHead>
                        <TableHead>Doctor Name</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>

                            <TableCell>
                                {formatDate(appointment.appointment_date)}
                            </TableCell>

                            <TableCell>{getDoctorNameById(appointment.doctor_id)}</TableCell>
                            <TableCell>{getPatientNameById(appointment.patient_id)}</TableCell>

                            <TableCell>
                                <div className="flex gap-2">

                                    {/* View */}
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                                    >
                                        <Eye />
                                    </Button>

                                    {/* Only show edit/delete if logged in */}
                                    {token && (
                                        <>
                                            <Button
                                                className="cursor-pointer hover:border-blue-500"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                                            >
                                                <Pencil />
                                            </Button>

                                            <DeleteBtn
                                                onDeleteCallback={onDeleteCallback}
                                                resource="appointments"
                                                id={appointment.id}
                                            />
                                        </>
                                    )}

                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
