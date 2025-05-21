import { Outlet, Navigate } from "react-router-dom";
function Protected() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;
  console.log(token);
  return token ? <Outlet /> : <Navigate to={"/login"} />;
}

export default Protected;
