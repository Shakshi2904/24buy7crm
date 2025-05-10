import React from "react";
import { useNavigate } from "react-router-dom";
import "./role.css";

const RefillerDashBoard = () => {
    const navigate = useNavigate();

    const duedate = ["New tasks","Pending tasks","Submit a Complaint"];

    const handleCardClick = (task) => {
        const formattedRoute = task.toLowerCase().replace(/\s+/g, '-');
        navigate(`/${formattedRoute}-refillerdashboard`);
    };

    return (
        <div className="container">
            <h1>Due Dates</h1>
            <div className="role-selection">
                {duedate.map((task) => (
                    <div key={task} className="role-card" onClick={() => handleCardClick(task)}>
                        {task}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RefillerDashBoard;