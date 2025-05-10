import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import RoleSelection from "./RoleSelection";
import AdminDashboard from "./AdminDashboard";
import TechnicianDashboard from "./TechnicianDashboard";
import RefillerDashboard from "./RefillerDashboard";
import MachineLocationPage from "./MachineLocationPage";
import MachinePartsPage from "./MachinePartsPage";
import ComplaintsFeedbackPage from "./ComplaintsFeedbackPage";
import DueDatesPage from "./DueDatesPage";
import Refillerduedate from "./Refillerduedate";
import Technicianduedate from "./Technicianduedate";
import TechnicianNewtasks from "./TechnicianNewtasks";
import TechnicianPendingtasks from "./TechnicianPendingtasks";
import TechnicianComplaint from "./TechnicianComplaint";
import RefillerNewtasks from "./RefillerNewtasks";
import RefillerPendingtasks from "./RefillerPendingtasks";
import RefillerComplaint from "./RefillerComplaint";
import ClientDashboard from "./ClientDashboard";
import ClientComplaint from "./ClientComplaint";
import AdminComplaint from "./AdminComplaint";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/roles" element={<RoleSelection />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
                <Route path="/refiller-dashboard" element={<RefillerDashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard/>}/>
                <Route path="/machine-location-dashboard" element={<MachineLocationPage />} />
                <Route path="/machine-details-admindashboard" element={<MachinePartsPage />} />
                <Route path="/complaints-and-feedbacks-dashboard" element={<ComplaintsFeedbackPage />} />
                <Route path="/due-dates-admindashboard" element={<DueDatesPage />} />
                <Route path="/refiller-due-dates-dashboard" element={<Refillerduedate/>}/>
                <Route path="/technician-due-dates-dashboard" element={<Technicianduedate/>}/>
                <Route path="/new-tasks-techdashboard" element={<TechnicianNewtasks/>}/>
                <Route path="/pending-tasks-techdashboard" element={<TechnicianPendingtasks/>}/>
                <Route path="/submit-a-complaint-techdashboard" element={<TechnicianComplaint/>}/>
                <Route path="/new-tasks-refillerdashboard" element={<RefillerNewtasks/>}/>
                <Route path="/pending-tasks-refillerdashboard" element={<RefillerPendingtasks/>}/>
                <Route path="/submit-a-complaint-refillerdashboard" element={<RefillerComplaint/>}/>
                <Route path="/client-complaint-dashboard" element={<ClientComplaint/>}/>
                <Route path="/submit-a-complaint-admindashboard" element={<AdminComplaint/>}/>
            </Routes>
        </Router>
    );
}

export default App;