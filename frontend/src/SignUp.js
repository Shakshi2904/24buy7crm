import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";
const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(3); // Default to 'Refiller'
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/auth/signup", { name, email, password, role_id: role });
            alert("Registration successful! Please log in.");
            navigate("/");
        } catch (error) {
            alert("Error during registration");
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <select onChange={(e) => setRole(e.target.value)}>
                    <option>Select</option>
                    <option value="1">Admin</option>
                    <option value="2">Technician</option>
                    <option value="3">Refiller</option>
                    <option value="4">Client</option>
                </select>
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/">Sign In</Link>
            </p>
        </div>
    );
};

export default SignUp;
