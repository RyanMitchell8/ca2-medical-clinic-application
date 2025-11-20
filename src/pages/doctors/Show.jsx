import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Show() {
  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `https://ca2-med-api.vercel.app/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  if (!doctor) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Doctor Details</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            {doctor.first_name} {doctor.last_name}
          </CardTitle>
          <CardDescription>Doctor ID: {doctor.id}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>Specialisation:</strong> {doctor.specialisation}</p>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/doctors">Back</Link>
          </Button>

          <Button asChild variant="outline">
            <Link to={`/doctors/${doctor.id}/edit`}>Edit</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
