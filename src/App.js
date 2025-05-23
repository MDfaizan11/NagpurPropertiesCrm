import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lead from "./Pages/Lead/Lead";
import Land from "./Pages/Land/Land";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Home/Home";
import Login from "./Components/login/Login";
import Protected from "./Components/protected/Protected";
import LeadProject from "./Pages/Lead/LeadProject";
import Stationary from "./Pages/stationary/Stationary";
import Office from "./Pages/office/Office";
function App() {
  return (
    <>
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Protected />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Home />} />
                <Route path="lead/:ProjectId/:ProjectName" element={<Lead />} />
                <Route path="land" element={<Land />} />
                <Route path="leadProject" element={<LeadProject />} />
                <Route path="stationary" element={<Stationary />} />
                <Route path="office" element={<Office />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    </>
  );
}

export default App;
