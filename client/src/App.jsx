import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;