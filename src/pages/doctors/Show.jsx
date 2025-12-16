import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, Link } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatDate";

export default function Show() {
  const [doctor, setDoctor] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Show/Hide logic for appointments and prescriptions
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);

  const MAX_VISIBLE = 5; // number to show before collapsing

  const { id } = useParams();
  const { token } = useAuth();

  // Fetch doctor
  useEffect(() => {
    if (!token) return;

    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctor();
  }, [id, token]);

  // Fetch appointments + prescriptions once doctor is loaded
  useEffect(() => {
    if (!token || !doctor) return;

    const fetchRelated = async () => {
      setLoadingRelated(true);

      try {
        const doctorId = doctor.id;
        // Fetch appointments and prescriptions in parallel
        const [apptsRes, presRes, patients] = await Promise.all([
          axios.get(`/appointments`, {
            params: { doctor_id: doctorId },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/prescriptions`, {
            params: { doctor_id: doctorId },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        // Ensure data is an array before setting state
        setDoctorAppointments(Array.isArray(apptsRes.data) ? apptsRes.data : []);
        setPrescriptions(Array.isArray(presRes.data) ? presRes.data : []);
        setPatients(Array.isArray(patients.data) ? patients.data : []);
      } catch (err) {
        console.error(err);
        setDoctorAppointments([]);
        setPrescriptions([]);
        setPatients([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [doctor, token]);

  // function to get patient name by id
  const getPatientNameById = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown";
  };

  if (!doctor) return <p>Loading doctor...</p>;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto px-1">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Details</h1>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/doctors">Back</Link>
          </Button>

          <Button asChild>
            <Link to={`/doctors/${doctor.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>
    </div>

      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold">
            {doctor.first_name[0]}
            {doctor.last_name[0]}
          </div>

          <div>
            <CardTitle className="text-2xl font-semibold">
              {doctor.first_name} {doctor.last_name}
            </CardTitle>
            <CardDescription className="text-base">
              Specialist in {doctor.specialisation}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBox label="Email" value={doctor.email} />
            <InfoBox label="Phone" value={doctor.phone} />
            <InfoBox label="Doctor ID" value={doctor.id} />
            <InfoBox label="Specialisation" value={doctor.specialisation} />
          </div>

          <SectionHeader title="Appointments" />

          {loadingRelated ? (
            <p className="text-muted-foreground text-sm">
              Loading appointments...
            </p>
          ) : doctorAppointments.length === 0 ? (
            <EmptyState message="No appointments found." />
          ) : (
            <div className="space-y-3">
              {(showAllAppointments
                ? doctorAppointments
                : doctorAppointments.slice(0, MAX_VISIBLE)
              ).map((a) => (
                <Card key={a.id} className="p-3 bg-gray-50 border">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/appointments/${a.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {formatDate(a.appointment_date || a.date || a.created_at)}
                    </Link>

                    <span className="text-sm text-gray-600">
                      Patient {a.patient_id} - {getPatientNameById(a.patient_id)}
                    </span>
                  </div>
                </Card>
              ))}

              {doctorAppointments.length > MAX_VISIBLE && (
                <button
                  onClick={() => setShowAllAppointments((prev) => !prev)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {showAllAppointments ? "View Less" : "View More"}
                </button>
              )}
            </div>
          )}

          <SectionHeader title="Prescriptions" />

          {loadingRelated ? (
            <p className="text-muted-foreground text-sm">
              Loading prescriptions...
            </p>
          ) : prescriptions.length === 0 ? (
            <EmptyState message="No prescriptions found." />
          ) : (
            <div className="space-y-3">
              {(showAllPrescriptions
                ? prescriptions
                : prescriptions.slice(0, MAX_VISIBLE)
              ).map((p) => {
                const med =
                  p.medication ||
                  p.medication_name ||
                  p.drug ||
                  p.name ||
                  p.med;

                const d = p.prescription_date || p.date || p.created_at;

                return (
                  <Card key={p.id} className="p-3 bg-gray-50 border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        #{p.id} — {med}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(d)} — Patient {p.patient_id} - {getPatientNameById(p.patient_id)}
                      </span>
                    </div>
                  </Card>
                );
              })}

              {prescriptions.length > MAX_VISIBLE && (
                <button
                  onClick={() => setShowAllPrescriptions((prev) => !prev)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {showAllPrescriptions ? "View Less" : "View More"}
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg border bg-white shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function SectionHeader({ title }) {
  return <h3 className="text-lg font-semibold border-b pb-1 mt-4">{title}</h3>;
}

function EmptyState({ message }) {
  return (
    <div className="text-sm text-muted-foreground bg-gray-50 border rounded-md p-3">
      {message}
    </div>
  );
}
