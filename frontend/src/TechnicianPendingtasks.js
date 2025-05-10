import React, { useState, useEffect } from "react";

const TechnicianPendingTasks = () => {
    const [tasks, setTasks] = useState([]);
    const technicianId = localStorage.getItem("userId");

    useEffect(() => {
        if (!technicianId) return;

        fetch(`http://localhost:5000/api/technician_pending_tasks/${technicianId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched tasks:", data);
                setTasks(data);
            })
            .catch(err => console.error("Error fetching tasks:", err));
    }, [technicianId]);

    // ✅ Function to update task status
    const markAsCompleted = async (complaintId) => {
        try {
            console.log(`Sending request to update task: ${complaintId}`);

            const res = await fetch(`http://localhost:5000/api/technician_update_task_status/${complaintId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            console.log("Response from backend:", data);

            if (res.ok) {
                // ✅ Update UI: Remove completed task
                setTasks(prevTasks => prevTasks.filter(task => task.complaint_id !== complaintId));
            } else {
                console.error("Failed to update task status:", data.message);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <div className="task-container">
            <h2>Pending Tasks</h2>
            {tasks.length === 0 ? (
                <p>No pending tasks. Check if there is any new task assigned.</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Complaint ID</th>
                            <th>Issue Description</th>
                            <th>Assigned Date</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.complaint_id}>
                                <td>{task.complaint_id}</td>
                                <td>{task.issue_description}</td>
                                <td>{task.assigned_date ? new Date(task.assigned_date).toLocaleDateString() : "N/A"}</td>
                                <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not Assigned"}</td>
                                <td>
                                    {/* ✅ Checkbox to Mark as Completed */}
                                    <input 
                                        type="checkbox" 
                                        onChange={() => markAsCompleted(task.complaint_id)} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TechnicianPendingTasks;
