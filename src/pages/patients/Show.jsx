import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Show() {
    const { id } = useParams();
    const { token } = useAuth();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
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

        fetchPatient();
    }, []);

    if (!patient) return <p>Loading...</p>;

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>
                    {patient.first_name} {patient.last_name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
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
    );
}
