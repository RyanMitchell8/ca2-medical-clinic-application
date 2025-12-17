import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchPrescription = async () => {
      try {
        const { data } = await axios.get(`/prescriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPrescription(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrescription();
  }, [id, token]);

  if (!token) {
    return (
      <p className="text-center mt-6 text-muted-foreground">
        You must be logged in to view prescription details.
      </p>
    );
  }

  if (!prescription) {
    return <p className="text-center mt-6">Loading appointment...</p>;
  }


  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Prescription Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Prescription ID:</strong> {prescription.id}</p>
        <p><strong>Doctor ID:</strong> {prescription.doctor_id}</p>
        <p><strong>Patient ID:</strong> {prescription.patient_id}</p>
        <p><strong>Diagnosis ID:</strong> {prescription.diagnosis_id}</p>
        <p><strong>Medication:</strong> {prescription.medication}</p>
        <p><strong>Dosage:</strong> {prescription.dosage}</p>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/prescriptions">Back</Link>
        </Button>

        <Button asChild variant="outline">
          <Link to={`/prescriptions/${prescription.id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
