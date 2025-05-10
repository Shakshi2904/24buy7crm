import React, { useEffect, useState } from "react";
import "./machineLocation.css";

const RefillerDueDate = () => {
    const [refillerTasks, setRefillerTasks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/refiller_tasks")
            .then((response) => response.json())
            .then((data) => setRefillerTasks(data))
            .catch((error) => console.error("Error fetching refiller tasks:", error));
    }, []);

    return (
        <div className="table-container">
            <h1 className="heading">Pending tasks</h1>
            {refillerTasks.length === 0 ? (
                <p className="no-data">No Pending Complaints</p>
            ) : (
                <table className="location-table">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Machine ID</th>
                            <th>Issue</th>
                            <th>Assigned Date</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refillerTasks.map((task, index) => (
                            <tr key={task.complaint_id}>
                                <td>{index + 1}</td>
                                <td>{task.refiller_name}</td>
                                <td>{task.refiller_email}</td>
                                <td>{task.machine_id}</td>
                                <td>{task.issue_description}</td>
                                <td>{task.assigned_date}</td>
                                <td>{task.due_date || "Not Assigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RefillerDueDate;
