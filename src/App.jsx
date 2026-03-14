import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import LandingPage from "./LandingPage";
import ProjectPage from "./ProjectPage";
import ProjectDetail from "./ProjectDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="project-detail" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
