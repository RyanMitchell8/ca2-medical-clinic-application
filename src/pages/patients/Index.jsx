import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Pencil } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useAuth } from "@/hooks/useAuth";
import PatientDelete from "@/components/PatientDelete";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function Index() {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    const { token } = useAuth();

    useEffect(() => {
        const fetchPatients = async () => {
            const options = {
                method: "GET",
                url: "/patients",
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setPatients(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatients();
    }, [token]);

    const onDeleteCallback = (id) => {
        toast.success("Patient deleted successfully");
        setPatients(patients.filter(patient => patient.id !== id));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Patients</CardTitle>
            </CardHeader>

            <CardContent>
                {/* Create Button */}
                <Button
                    asChild
                    variant="outline"
                    className="mb-4 mr-auto block"
                >
                    <Link size="sm" to={`/patients/create`}>
                        Create New Patient
                    </Link>
                </Button>

                {/* Table */}
                <Table>
                <TableCaption>List of patients.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {patients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell>{patient.first_name}</TableCell>
                            <TableCell>{patient.last_name}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell>{formatDate(patient.date_of_birth)}</TableCell>

                            <TableCell>
                                <div className="flex gap-2">

                                    {/* View */}
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/patients/${patient.id}`)}
                                    >
                                        <Eye />
                                    </Button>

                                    {/* Edit */}
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/patients/${patient.id}/edit`)}
                                    >
                                        <Pencil />
                                    </Button>

                                    {/* Delete */}
                                    <PatientDelete
                                        onDeleted={onDeleteCallback}
                                        patientId={patient.id}
                                    />
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
