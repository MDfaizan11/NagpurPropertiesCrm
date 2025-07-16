import React, { useEffect } from "react";
import "./MaterialStock.css";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../config";
function MaterialStock() {
  const token = JSON.parse(localStorage.getItem("NagpurProperties"))?.token;

  return <div>MaterialStock</div>;
}

export default MaterialStock;
