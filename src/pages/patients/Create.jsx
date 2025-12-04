    import { useState } from "react";
    import axios from "@/config/api";
    import { useNavigate } from "react-router";
    import { useAuth } from "@/hooks/useAuth";

    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";

    export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
    });

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]:
            e.target.name === "date_of_birth"
            ? Number(e.target.value)
            : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        await axios.post("/patients", form, {
            headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/patients");
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <>
        <h1 className="text-xl font-bold mb-4">Create New Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <Input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            />
            <Input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            />
            <Input name="email" placeholder="Email" onChange={handleChange} />
            <Input name="phone" placeholder="Phone" onChange={handleChange} />
            <Input
            name="date_of_birth"
            placeholder="Year of Birth"
            onChange={handleChange}
            />
            <Input name="address" placeholder="Address" onChange={handleChange} />

            <Button type="submit" variant="outline">
            Create Patient
            </Button>
        </form>
        </>
    );
    }
