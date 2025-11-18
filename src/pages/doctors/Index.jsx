import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  return (
    <>

      {/* Create Button (same style as festivals project) */}
      <Button
        asChild
        variant="outline"
        className="mb-4 mr-auto block"
      >
        <Link size="sm" to={`/doctors/create`}>
          Create New Doctor
        </Link>
      </Button>

      {/* Table */}
      <Table>
        <TableCaption>List of doctors.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialisation</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{doctor.first_name}</TableCell>
              <TableCell>{doctor.last_name}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.phone}</TableCell>
              <TableCell>{doctor.specialisation}</TableCell>

              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/doctors/${doctor.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </>
  );
}
