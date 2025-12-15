import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";
import { Input } from "@/components/ui/input";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export default function Edit() {
    const [form, setForm] = useState({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            date_of_birth: null,
            address: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [dateOpen, setDateOpen] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                let patient = response.data;

                const date = patient.date_of_birth ? new Date(patient.date_of_birth) : null;

                setForm({
                    first_name: patient.first_name,
                    last_name: patient.last_name,
                    email: patient.email,
                    phone: patient.phone,
                    date_of_birth: date,
                    address: patient.address,
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchPatient();
    }, [id, token]);

    const updatePatient = async () => {
        const options = {
            method: "PATCH",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone: form.phone,
                date_of_birth: formatForAPI(form.date_of_birth),
                address: form.address,
            },
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/patients", {
                state: {
                    type: "success",
                    message: "Patient updated successfully",
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePatient();
    };

    return (
        <>
            <h1>Update Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                {/* First Name */}
                <div>
                    <label className="block mb-1 text-sm font-medium">First Name</label>
                    <Input
                        value={form.first_name}
                        onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="First Name"
                    />
                </div>
                {/* Last Name */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Last Name</label>
                    <Input
                        value={form.last_name}
                        onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Last Name"
                    />
                </div>
                {/* Email */}   
                <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email"
                    />
                </div>
                {/* Phone */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Phone</label>
                    <Input
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone"
                    />
                </div>
                {/* Calendar */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Date of Birth</label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">
                                {form.date_of_birth ? form.date_of_birth.toLocaleDateString() : "Select date of birth"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Calendar
                                mode="single"
                                selected={form.date_of_birth}
                                onSelect={(d) => {
                                    setForm(prev => ({ ...prev, date_of_birth: d }));
                                    setDateOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                {/* Address */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Address</label>
                    <Input
                        value={form.address}
                        onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Address"
                    />
                </div>

                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">Submit</Button>
            </form>
        </>
    );
}