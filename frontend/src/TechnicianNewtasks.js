import React, { useState, useEffect } from "react";

const TechnicianNewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [dueDates, setDueDates] = useState({}); // Store selected dates for each task
    const technicianId = parseInt(localStorage.getItem("userId"), 10);

    console.log("Technician ID from localStorage:", technicianId);

    useEffect(() => {
        if (!technicianId) return;

        fetch(`http://localhost:5000/api/technician_new_tasks/${technicianId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, [technicianId]);

    // Handle date input change
    const handleDateChange = (complaintId, date) => {
        setDueDates(prev => ({ ...prev, [complaintId]: date }));
    };

    // ✅ Send selected due date & complaint ID to backend
    const assignDueDate = async (complaintId) => {
        const dueDate = dueDates[complaintId];
        if (!dueDate) {
            alert("Please select a due date before submitting!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/technician_new_tasks/${complaintId}/duedateassign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ due_date: dueDate })
            });

            if (response.ok) {
                // ✅ Remove task from state after successful update
                setTasks(prevTasks => prevTasks.filter(task => task.complaint_id !== complaintId));
            } else {
                console.error("Failed to update task:", response.statusText);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <div className="task-container">
            <h2>New Tasks</h2>
            {tasks.length === 0 ? (
                <p>No new tasks assigned.</p>
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
                                <td>{task.assigned_date ? new Date(task.assigned_date).toLocaleDateString() : "N/A"}</td>
                                <td>
                                    <input
                                        type="date"
                                        value={dueDates[task.complaint_id] || ""}
                                        onChange={(e) => handleDateChange(task.complaint_id, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => assignDueDate(task.complaint_id)}>Assign Due Date</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TechnicianNewTasks;
