import React from "react";
import { useNavigate } from "react-router-dom";
import "./role.css";

const DueDatesPage = () => {
    const navigate = useNavigate();

    const duedate = ["Refiller Due Dates","Technician Due Dates"];

    const handleCardClick = (task) => {
        const formattedRoute = task.toLowerCase().replace(/\s+/g, '-');
        navigate(`/${formattedRoute}-dashboard`);
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

export default DueDatesPage;
