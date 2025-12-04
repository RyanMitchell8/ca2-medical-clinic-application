import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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
    <>

      {/* Create Button (same style as festivals project) */}
      <Button
        asChild
        variant="outline"
        className="mb-4 mr-auto block"
      >
        <Link size="sm" to={`/prescriptions/create`}>
          Create New Prescription
        </Link>
      </Button>

      {/* Table */}
      <Table>
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

    </>
  );
}
