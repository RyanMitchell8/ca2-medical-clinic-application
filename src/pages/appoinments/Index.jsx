import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { formatDate } from "@/utils/formatDate";
import { useAuth } from "@/hooks/useAuth";
import { usePatients } from "@/hooks/usePatients";
import { useDoctors } from "@/hooks/useDoctors";
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
    const { getPatientNameById } = usePatients();
    const { getDoctorNameById } = useDoctors();
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                        const apptsRes = await axios.get("/appointments", { headers: { Authorization: `Bearer ${token}` } });
                        setAppointments(Array.isArray(apptsRes.data) ? apptsRes.data : []);
            } catch (err) {
                console.log(err);
                setAppointments([]);
                setDoctors([]);
                setPatients([]);
            }
        };

        if (token) fetchAll();
    }, [token]);

    

    const onDeleteCallback = (id) => {
        toast.success("Appointment deleted successfully");

        setAppointments(
            appointments.filter(appointment => appointment.id !== id)
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
            </CardHeader>

            <CardContent>
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

                                    
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                                    >
                                        <Eye />
                                    </Button>

                                    
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
            </CardContent>
        </Card>
    );
}
