import React from "react";
import { useNavigate } from "react-router-dom";
import "./role.css";

const RoleSelection = () => {
    const navigate = useNavigate();
    const role = parseInt(localStorage.getItem("role"));

    const roleAccess = {
        1: ["Admin"],
        2: ["Technician"],
        3: ["Refiller"],
        4: ["Client"],
    };

    const handleCardClick = (roleName) => {
        navigate(`/${roleName.toLowerCase()}-dashboard`);
    };

    if (!role || !roleAccess[role]) {
        return <h2>Unauthorized Access</h2>;
    }

    return (
        <div className="container">
            <h1>Select Your Role</h1>
            <div className="role-selection">
                {roleAccess[role].map((roleName) => (
                    <div key={roleName} className="role-card" onClick={() => handleCardClick(roleName)}>
                        {roleName}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleSelection;
