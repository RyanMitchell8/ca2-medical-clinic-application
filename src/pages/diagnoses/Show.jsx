import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchDiagnosis = async () => {
      try {
        const res = await axios.get(`/diagnoses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDiagnosis(res.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      }
    };
    fetchDiagnosis();
  }, [id, token]);

  if (!token) return <p className="text-center mt-6">Not authorized.</p>;
  if (error) return <p className="text-center mt-6">Error: {JSON.stringify(error)}</p>;
  if (!diagnosis) return <p className="text-center mt-6">Loading diagnosis...</p>;

  const formattedDate =
    typeof diagnosis.diagnosis_date === "number"
      ? formatDate(diagnosis.diagnosis_date)
      : new Date(diagnosis.diagnosis_date).toLocaleString();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Diagnosis Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>ID:</strong> {diagnosis.id}</p>
        <p><strong>Patient ID:</strong> {diagnosis.patient_id}</p>
        <p><strong>Condition:</strong> {diagnosis.condition}</p>
        <p><strong>Diagnosis Date:</strong> {formattedDate}</p>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/diagnoses">Back</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/diagnoses/${diagnosis.id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}