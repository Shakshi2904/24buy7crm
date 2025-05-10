import React, { useState, useEffect } from "react";

const RefillerPendingTasks = () => {
    const [tasks, setTasks] = useState([]);
    const refillerId = localStorage.getItem("userId");

    useEffect(() => {
        if (!refillerId) return; 

        fetch(`http://localhost:5000/api/refiller_pending_tasks/${refillerId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, [refillerId]);

    const markAsCompleted = async (complaintId) => {
        try {
            console.log(`Sending request to update task: ${complaintId}`);

            const res = await fetch(`http://localhost:5000/api/refiller_update_task_status/${complaintId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            console.log("Response from backend:", data);

            if (res.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.complaint_id !== complaintId));
            } else {
                console.error("Failed to update task status:", data.message);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <div>
            <h2>Pending Tasks</h2>
            {tasks.length === 0 ? (
                <p>No pending tasks. Check if there is any new task assigned</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Complaint ID</th>
                            <th>Issue</th>
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
                                <td>{new Date(task.assigned_date).toLocaleDateString()}</td>
                                <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not Assigned"}</td>
                                <td>
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

export default RefillerPendingTasks;
