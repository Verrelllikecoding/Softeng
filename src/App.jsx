import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import LandingPage from "./LandingPage";
import ProjectPage from "./ProjectPage";
import ProjectDetail from "./ProjectDetail";
import ProposalGenerator from "./ProposalGenerator";
import ProposalNegotiation from "./ProposalNegotiation";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/propose" element={<ProposalGenerator />} />
        <Route path="/projects/:id/negotiate" element={<ProposalNegotiation />} />
      </Routes>
    </BrowserRouter>
  );
}
