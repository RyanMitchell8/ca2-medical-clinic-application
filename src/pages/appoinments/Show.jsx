import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { formatDate, formatForInput } from "@/utils/formatDate";
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

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

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

  useEffect(() => {
    if (!token) return;
    const fetchLists = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          axios.get("/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);
      }
      catch (err) {
        console.log(err);
      }
    };

    fetchLists();
  }, [token]);


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

  const inputDateStr = formatForInput(appointment.appointment_date);
  let apptDate;
  if (inputDateStr) {
    const [yyyy, mm, dd] = inputDateStr.split("-");
    apptDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 12, 0, 0, 0);
  } else {
    apptDate = new Date(appointment.appointment_date);
    if (Number.isNaN(apptDate.getTime())) apptDate = new Date();
    apptDate.setHours(12, 0, 0, 0);
  }


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

  return (
    <Card className="max-w-4xl mx-auto">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-2xl">
          Appointment Details
        </CardTitle>
        <p className="text-muted-foreground">
          Scheduled on {formattedDate}
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Key info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Appointment ID</p>
            <p className="text-lg font-medium">{appointment.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-lg font-medium">{formattedDate}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Doctor</p>
            <Link
              to={`/doctors/${appointment.doctor_id}`}
              className="text-lg font-medium hover:underline"
            >
              {getDoctorNameById(appointment.doctor_id)}
            </Link>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Patient</p>
            <Link
              to={`/patients/${appointment.patient_id}`}
              className="text-lg font-medium hover:underline"
            >
              {getPatientNameById(appointment.patient_id)}
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Appointment date
          </p>

          <div className="inline-block rounded-md border p-2">
            <Calendar
              mode="single"
              selected={apptDate}
              defaultMonth={apptDate}
              components={{
                DayButton: (props) => (
                  <CalendarDayButton {...props} disabled />
                ),
              }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button asChild variant="outline">
          <Link to="/appointments">Back</Link>
        </Button>

        <Button asChild>
          <Link to={`/appointments/${appointment.id}/edit`}>
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

}
