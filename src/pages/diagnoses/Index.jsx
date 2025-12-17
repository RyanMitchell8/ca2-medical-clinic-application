import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { usePatients } from "@/hooks/usePatients";
import { useDiagnoses } from "@/hooks/useDiagnoses";

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
    const { token } = useAuth();
    const { getPatientNameById } = usePatients();
    const { diagnoses, loading } = useDiagnoses();
    const [localDiagnoses, setLocalDiagnoses] = useState([]);
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        setLocalDiagnoses(diagnoses || []);
    }, [diagnoses]);

    
    const onDeleteCallback = (id) => {
        toast.success("Diagnosis deleted successfully");
        setLocalDiagnoses(localDiagnoses.filter(d => d.id !== id));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Diagnoses</CardTitle>
            </CardHeader>

            <CardContent>
                
                <Button
                    asChild
                    variant="outline"
                    className="mb-4 mr-auto block"
                >
                    <Link to={`/diagnoses/create`}>
                        Create New Diagnosis
                    </Link>
                </Button>

                
                <Table>
                <TableCaption>List of diagnoses.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Diagnosis Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {(localDiagnoses || []).map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                            <TableCell>{diagnosis.id}</TableCell>
                            <TableCell>{getPatientNameById(diagnosis.patient_id)}</TableCell>
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