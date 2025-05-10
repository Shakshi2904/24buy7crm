import React, { useState, useEffect } from "react";

const RefillerNewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [dueDates, setDueDates] = useState({}); // Store selected dates for each task
    const refillerId = parseInt(localStorage.getItem("userId"), 10);

    useEffect(() => {
        if (!refillerId) return;

        fetch(`http://localhost:5000/api/refiller_new_tasks/${refillerId}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, [refillerId]);

    // Handle date input change
    const handleDateChange = (complaintId, date) => {
        setDueDates(prev => ({ ...prev, [complaintId]: date }));
    };

    // Send selected due date & complaint ID to backend
    const markAsCompleted = async (complaintId) => {
        const dueDate = dueDates[complaintId];
        if (!dueDate) {
            alert("Please select a due date before submitting!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/refiller_new_tasks/${complaintId}/duedateassign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ due_date: dueDate })
            });

            if (response.ok) {
                // Remove task from state after successful update
                setTasks(prevTasks => prevTasks.filter(task => task.complaint_id !== complaintId));
            } else {
                console.error("Failed to update task:", response.statusText);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <div>
            <h2>New Tasks</h2>
            {tasks.length === 0 ? (
                <p>No new tasks assigned till now</p>
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
                                    <button onClick={() => markAsCompleted(task.complaint_id)}>Submit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RefillerNewTasks;
