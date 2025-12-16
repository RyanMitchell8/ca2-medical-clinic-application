import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter, CardAction } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatDate";

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
  const [prescriptions, setPrescriptions] = useState([]);

  const navigate = useNavigate();

  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const options = {
        method: "GET",
        url: "/prescriptions",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPrescriptions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescriptions();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
  
  };

  return (
    <Card className="w-full">
      <CardHeader className="items-start">
        <div>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>{prescriptions.length} total</CardDescription>
        </div>

        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link to={`/prescriptions/create`}>Create</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Search medication or patient id" className="w-72" />
          </div>
          <div className="text-sm text-muted-foreground">Showing {prescriptions.length} prescriptions</div>
        </div>

        {/* Table */}
        <Table className="overflow-visible">
          <TableCaption>List of prescriptions.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Doctor ID</TableHead>
            <TableHead>Diagnosis ID</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>View</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.patient_id}</TableCell>
              <TableCell>{prescription.doctor_id}</TableCell>
              <TableCell>{prescription.diagnosis_id}</TableCell>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{formatDate(prescription.start_date)}</TableCell>
              <TableCell>{formatDate(prescription.end_date)}</TableCell>

              <TableCell>
              <div className="flex gap-2">
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/prescriptions/${prescription.id}`)}
              ><Eye /></Button>
              <Button 
                className="cursor-pointer hover:border-blue-500"
                variant="outline"
                size="icon"
                onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
              ><Pencil /></Button>
              <DeleteBtn onDeleteCallback={onDeleteCallback} resource="prescriptions" id={prescription.id} />
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
