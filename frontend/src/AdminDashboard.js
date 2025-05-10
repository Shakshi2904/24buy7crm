import React from "react";
import { useNavigate } from "react-router-dom";
import "./role.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const admin_tasks = ["Machine Details","Due dates","Submit a Complaint"];

    const handleCardClick = (task) => {
        const formattedRoute = task.toLowerCase().replace(/\s+/g, '-');
        navigate(`/${formattedRoute}-admindashboard`);
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <div className="role-selection">
                {admin_tasks.map((task) => (
                    <div key={task} className="role-card" onClick={() => handleCardClick(task)}>
                        {task}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
