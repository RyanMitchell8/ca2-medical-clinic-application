import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
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
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointment(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAppointment();
  }, [id, token]);

  // If NOT logged in
  if (!token) {
    return (
      <p className="text-center mt-6 text-gray-500">
        You must be logged in to view appointment details.
      </p>
    );
  }

  // If logged in but still loading
  if (!appointment) {
    return <p className="text-center mt-6">Loading appointment...</p>;
  }

  const formattedDate = formatDate(appointment.appointment_date);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Appointment ID:</strong> {appointment.id}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Doctor ID:</strong> {appointment.doctor_id}</p>
        <p><strong>Patient ID:</strong> {appointment.patient_id}</p>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/appointments">Back</Link>
        </Button>

        <Button asChild variant="outline">
          <Link to={`/appointments/${appointment.id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
