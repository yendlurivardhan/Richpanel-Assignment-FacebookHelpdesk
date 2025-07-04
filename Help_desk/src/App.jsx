import "./App.css";
import DisplayDesk from "./Components/DisplayDesk";
import ConnectPage from "./Components/ConnectPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayDesk />} />
        <Route path="/connect" element={<ConnectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
