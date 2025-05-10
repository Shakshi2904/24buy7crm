import React, { useState, useEffect } from "react";

const ClientComplaint = () => {
    const [issues, setIssues] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedIssue, setSelectedIssue] = useState("");
    const [customIssue, setCustomIssue] = useState("");

    const clientId = parseInt(localStorage.getItem("userId"), 10);

    useEffect(() => {
        fetch("http://localhost:5000/api/client_complaint_issues")
            .then((res) => res.json())
            .then((data) => setIssues(data))
            .catch((err) => console.error(err));
    }, []);
    

    // Fetch cities on component mount
    useEffect(() => {
        fetch("http://localhost:5000/api/cities")
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch addresses based on the selected city
    useEffect(() => {
        if (selectedCity) {
            fetch(`http://localhost:5000/api/addresses/${selectedCity}`)
                .then((res) => res.json())
                .then((data) => {
                    setAddresses(data);
                    setSelectedAddress(""); // Reset address selection
                    setMachines([]); // Clear machine list
                })
                .catch((err) => console.error(err));
        } else {
            setAddresses([]);
            setMachines([]);
        }
    }, [selectedCity]);

    // Fetch machines based on the selected address
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
    
        if (!clientId) {
            alert("User not authenticated. Please log in.");
            return;
        }
    
        if (!selectedMachine || !selectedIssue) {
            alert("Please select a machine and issue.");
            return;
        }
    
        const complaintData = {
            client_id: clientId,
            machine_id: selectedMachine,
            issue_id: selectedIssue,
        };
    
        const response = await fetch("http://localhost:5000/api/client_submit_complaint", {
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
                {/* City Dropdown */}
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

                {/* Address Dropdown (Appears after selecting City) */}
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

                {/* Machine Dropdown (Appears after selecting Address) */}
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
                                    Machine {machine.id} - {machine.status}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Issue Dropdown */}
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


                {/* Custom Issue */}
                <label>Other Issue (if not listed):</label>
                <input
                    type="text"
                    value={customIssue}
                    onChange={(e) => setCustomIssue(e.target.value)}
                    placeholder="Enter new issue (optional)"
                    disabled={selectedIssue}
                />

                {/* Submit Button */}
                <button type="submit">Submit Complaint</button>
            </form>
        </div>
    );
};

export default ClientComplaint;
