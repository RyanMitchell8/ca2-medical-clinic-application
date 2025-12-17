import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown, ArrowLeft } from "lucide-react";

// Zod schema – validation rules
const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }),
  address: z.string().min(1, "Address is required"),
});

export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            date_of_birth: undefined,
            address: "",
        },
    });

    const createPatient = async (data) => {
        const isoDate = formatForAPI(data.date_of_birth);

        const options = {
            method: "POST",
            url: "/patients",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                date_of_birth: isoDate,
                address: data.address,
            },
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);

            navigate("/patients", {
                state: {
                    type: "success",
                    message: "Patient created successfully",
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = (formData) => {
        console.log(formData);
        createPatient(formData);
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Create a new Patient</CardTitle>
                        </div>
                    </CardHeader>

            <CardContent>
                <form id="create-patient-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                
                <div>
                    <label>First Name</label>
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="First Name" />
                        )}
                    />
                    {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.first_name.message}
                        </p>
                    )}
                </div>
                
                <div>
                    <label>Last Name</label>
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Last Name" />
                        )}
                    />
                    {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.last_name.message}
                        </p>
                    )}
                </div>
                
                <div>
                    <label>Email</label>
                    <Controller
                        name="email"
                        control={control}   
                        render={({ field }) => (
                            <Input {...field} placeholder="Email" />
                        )}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                
                <div>
                    <label>Phone</label>
                    <Controller
                        name="phone"
                        control={control}   
                        render={({ field }) => (
                            <Input {...field} placeholder="Phone" />
                        )}
                    />
                    {errors.phone && (  
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                        </p>
                    )}
                </div>
                
                <div>
                    <label>Date of Birth</label>
                    <Controller
                        name="date_of_birth"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>    
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        {field.value
                                            ? field.value.toLocaleDateString()
                                            : "Select date of birth"}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-auto">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />  
                    {errors.date_of_birth && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.date_of_birth.message}
                        </p>
                    )}
                </div>
                
                    
                <div>
                    <label>Address</label>
                    <Controller
                        name="address"
                        control={control}   
                        render={({ field }) => (
                            <Input {...field} placeholder="Address" />
                        )}
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                        </p>
                    )}
                </div>
                </form>
            </CardContent>

            <CardFooter>
                <Button type="submit" form="create-patient-form">Create Patient</Button>
            </CardFooter>
        </Card>
    );
}
