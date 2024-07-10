import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NotFoundPage from "./404";
import Invitations from "./Invitations";
import Invitation from "./Invitation";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/404" />} />
        <Route path="/pozivnice" element={<Invitations />} />
        <Route path="/pozivnica" element={<Invitation />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
