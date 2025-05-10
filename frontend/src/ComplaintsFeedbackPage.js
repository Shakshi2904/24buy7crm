import React, { useEffect, useState } from "react";
import "./machineLocation.css";  

const ComplaintsFeedbackPage = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/complaints")
            .then((response) => response.json())
            .then((data) => setComplaints(data))
            .catch((error) => console.error("Error fetching complaints:", error));
    }, []);
    
    return (
        <div className="table-container">
            <h1 className="heading">Complaints & Feedback</h1>
            {complaints.length === 0 ? (
                <p className="no-data">No complaints available.</p>
            ) : (
                <table className="location-table">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>  {/* Auto-incremented Serial Number */}
                            <th>Issue Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint, index) => (
                            <tr key={complaint.id}>
                                <td>{index + 1}</td> {/* Serial Number starts from 1 */}
                                <td>{complaint.issue_description}</td>
                                <td className={complaint.status === "resolved" ? "status-resolved" : "status-pending"}>
                                    {complaint.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ComplaintsFeedbackPage;
