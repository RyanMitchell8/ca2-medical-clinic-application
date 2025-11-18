import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from '@/components/ui/button'

export default function Index() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "https://ca2-med-api.vercel.app/doctors",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  const doctorCards = doctors.map((doctor) => {
    return (
      <Card key={doctor.id}>  
        <CardHeader>
          <CardTitle>{doctor.first_name} {doctor.last_name}</CardTitle>
          <CardDescription>{doctor.specialisation}</CardDescription>
        </CardHeader>

        <CardContent>
          <p>Email: {doctor.email}</p>
          <p>Phone: {doctor.phone}</p>
        </CardContent>

        <CardFooter>
          <Button
            asChild
            variant='outline'
          >
            <Link size='md' to={`/doctors/${doctor.id}`}>View</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  });

  return (
    <>
      <h1>Doctors page</h1>
      {doctorCards}
    </>
  );
}
