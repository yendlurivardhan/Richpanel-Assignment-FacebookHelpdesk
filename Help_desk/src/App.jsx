import "./App.css";
import DisplayDesk from "./Components/DisplayDesk";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Add this

function App() {
  return (
    <Router>
      <div className="App">
        <DisplayDesk />
      </div>
    </Router>
  );
}

export default App;
