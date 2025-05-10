import React, { useState, useEffect } from "react";

const TechnicianComplaint = () => {
    const [issues, setIssues] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedIssue, setSelectedIssue] = useState("");

    const technicianId = parseInt(localStorage.getItem("userId"), 10);

    useEffect(() => {
        fetch("http://localhost:5000/api/technician_complaint_issues")
            .then((res) => res.json())
            .then((data) => setIssues(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/cities")
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetch(`http://localhost:5000/api/addresses/${selectedCity}`)
                .then((res) => res.json())
                .then((data) => {
                    setAddresses(data);
                    setSelectedAddress("");
                    setMachines([]);
                })
                .catch((err) => console.error(err));
        } else {
            setAddresses([]);
            setMachines([]);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedAddress) {
            fetch(`http://localhost:5000/api/client_machines/${selectedAddress}`)
                .then((res) => res.json())
                .then((data) => setMachines(data))
                .catch((err) => console.error(err));
        } else {
            setMachines([]);
        }
    }, [selectedAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!technicianId) {
            alert("User not authenticated. Please log in.");
            return;
        }

        if (!selectedMachine || !selectedIssue) {
            alert("Please select a machine and issue.");
            return;
        }

        const complaintData = {
            technician_id: technicianId,
            machine_id: selectedMachine,
            issue_id: selectedIssue,
        };

        const response = await fetch("http://localhost:5000/api/technician_submit_complaint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(complaintData),
        });

        if (response.ok) {
            alert("Complaint submitted successfully!");
            setSelectedCity("");
            setSelectedAddress("");
            setSelectedMachine("");
            setSelectedIssue("");
        } else {
            const errorData = await response.json();
            alert(`Failed to submit complaint: ${errorData.error}`);
        }
    };

    return (
        <div>
            <h1>Submit a Complaint</h1>
            <form onSubmit={handleSubmit}>
                <label>City:</label>
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    required
                >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city.location_name} value={city.location_name}>
                            {city.location_name}
                        </option>
                    ))}
                </select>

                {selectedCity && (
                    <>
                        <label>Address:</label>
                        <select
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            required
                        >
                            <option value="">Select Address</option>
                            {addresses.map((address) => (
                                <option key={address.id} value={address.id}>
                                    {address.address}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {selectedAddress && (
                    <>
                        <label>Machine:</label>
                        <select
                            value={selectedMachine}
                            onChange={(e) => setSelectedMachine(e.target.value)}
                            required
                        >
                            <option value="">Select Machine</option>
                            {machines.map((machine) => (
                                <option key={machine.id} value={machine.id}>
                                    Machine {machine.id}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label>Issue:</label>
                <select
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    required
                >
                    <option value="">Select an Issue</option>
                    {issues.map((issue) => (
                        <option key={issue.id} value={issue.id}>
                            {issue.issue_description}
                        </option>
                    ))}
                </select>

                <button type="submit">Submit Complaint</button>
            </form>
        </div>
    );
};

export default TechnicianComplaint;
