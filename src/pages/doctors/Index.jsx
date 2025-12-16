import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

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

export default function Index() {
  const [doctors, setDoctors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "/doctors",
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

  const onDeleteCallback = (id) => {
    toast.success("Doctor deleted successfully");
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Doctors</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Create Button */}
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
            <TableHead></TableHead>
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
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="doctors" id={doctor.id} />
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
