import React from "react";
import { useNavigate } from "react-router-dom";
import "./role.css";

const ClientDashboard = () =>{
    const navigate = useNavigate();

    const duedate = ["Client Complaint"];

    const handleCardClick = (task) => {
        const formattedRoute = task.toLowerCase().replace(/\s+/g, '-');
        navigate(`/${formattedRoute}-dashboard`);
    };

    return (
        <div className="container">
            <h1>Client DashBoard</h1>
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
export default ClientDashboard;