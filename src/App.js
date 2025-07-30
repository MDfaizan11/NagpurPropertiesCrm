import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
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
import Labour from "./Pages/labour/Labour";
import Plot from "./Pages/Plot/Plot";
import PlotDetails from "./Pages/Plot/PlotDetails";
import Material from "./Pages/Material/Material";
import Machine from "./Pages/Machine/Machine";
import Project from "./Pages/Project/Project";
import Finance from "./Pages/Finance/Finance";
import Task from "./Pages/Task/Task";
import Letters from "./Pages/Letters/Letters";
import Stock from "./Pages/Stock/Stock";
import PlotQuatation from "./Pages/Plot/PlotQuatation";
import History from "./Pages/Plot/History";
import FinanceParty from "./Pages/Finance/FinanceParty";
import PartyDetails from "./Pages/Finance/PartyDetails";
import Contractor from "./Pages/Contractor/Contractor";
import PartyTransaction from "./Pages/Finance/PartyTransaction";
import CompanyTransaction from "./Pages/Finance/CompanyTransaction";
import GetDepartment from "./Pages/Employee/GetDepartment";
import RegisterEmployeeForm from "./Pages/Employee/RegisterEmployeeForm";
import EmpList from "./Pages/Attendance/EmpList";
import Attendence from "./Pages/Attendance/Attendence";
import MonthlyReport from "./Pages/Attendance/MonthlyReport";
import MaterialVendor from "./Pages/Material/MaterialVendor";
import ContractorDetails from "./Pages/Contractor/ContractorDetails";
import MaterialVendorDetails from "./Pages/Material/MaterialVendorDetails";
import MaterialLogDetails from "./Pages/Material/MaterialLogDetails";
import MaterialPurches from "./Pages/Material/MaterialPurches";
import MaterialAllDetails from "./Pages/Material/MaterialAllDetails";
import VehicleMaterial from "./Pages/Material/VehicleMaterial";
import MaterialStock from "./Pages/Material/MaterialStock";
import Holiday from "../src/Pages/Employee/Holiday";
import Registration from "./Pages/Registration/Registration";
import MaterilOrderSummery from "./Pages/Material/MaterilOrderSummery";
import {
  getFcmToken,
  requestNotificationPermission,
  setupForegroundMessaging,
} from "./firebase/firebase-messaging";

import Engineer from "./Pages/Registration/Engineer";
import Vendor from "./Pages/Registration/Vendor";
function App() {
  useEffect(() => {
    async function initFcm() {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        const token = await getFcmToken();
        console.log("FCM Token:", token);
        if (token) {
          setupForegroundMessaging();
        }
      }
    }
    initFcm();
  }, []);
  return (
    <>
      <>
        <BrowserRouter>
          {/* <ToastContainer position="top-right" autoClose={5000} /> */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Protected />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Home />} />
                <Route path="lead/:ProjectId/:ProjectName" element={<Lead />} />
                <Route path="land" element={<Land />} />
                <Route path="leadProject" element={<LeadProject />} />
                <Route path="labour" element={<Labour />} />
                <Route path="plot" element={<Plot />} />
                <Route
                  path="plotQuatation/:plotId"
                  element={<PlotQuatation />}
                />
                <Route path="history/:id" element={<History />} />
                <Route path="stationary" element={<Stationary />} />
                <Route path="office" element={<Office />} />
                <Route
                  path="/plotDetails/:ProjectId/:ProjectName"
                  element={<PlotDetails />}
                />
                <Route path="material" element={<Material />} />
                <Route
                  path="/materialVendor/:ProjectId/:ProjectName"
                  element={<MaterialVendor />}
                />
                <Route
                  path="/MaterialVendorDetails/:VendorId/:ProjectName/:ProjectId"
                  element={<MaterialVendorDetails />}
                />
                <Route
                  path="/MaterialLogDetails/:id/:name"
                  element={<MaterialLogDetails />}
                />

                <Route element={<MaterialPurches />} path="/purchesOrder" />
                <Route
                  path="/MaterialAllDetails/:ProjectId/:ProjectName"
                  element={<MaterialAllDetails />}
                />
                <Route path="/vehicleMaterial" element={<VehicleMaterial />} />
                <Route path="/MaterialStock" element={<MaterialStock />} />
                <Route
                  path="/MaterilOrderSummery/:id/:name"
                  element={<MaterilOrderSummery />}
                />
                <Route path="machine" element={<Machine />} />
                <Route path="project" element={<Project />} />
                <Route path="finance" element={<Finance />} />
                <Route
                  path="/financeParty/:id/:name"
                  element={<FinanceParty />}
                />
                <Route
                  path="/partyDetails/:id/:name"
                  element={<PartyDetails />}
                />
                <Route
                  path="/partyTransaction/:id/:name"
                  element={<PartyTransaction />}
                />
                <Route
                  path="/companyTransaction/:id/:name"
                  element={<CompanyTransaction />}
                />
                <Route path="task" element={<Task />} />
                <Route path="letter" element={<Letters />} />
                <Route path="stock" element={<Stock />} />
                <Route path="contractor" element={<Contractor />} />
                <Route
                  path="/contractorDetails/:projectId"
                  element={<ContractorDetails />}
                />
                <Route path="/getDepartment" element={<GetDepartment />} />
                <Route
                  path="/registerEmploye/:id"
                  element={<RegisterEmployeeForm />}
                />
                <Route path="/empList" element={<EmpList />} />
                <Route path="/attentance" element={<Attendence />} />
                <Route path="/monthlyReport" element={<MonthlyReport />} />
                <Route path="/holiday" element={<Holiday />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/engineer" element={<Engineer />} />
                <Route path="/Vendor" element={<Vendor />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    </>
  );
}

export default App;
