import React, { useEffect, useState } from "react";
import "./machineLocation.css";

const MachineLocationPage = () => {
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/machines")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => setMachines(data))
            .catch((error) => console.error("Error fetching machines:", error));
    }, []);

    return (
        <div className="table-container">
            <h1 className="heading">Machine Locations</h1>
            {machines.length === 0 ? (
                <p className="no-data">No machines available.</p>
            ) : (
                <table className="location-table">
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Location Name</th>
                            <th>Status</th>
                            <th>Technician Name</th>
                            <th>Refiller Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machines.map((machine) => (
                            <tr key={machine.machine_id}>
                                <td>{machine.machine_id}</td>
                                <td>{machine.location_name}</td>
                                <td>{machine.status}</td>
                                <td>{machine.technician_name || "N/A"}</td>
                                <td>{machine.refiller_name || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MachineLocationPage;
