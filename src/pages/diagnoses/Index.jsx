import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";


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
import { formatDate } from "@/utils/formatDate";

export default function Index() {
    const [diagnoses, setDiagnoses] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        const fetchDiagnoses = async () => {
            const options = {
                method: "GET",
                url: "/diagnoses",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setDiagnoses(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDiagnoses();
    }, [token]);

    const onDeleteCallback = (id) => {
        toast.success("Diagnosis deleted successfully");
        setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Diagnoses</CardTitle>
            </CardHeader>

            <CardContent>
                {/* Create Button */}
                <Button
                    asChild
                    variant="outline"
                    className="mb-4 mr-auto block"
                >
                    <Link to={`/diagnoses/create`}>
                        Create New Diagnosis
                    </Link>
                </Button>

                {/* Table */}
                <Table>
                <TableCaption>List of diagnoses.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Diagnosis Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                            <TableCell>{diagnosis.id}</TableCell>
                            <TableCell>{diagnosis.patient_id}</TableCell>
                            <TableCell>{diagnosis.condition}</TableCell>
                            <TableCell>{formatDate(diagnosis.diagnosis_date)}</TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                                    >
                                        <Pencil />
                                    </Button>
                                    <DeleteBtn
                                        onDeleteCallback={onDeleteCallback}
                                        resource="diagnoses"
                                        id={diagnosis.id}
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