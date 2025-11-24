import { useState } from "react";
import axios from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

export default function Register({ onLogin }) {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const options = {
            method: "POST",
            url: "/register",
            headers: { "Content-Type": "application/json" },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);

            // save token if the API returns one
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                onLogin(true, response.data.token);
            }

            navigate("/doctors");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <h1>Create an account</h1>

            <form onSubmit={submitForm}>
                <Input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
                    Register
                </Button>
            </form>
        </>
    );
}
