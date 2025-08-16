// import { useEffect, useState, useCallback } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import "./task.css";
// import { BASE_URL } from "../../config";
// import {
//   CalendarDays,
//   Edit2,
//   Trash2,
//   Search,
//   Plus,
//   Users,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Eye,
//   User,
//   Building2,
//   Calendar,
//   Target,
//   Ban,
// } from "lucide-react";

// const Task = () => {
//   const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
//   const token = userData?.token;
//   const role =
//     typeof userData?.role === "string"
//       ? userData.role
//       : userData?.role?.roleName || userData?.role?.[0]?.roleName || "Partner";
//   const userId = userData?.id;

//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [activeMainTab, setActiveMainTab] = useState(
//     role === "Employee" ? "Assign Task" : "Created Task"
//   );
//   const [activeSubTab, setActiveSubTab] = useState("All Tasks");
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     taskName: "",
//     taskDescription: "",
//     priority: "LOW",
//     dueDate: "",
//     departmentId: "",
//     assignees: [],
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editTaskId, setEditTaskId] = useState(null);
//   const [showAssigneeModal, setShowAssigneeModal] = useState(false);
//   const [assigneeData, setAssigneeData] = useState([]);
//   const [assigneeLoading, setAssigneeLoading] = useState(false);
//   const [assigneeError, setAssigneeError] = useState(null);
//   const [showAssigneeEditModal, setShowAssigneeEditModal] = useState(false);
//   const [editAssigneeTaskId, setEditAssigneeTaskId] = useState(null);
//   const [assigneeFormData, setAssigneeFormData] = useState({
//     taskStatus: "PENDING",
//     delayReason: "",
//     completedDate: "",
//   });
//   const [showEligibleAssigneesModal, setShowEligibleAssigneesModal] =
//     useState(false);
//   const [eligibleAssignees, setEligibleAssignees] = useState([]);
//   const [eligibleAssigneesLoading, setEligibleAssigneesLoading] =
//     useState(false);
//   const [eligibleAssigneesError, setEligibleAssigneesError] = useState(null);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [selectedAssigneeToReplace, setSelectedAssigneeToReplace] =
//     useState(null);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [historyData, setHistoryData] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyError, setHistoryError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 5;

//   const statusMap = {
//     "All Tasks": "ALL",
//     Pending: "PENDING",
//     "In Progress": "IN_PROGRESS",
//     Completed: "COMPLETED",
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "COMPLETED":
//         return <CheckCircle className="status-icon" />;
//       case "IN_PROGRESS":
//         return <Clock className="status-icon" />;
//       case "PENDING":
//         return <AlertCircle className="status-icon" />;
//       default:
//         return <AlertCircle className="status-icon" />;
//     }
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority?.toUpperCase()) {
//       case "HIGH":
//         return <Target className="priority-icon priority-high" />;
//       case "MEDIUM":
//         return <Target className="priority-icon priority-medium" />;
//       case "LOW":
//         return <Target className="priority-icon priority-low" />;
//       default:
//         return <Target className="priority-icon priority-low" />;
//     }
//   };

//   const fetchTasks = useCallback(async () => {
//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       setLoading(false);
//       console.error("🚫 fetchTasks: Authentication token is missing.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const status = statusMap[activeSubTab];
//       let endpoint;
//       let res;
//       if (activeMainTab === "Assign Task") {
//         endpoint = `${BASE_URL}/get/assign/tasks?status=${status}`;
//         res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchTasks (Assign Task): Response:", {
//           endpoint,
//           status: res.status,
//           data: res.data,
//         });
//         const normalizedTasks = res.data.map((task) => ({
//           ...task,
//           taskId: task.taskId || task.id,
//           taskAssignmentId: task.taskAssignedId || task.taskAssignmentId,
//           status: task.taskStatus || task.status || "PENDING",
//           department: {
//             departmentId: task.department?.departmentId || null,
//             departmentName: task.department?.departmentName || "N/A",
//           },
//           assignees: task.assignees || [
//             {
//               assigneeId: userId,
//               assigneeType: role,
//               employeeName: task.assigneeName || "Current User",
//             },
//           ],
//         }));
//         setTasks(normalizedTasks);
//         setFilteredTasks(normalizedTasks);
//       } else if (activeMainTab === "Head Created Task") {
//         endpoint = `${BASE_URL}/get/head-created/tasks?status=${status}`;
//         res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchTasks (Head Created Task): Response:", {
//           endpoint,
//           status: res.status,
//           data: res.data,
//         });
//         const normalizedTasks = res.data.map((task) => ({
//           ...task,
//           status: task.taskStatus || task.status || "PENDING",
//           department: {
//             departmentId: task.department?.departmentId || null,
//             departmentName: task.department?.departmentName || "N/A",
//           },
//           assignees: task.assignees || [],
//         }));
//         setTasks(normalizedTasks);
//         setFilteredTasks(normalizedTasks);
//       } else {
//         endpoint = `${BASE_URL}/created/task?status=${status}`;
//         res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchTasks (Created Task): Response:", {
//           endpoint,
//           status: res.status,
//           data: res.data,
//         });
//         setTasks(res.data || []);
//         setFilteredTasks(res.data || []);
//       }
//     } catch (err) {
//       console.error("🚫 fetchTasks: Failed to fetch tasks:", {
//         error: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//       setError(
//         err.response?.data?.message ||
//           "Failed to fetch tasks. Please try again later."
//       );
//       setTasks([]);
//       setFilteredTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeMainTab, activeSubTab, token, userId, role]);

//   const fetchTaskById = useCallback(
//     async (taskId) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in.");
//         console.error("🚫 fetchTaskById: Authentication token is missing.");
//         return null;
//       }
//       try {
//         const endpoint = `${BASE_URL}/task/${taskId}`;
//         const res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchTaskById: Response:", {
//           endpoint,
//           taskId,
//           status: res.status,
//           data: res.data,
//         });
//         return res.data;
//       } catch (err) {
//         console.error("🚫 fetchTaskById: Failed to fetch task:", {
//           taskId,
//           error: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//         setError(
//           err.response?.data?.message || "Failed to fetch task details."
//         );
//         return null;
//       }
//     },
//     [token]
//   );

//   const fetchAssigneeDetails = useCallback(
//     async (taskId) => {
//       if (!token) {
//         setAssigneeError("Authentication token is missing. Please log in.");
//         setAssigneeLoading(false);
//         console.error(
//           "🚫 fetchAssigneeDetails: Authentication token is missing."
//         );
//         return;
//       }
//       setAssigneeLoading(true);
//       setAssigneeError(null);
//       try {
//         const status = statusMap[activeSubTab];
//         const endpoint = `${BASE_URL}/task/${taskId}/assign-info-list?status=${status}`;
//         const res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchAssigneeDetails: Response:", {
//           endpoint,
//           taskId,
//           status,
//           data: res.data,
//         });
//         setAssigneeData(res.data || []);
//       } catch (err) {
//         console.error(
//           "🚫 fetchAssigneeDetails: Failed to fetch assignee details:",
//           {
//             taskId,
//             error: err.message,
//             response: err.response?.data,
//             status: err.response?.status,
//           }
//         );
//         setAssigneeError(
//           err.response?.data?.message || "Failed to fetch assignee details."
//         );
//         setAssigneeData([]);
//       } finally {
//         setAssigneeLoading(false);
//       }
//     },
//     [token, activeSubTab]
//   );

//   const fetchEligibleAssignees = useCallback(
//     async (departmentId, taskId) => {
//       if (!token || !departmentId || !taskId) {
//         setEligibleAssigneesError(
//           "Authentication token, department ID, or task ID is missing."
//         );
//         setEligibleAssigneesLoading(false);
//         console.error("🚫 fetchEligibleAssignees: Missing parameters:", {
//           token: !!token,
//           departmentId,
//           taskId,
//         });
//         return;
//       }
//       setEligibleAssigneesLoading(true);
//       setEligibleAssigneesError(null);
//       try {
//         const endpoint = `${BASE_URL}/department/${departmentId}/task/${taskId}/reassigned/eligible/employees-head`;
//         const res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchEligibleAssignees: Response:", {
//           endpoint,
//           departmentId,
//           taskId,
//           status: res.status,
//           data: res.data,
//         });
//         setEligibleAssignees(res.data || []);
//       } catch (err) {
//         console.error(
//           "🚫 fetchEligibleAssignees: Failed to fetch eligible assignees:",
//           {
//             departmentId,
//             taskId,
//             error: err.message,
//             response: err.response?.data,
//             status: err.response?.status,
//           }
//         );
//         setEligibleAssigneesError(
//           err.response?.data?.message || "Failed to fetch eligible assignees."
//         );
//         setEligibleAssignees([]);
//       } finally {
//         setEligibleAssigneesLoading(false);
//       }
//     },
//     [token]
//   );

//   const fetchTaskAssignmentHistory = useCallback(
//     async (taskAssignmentId) => {
//       if (!token) {
//         setHistoryError("Authentication token is missing. Please log in.");
//         setHistoryLoading(false);
//         console.error(
//           "🚫 fetchTaskAssignmentHistory: Authentication token is missing."
//         );
//         return;
//       }
//       setHistoryLoading(true);
//       setHistoryError(null);
//       try {
//         const endpoint = `${BASE_URL}/task-assignment/${taskAssignmentId}/history`;
//         const res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchTaskAssignmentHistory: Response:", {
//           endpoint,
//           taskAssignmentId,
//           status: res.status,
//           data: res.data,
//         });
//         setHistoryData(res.data || []);
//       } catch (err) {
//         console.error(
//           "🚫 fetchTaskAssignmentHistory: Failed to fetch history:",
//           {
//             taskAssignmentId,
//             error: err.message,
//             response: err.response?.data,
//             status: err.response?.status,
//           }
//         );
//         setHistoryError(
//           err.response?.data?.message ||
//             "Failed to fetch task assignment history."
//         );
//         setHistoryData([]);
//       } finally {
//         setHistoryLoading(false);
//       }
//     },
//     [token]
//   );

//   const handleReassignTask = useCallback(
//     async (taskId, newAssignedId, newAssigneeType, replaceTaskAssignmentId) => {
//       if (!token) {
//         setAssigneeError("Authentication token is missing. Please log in.");
//         console.error(
//           "🚫 handleReassignTask: Authentication token is missing."
//         );
//         return;
//       }
//       if (!newAssignedId || !newAssigneeType || !replaceTaskAssignmentId) {
//         setAssigneeError("Missing required parameters for reassignment.");
//         console.error("🚫 handleReassignTask: Missing parameters:", {
//           taskId,
//           newAssignedId,
//           newAssigneeType,
//           replaceTaskAssignmentId,
//         });
//         alert("Cannot reassign task: Missing required parameters.");
//         return;
//       }
//       try {
//         const endpoint = `${BASE_URL}/task/${taskId}/reassign?newAssignedId=${newAssignedId}&newAssigneeType=${newAssigneeType}&replaceTaskAssignmentId=${replaceTaskAssignmentId}`;
//         const res = await axiosInstance.post(
//           endpoint,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         console.log("✅ handleReassignTask: Response:", {
//           endpoint,
//           taskId,
//           newAssignedId,
//           newAssigneeType,
//           replaceTaskAssignmentId,
//           status: res.status,
//           data: res.data,
//         });
//         await fetchAssigneeDetails(taskId);
//         await fetchTasks();
//         setShowEligibleAssigneesModal(false);
//         setSelectedAssigneeToReplace(null);
//         setEligibleAssignees([]);
//         setEligibleAssigneesError(null);
//         alert("Task reassigned successfully!");
//       } catch (err) {
//         console.error("🚫 handleReassignTask: Failed to reassign task:", {
//           taskId,
//           newAssignedId,
//           newAssigneeType,
//           replaceTaskAssignmentId,
//           error: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//         setAssigneeError(
//           err.response?.data?.message || "Failed to reassign task."
//         );
//         alert("Failed to reassign task. Please try again.");
//       }
//     },
//     [token, fetchAssigneeDetails, fetchTasks]
//   );

//   const fetchDepartments = useCallback(async () => {
//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       console.error("🚫 fetchDepartments: Authentication token is missing.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const endpoint = `${BASE_URL}/get-all-department`;
//       const res = await axiosInstance.get(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("✅ fetchDepartments: Response:", {
//         endpoint,
//         status: res.status,
//         data: res.data,
//       });
//       setDepartments(res.data || []);
//     } catch (err) {
//       console.error("🚫 fetchDepartments: Failed to fetch departments:", {
//         error: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//       setError(
//         err.response?.data?.message ||
//           "Failed to fetch departments. Please try again later."
//       );
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchEmployeesByDepartment = useCallback(
//     async (deptId) => {
//       if (!deptId || !token) {
//         console.error("🚫 fetchEmployeesByDepartment: Missing parameters:", {
//           deptId,
//           token: !!token,
//         });
//         setEmployees([]);
//         return;
//       }
//       try {
//         const endpoint = `${BASE_URL}/get/department/${deptId}/head-and-employee`;
//         const res = await axiosInstance.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ fetchEmployeesByDepartment: Response:", {
//           endpoint,
//           deptId,
//           status: res.status,
//           data: res.data,
//         });
//         const formattedEmployees = res.data.map((e) => ({
//           ...e,
//           employeeId: e.employeeId || e.id || e.userId,
//         }));
//         setEmployees(formattedEmployees);
//       } catch (err) {
//         console.error(
//           "🚫 fetchEmployeesByDepartment: Failed to fetch employees:",
//           {
//             deptId,
//             error: err.message,
//             response: err.response?.data,
//             status: err.response?.status,
//           }
//         );
//         setEmployees([]);
//       }
//     },
//     [token]
//   );

//   const updateAssigneeTask = useCallback(
//     async (taskAssignmentId) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in.");
//         alert("Authentication token is missing. Please log in.");
//         console.error(
//           "🚫 updateAssigneeTask: Authentication token is missing."
//         );
//         return;
//       }
//       if (
//         assigneeFormData.taskStatus === "COMPLETED" &&
//         !assigneeFormData.completedDate
//       ) {
//         setError("Completed date is required for Completed status.");
//         alert("Completed date is required for Completed status.");
//         console.error(
//           "🚫 updateAssigneeTask: Missing completed date for COMPLETED status."
//         );
//         return;
//       }
//       setLoading(true);
//       const payload = {
//         taskStatus: assigneeFormData.taskStatus,
//         delayReason: assigneeFormData.delayReason || "",
//         completedDate: assigneeFormData.completedDate || "",
//       };
//       try {
//         const endpoint = `${BASE_URL}/update/assign-task/${Number(
//           taskAssignmentId
//         )}`;
//         const res = await axiosInstance.put(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ updateAssigneeTask: Response:", {
//           endpoint,
//           taskAssignmentId,
//           payload,
//           status: res.status,
//           data: res.data,
//         });

//         // Validate response
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error(`Unexpected status code: ${res.status}`);
//         }
//         if (!res.data || !res.data.taskStatus) {
//           throw new Error("Invalid response data: missing taskStatus");
//         }

//         // Update tasks state
//         let taskUpdated = false;
//         setTasks((prev) => {
//           const updatedTasks = prev.map((task) => {
//             if (
//               task.taskAssignmentId &&
//               task.taskAssignmentId === Number(taskAssignmentId)
//             ) {
//               taskUpdated = true;
//               return {
//                 ...task,
//                 status: res.data.taskStatus,
//                 delayReason: res.data.delayReason || "",
//                 completedDate: res.data.completedDate || "",
//               };
//             }
//             return task;
//           });
//           if (!taskUpdated) {
//             console.warn(
//               "🚫 updateAssigneeTask: No task found with taskAssignmentId:",
//               taskAssignmentId
//             );
//           }
//           return updatedTasks;
//         });

//         // Refresh assignee details if selectedTask exists
//         if (selectedTask?.taskId) {
//           try {
//             await fetchAssigneeDetails(selectedTask.taskId);
//           } catch (fetchError) {
//             console.error(
//               "🚫 updateAssigneeTask: Failed to fetch assignee details:",
//               {
//                 taskId: selectedTask.taskId,
//                 error: fetchError.message,
//                 response: fetchError.response?.data,
//                 status: fetchError.response?.status,
//               }
//             );
//             // Don't throw; allow success alert since API update succeeded
//           }
//         } else {
//           console.warn(
//             "🚫 updateAssigneeTask: selectedTask or taskId is missing, skipping fetchAssigneeDetails"
//           );
//         }

//         // Show success alert
//         alert("Task status updated successfully!");
//       } catch (err) {
//         console.error("🚫 updateAssigneeTask: Failed to update task status:", {
//           taskAssignmentId,
//           payload,
//           error: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//           stack: err.stack,
//         });
//         setError(
//           err.response?.data?.message ||
//             `Failed to update task status: ${err.message}`
//         );
//         alert("Failed to update task status. Please try again.");
//       } finally {
//         setShowAssigneeEditModal(false);
//         setAssigneeFormData({
//           taskStatus: "PENDING",
//           delayReason: "",
//           completedDate: "",
//         });
//         setLoading(false);
//       }
//     },
//     [token, assigneeFormData, selectedTask, fetchAssigneeDetails]
//   );

//   const handleDeleteAssignee = useCallback(
//     async (taskAssignedId) => {
//       if (!token) {
//         setAssigneeError("Authentication token is missing. Please log in.");
//         console.error(
//           "🚫 handleDeleteAssignee: Authentication token is missing."
//         );
//         return;
//       }
//       if (!window.confirm("Are you sure you want to delete this assignee?"))
//         return;
//       try {
//         setAssigneeLoading(true);
//         const endpoint = `${BASE_URL}/delete/taskAssignId/${Number(
//           taskAssignedId
//         )}`;
//         const res = await axiosInstance.delete(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ handleDeleteAssignee: Response:", {
//           endpoint,
//           taskAssignedId,
//           status: res.status,
//           data: res.data,
//         });
//         setAssigneeData((prev) =>
//           prev.filter((a) => a.taskAssignedId !== Number(taskAssignedId))
//         );
//         await fetchTasks();
//         alert("Assignee deleted successfully!");
//       } catch (err) {
//         console.error("🚫 handleDeleteAssignee: Failed to delete assignee:", {
//           taskAssignedId,
//           error: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//         setAssigneeError(
//           err.response?.data?.message || "Failed to delete assignee."
//         );
//         alert("Failed to delete assignee. Please try again.");
//       } finally {
//         setAssigneeLoading(false);
//       }
//     },
//     [token, fetchTasks]
//   );

//   const filterTasks = useCallback(() => {
//     let filtered = [...tasks];
//     if (searchTerm.trim() !== "") {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (task) =>
//           task.taskName?.toLowerCase().includes(lowerSearch) ||
//           task.taskDescription?.toLowerCase().includes(lowerSearch)
//       );
//     }
//     setFilteredTasks(filtered);
//   }, [tasks, searchTerm]);

//   const handleShowEligibleAssignees = useCallback(
//     async (task, assigneeToReplace = null) => {
//       setSelectedTask(task);
//       setSelectedAssigneeToReplace(assigneeToReplace);
//       await fetchEligibleAssignees(task.department?.departmentId, task.taskId);
//       setShowEligibleAssigneesModal(true);
//     },
//     [fetchEligibleAssignees]
//   );

//   const handleShowHistory = useCallback(
//     async (taskAssignedId) => {
//       await fetchTaskAssignmentHistory(taskAssignedId);
//       setShowHistoryModal(true);
//     },
//     [fetchTaskAssignmentHistory]
//   );

//   const handleCloseHistoryModal = useCallback(() => {
//     setShowHistoryModal(false);
//     setHistoryData([]);
//     setHistoryError(null);
//   }, []);

//   const handleCloseEligibleAssigneesModal = () => {
//     setShowEligibleAssigneesModal(false);
//     setEligibleAssignees([]);
//     setEligibleAssigneesError(null);
//     setSelectedTask(null);
//     setSelectedAssigneeToReplace(null);
//   };

//   const handleCloseAssigneeModal = () => {
//     setShowAssigneeModal(false);
//     setAssigneeData([]);
//     setAssigneeError(null);
//     setSelectedTask(null);
//     setSelectedAssigneeToReplace(null);
//   };

//   const handleEditAssigneeTask = (task) => {
//     setAssigneeFormData({
//       taskStatus: task.status || "PENDING",
//       delayReason: task.delayReason || "",
//       completedDate: task.completedDate || "",
//     });
//     setEditAssigneeTaskId(task.taskAssignedId || task.taskAssignmentId);
//     setShowAssigneeEditModal(true);
//   };

//   const handleAssigneeInputChange = (e) => {
//     const { name, value } = e.target;
//     setAssigneeFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCloseAssigneeEditModal = () => {
//     setShowAssigneeEditModal(false);
//     setAssigneeFormData({
//       taskStatus: "PENDING",
//       delayReason: "",
//       completedDate: "",
//     });
//     setEditAssigneeTaskId(null);
//     setError(null);
//   };

//   const handleMainTabChange = (tab) => {
//     setActiveMainTab(tab);
//     setActiveSubTab("All Tasks");
//   };

//   const handleSubTabChange = (tab) => {
//     setActiveSubTab(tab);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "departmentId") {
//       setFormData((prev) => ({ ...prev, departmentId: value, assignees: [] }));
//       fetchEmployeesByDepartment(value);
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAssigneeToggle = (employee, isChecked) => {
//     if (!employee.employeeId) return;
//     const uniqueId = `${employee.employeeId}-${employee.employeeType}`;
//     setFormData((prev) => ({
//       ...prev,
//       assignees: isChecked
//         ? [
//             ...prev.assignees,
//             {
//               assigneeId: uniqueId,
//               employeeId: employee.employeeId,
//               assigneeType: employee.employeeType,
//               employeeName: employee.employeeName,
//             },
//           ]
//         : prev.assignees.filter((a) => a.assigneeId !== uniqueId),
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       taskName: "",
//       taskDescription: "",
//       priority: "LOW",
//       dueDate: "",
//       departmentId: "",
//       assignees: [],
//     });
//     setEmployees([]);
//   };

//   const handleSaveTask = async () => {
//     setError(null);
//     if (
//       !formData.taskName.trim() ||
//       !formData.taskDescription.trim() ||
//       !formData.dueDate ||
//       !formData.departmentId ||
//       formData.assignees.length === 0
//     ) {
//       setError(
//         "Please fill in all required fields and select at least one assignee."
//       );
//       console.error(
//         "🚫 handleSaveTask: Form validation failed: Missing required fields",
//         {
//           formData,
//         }
//       );
//       return;
//     }
//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       console.error("🚫 handleSaveTask: Authentication token is missing.");
//       return;
//     }
//     const payload = {
//       taskName: formData.taskName,
//       taskDescription: formData.taskDescription,
//       priority: formData.priority.toUpperCase(),
//       dueDate: formData.dueDate,
//       departmentId: Number(formData.departmentId),
//       assignees: formData.assignees.map((a) => ({
//         assigneeId: Number(a.employeeId),
//         assigneeType: a.assigneeType,
//         employeeName: a.employeeName,
//       })),
//     };
//     try {
//       setLoading(true);
//       let res;
//       if (editMode) {
//         const endpoint = `${BASE_URL}/task/${editTaskId}`;
//         res = await axiosInstance.put(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ handleSaveTask (Update): Response:", {
//           endpoint,
//           editTaskId,
//           payload,
//           status: res.status,
//           data: res.data,
//         });
//         setTasks((prev) =>
//           prev.map((task) => (task.taskId === editTaskId ? res.data : task))
//         );
//         setFilteredTasks((prev) =>
//           prev.map((task) => (task.taskId === editTaskId ? res.data : task))
//         );
//       } else {
//         const endpoint = `${BASE_URL}/created/task`;
//         res = await axiosInstance.post(endpoint, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         console.log("✅ handleSaveTask (Create): Response:", {
//           endpoint,
//           payload,
//           status: res.status,
//           data: res.data,
//         });
//         if (activeSubTab === "All Tasks" || activeSubTab === "Pending") {
//           setTasks((prev) => [res.data, ...prev]);
//           setFilteredTasks((prev) => [res.data, ...prev]);
//         }
//       }
//       setShowForm(false);
//       resetForm();
//       setEditMode(false);
//       setEditTaskId(null);
//       alert("Task saved successfully!");
//     } catch (err) {
//       console.error("🚫 handleSaveTask: Failed to save task:", {
//         editMode,
//         editTaskId,
//         payload,
//         error: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//       setError(err.response?.data?.message || "Failed to save task.");
//       alert("Failed to save task. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditTask = async (task) => {
//     setLoading(true);
//     setError(null);
//     const taskData = await fetchTaskById(task.taskId);
//     if (taskData) {
//       setFormData({
//         taskName: taskData.taskName || "",
//         taskDescription: taskData.taskDescription || "",
//         priority: taskData.priority || "LOW",
//         dueDate: taskData.dueDate || "",
//         departmentId: taskData.department?.departmentId || "",
//         assignees: (taskData.assignees || []).map((a) => ({
//           assigneeId: `${a.assigneeId}-${a.assigneeType}`,
//           employeeId: a.assigneeId,
//           assigneeType: a.assigneeType,
//           employeeName: a.employeeName,
//         })),
//       });
//       setEditTaskId(task.taskId);
//       setEditMode(true);
//       setShowForm(true);
//       fetchEmployeesByDepartment(taskData.department?.departmentId);
//     }
//     setLoading(false);
//   };

//   const handleDeleteTask = async (taskId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;
//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       alert("Authentication token is missing. Please log in.");
//       console.error("🚫 handleDeleteTask: Authentication token is missing.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const endpoint = `${BASE_URL}/task/${taskId}`;
//       const res = await axiosInstance.delete(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("✅ handleDeleteTask: Response:", {
//         endpoint,
//         taskId,
//         status: res.status,
//         data: res.data,
//       });
//       setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
//       setFilteredTasks((prev) => prev.filter((task) => task.taskId !== taskId));
//       alert("Task deleted successfully!");
//     } catch (err) {
//       console.error("🚫 handleDeleteTask: Failed to delete task:", {
//         taskId,
//         error: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//       setError(err.response?.data?.message || "Failed to delete task.");
//       alert("Failed to delete task. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowAssignees = (taskId) => {
//     setSelectedTask(tasks.find((t) => t.taskId === taskId));
//     fetchAssigneeDetails(taskId);
//     setShowAssigneeModal(true);
//   };

//   let tabs = [];
//   if (role === "Admin") tabs = ["Created Task", "Head Created Task"];
//   else if (role === "Head") tabs = ["Created Task", "Assign Task"];
//   else if (role === "Employee") tabs = ["Assign Task"];

//   const getTaskStats = () => {
//     const total = filteredTasks.length;
//     const pending = filteredTasks.filter(
//       (task) => task.status === "PENDING"
//     ).length;
//     const inProgress = filteredTasks.filter(
//       (task) => task.status === "IN_PROGRESS"
//     ).length;
//     const completed = filteredTasks.filter(
//       (task) => task.status === "COMPLETED"
//     ).length;
//     return { total, pending, inProgress, completed };
//   };

//   const stats = getTaskStats();

//   // Pagination logic
//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   useEffect(() => {
//     fetchDepartments();
//     fetchTasks();
//   }, [fetchTasks, fetchDepartments]);

//   useEffect(() => {
//     filterTasks();
//     setCurrentPage(1); // Reset to first page when filtering
//   }, [filterTasks]);

//   return (
//     <div className="task-container">
//       <div className="task-wrapper">
//         <div className="task-header">
//           <div className="task-header-content">
//             <div className="task-header-main">
//               <div className="task-header-text">
//                 <h1 className="task-title">Task Management</h1>
//               </div>
//             </div>
//           </div>
//         </div>

//         {activeMainTab !== "Assign Task" &&
//           (role === "Admin" || role === "Head") && (
//             <div className="task-controls">
//               <div className="task-controls-left">
//                 <div
//                   className={`task-search-container ${
//                     isSearchFocused ? "task-search-focused" : ""
//                   }`}
//                 >
//                   <Search className="task-search-icon" />
//                   <input
//                     type="search"
//                     placeholder="Search tasks by name or description..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => setIsSearchFocused(true)}
//                     onBlur={() => setIsSearchFocused(false)}
//                     disabled={loading}
//                   />
//                   {searchTerm && (
//                     <button
//                       className="task-search-clear"
//                       onClick={() => setSearchTerm("")}
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>
//               <button
//                 className="task-create-btn"
//                 onClick={() => setShowForm(true)}
//                 disabled={loading}
//               >
//                 <Plus className="task-btn-icon" />
//                 <span>Create Task</span>
//               </button>
//             </div>
//           )}

//         <div className="task-tab-bar">
//           <div className="task-main-tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={`task-main-tab ${
//                   activeMainTab === tab ? "task-main-tab-active" : ""
//                 }`}
//                 onClick={() => handleMainTabChange(tab)}
//                 disabled={loading}
//                 aria-selected={activeMainTab === tab}
//                 role="tab"
//               >
//                 <span className="task-main-tab-text">{tab}</span>
//               </button>
//             ))}
//           </div>
//           <div className="task-sub-tabs">
//             {["All Tasks", "Pending", "In Progress", "Completed"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`task-sub-tab ${
//                   activeSubTab === tab ? "task-sub-tab-active" : ""
//                 }`}
//                 onClick={() => handleSubTabChange(tab)}
//                 disabled={loading}
//                 aria-selected={activeSubTab === tab}
//                 role="tab"
//               >
//                 {getStatusIcon(statusMap[tab])}
//                 <span>{tab}</span>
//                 {/* <span className="task-sub-tab-count">
//                   {tab === "All Tasks"
//                     ? stats.total
//                     : tab === "Pending"
//                     ? stats.pending
//                     : tab === "In Progress"
//                     ? stats.inProgress
//                     : stats.completed}
//                 </span> */}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading && (
//           <div className="task-loading-container">
//             <div className="task-loading-spinner"></div>
//             <p className="task-loading-message">Loading tasks...</p>
//           </div>
//         )}

//         <div className="task-table-container">
//           {!loading && currentTasks.length === 0 && (
//             <div className="task-no-tasks-container">
//               <div className="task-no-tasks-icon">
//                 <Target />
//               </div>
//               <h3 className="task-no-tasks-title">No tasks found</h3>
//               <p className="task-no-tasks-subtitle">
//                 {searchTerm
//                   ? "Try adjusting your search criteria"
//                   : "Create your first task to get started"}
//               </p>
//               {!searchTerm &&
//                 activeMainTab !== "Assign Task" &&
//                 (role === "Admin" || role === "Head") && (
//                   <button
//                     className="task-create-btn-secondary"
//                     onClick={() => setShowForm(true)}
//                   >
//                     <Plus className="task-btn-icon" />
//                     Create First Task
//                   </button>
//                 )}
//             </div>
//           )}

//           {currentTasks.length > 0 && (
//             <table className="task-table">
//               <thead>
//                 <tr>
//                   <th>Task Name</th>
//                   <th>Description</th>
//                   <th>Priority</th>
//                   <th>Due Date</th>
//                   <th>Department</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentTasks.map((task) => (
//                   <tr key={task.taskId || task.taskAssignmentId}>
//                     <td className="task-name">{task.taskName}</td>
//                     <td className="task-desc">{task.taskDescription}</td>
//                     <td>
//                       <div className="task-priority-badge">
//                         <span
//                           className={`task-priority task-${
//                             task.priority?.toLowerCase() || "low"
//                           }`}
//                         >
//                           {task.priority || "LOW"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>{task.dueDate}</td>
//                     <td>{task.department?.departmentName || "N/A"}</td>
//                     <td>
//                       <div className="task-table-actions">
//                         {activeMainTab === "Assign Task" &&
//                           (role === "Employee" || role === "Head") && (
//                             <button
//                               className="task-action-btn task-edit-btn task-table-action"
//                               onClick={() => handleEditAssigneeTask(task)}
//                               disabled={loading}
//                               title="Edit Task Status"
//                             >
//                               <Edit2 className="task-action-icon" />
//                               <span className="sr-only">Update Status</span>
//                             </button>
//                           )}
//                         {activeMainTab !== "Assign Task" &&
//                           (role === "Admin" || role === "Head") && (
//                             <>
//                               <button
//                                 className="task-action-btn task-edit-btn task-table-action"
//                                 onClick={() => handleEditTask(task)}
//                                 disabled={loading}
//                                 title="Edit Task"
//                               >
//                                 <Edit2 className="task-action-icon" />
//                               </button>
//                               <button
//                                 className="task-action-btn task-delete-btn task-table-action"
//                                 onClick={() => handleDeleteTask(task.taskId)}
//                                 disabled={loading}
//                                 title="Delete Task"
//                               >
//                                 <Trash2 className="task-action-icon" />
//                               </button>
//                             </>
//                           )}
//                         {!(
//                           activeMainTab === "Assign Task" &&
//                           (role === "Head" || role === "Employee")
//                         ) && (
//                           <button
//                             className="task-action-btn task-view-btn task-table-action"
//                             onClick={() => handleShowAssignees(task.taskId)}
//                             disabled={loading}
//                             title="View Assignees"
//                           >
//                             <Eye className="task-action-icon" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {totalPages > 1 && (
//             <div className="task-pagination">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (number) => (
//                   <button
//                     key={number}
//                     className={`task-page-btn ${
//                       currentPage === number ? "task-page-btn-active" : ""
//                     }`}
//                     onClick={() => paginate(number)}
//                     disabled={loading}
//                   >
//                     {number}
//                   </button>
//                 )
//               )}
//             </div>
//           )}
//         </div>

//         {showForm &&
//           activeMainTab !== "Assign Task" &&
//           (role === "Admin" || role === "Head") && (
//             <div className="task-modal">
//               <div
//                 className="task-modal-backdrop"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                   setEditMode(false);
//                   setEditTaskId(null);
//                 }}
//               />
//               <div className="task-modal-content">
//                 <div className="task-modal-header">
//                   <h2 className="task-modal-title">
//                     <Target className="task-modal-icon" />
//                     {editMode ? "Edit Task" : "Create New Task"}
//                   </h2>
//                   <button
//                     className="task-modal-close"
//                     onClick={() => {
//                       setShowForm(false);
//                       resetForm();
//                       setEditMode(false);
//                       setEditTaskId(null);
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//                 <div className="task-modal-body">
//                   <div className="task-form-grid">
//                     <div className="task-form-group task-form-full">
//                       <label className="task-form-label">
//                         <Target className="task-form-label-icon" />
//                         Task Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="taskName"
//                         placeholder="Enter a descriptive task name"
//                         value={formData.taskName}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-form-input"
//                       />
//                     </div>
//                     <div className="task-form-group task-form-full">
//                       <label className="task-form-label">
//                         <Edit2 className="task-form-label-icon" />
//                         Task Description *
//                       </label>
//                       <textarea
//                         name="taskDescription"
//                         placeholder="Provide detailed task description and requirements"
//                         value={formData.taskDescription}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-form-textarea"
//                         rows="4"
//                       />
//                     </div>
//                     <div className="task-form-group">
//                       <label className="task-form-label">
//                         <AlertCircle className="task-form-label-icon" />
//                         Priority *
//                       </label>
//                       <select
//                         name="priority"
//                         value={formData.priority}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-form-select"
//                       >
//                         <option value="HIGH">🔴 High Priority</option>
//                         <option value="MEDIUM">🟡 Medium Priority</option>
//                         <option value="LOW">🟢 Low Priority</option>
//                       </select>
//                     </div>
//                     <div className="task-form-group">
//                       <label className="task-form-label">
//                         <Calendar className="task-form-label-icon" />
//                         Due Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="dueDate"
//                         value={formData.dueDate}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-form-input"
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                     </div>
//                     <div className="task-form-group task-form-full">
//                       <label className="task-form-label">
//                         <Building2 className="task-form-label-icon" />
//                         Department *
//                       </label>
//                       <select
//                         name="departmentId"
//                         value={formData.departmentId}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-form-select"
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map((dept, index) => (
//                           <option
//                             key={dept.departmentId || `dept-${index}`}
//                             value={dept.departmentId}
//                           >
//                             {dept.departmentName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     {employees.length > 0 && (
//                       <div className="task-form-group task-form-full">
//                         <label className="task-form-label">
//                           <Users className="task-form-label-icon" />
//                           Assignees * ({formData.assignees.length} selected)
//                         </label>
//                         <div className="task-employee-list">
//                           {employees.map((emp, index) => (
//                             <div
//                               key={emp.employeeId || `emp-${index}`}
//                               className="task-employee-item"
//                             >
//                               <label className="task-employee-label">
//                                 <input
//                                   type="checkbox"
//                                   checked={formData.assignees.some(
//                                     (a) =>
//                                       a.assigneeId ===
//                                       `${emp.employeeId}-${emp.employeeType}`
//                                   )}
//                                   onChange={(e) =>
//                                     handleAssigneeToggle(emp, e.target.checked)
//                                   }
//                                   disabled={loading}
//                                   className="task-employee-checkbox"
//                                 />
//                                 <div className="task-employee-info">
//                                   <span className="task-employee-name">
//                                     {emp.employeeName}
//                                   </span>
//                                   <span className="task-employee-type">
//                                     {emp.employeeType} • ID: {emp.employeeId}
//                                   </span>
//                                 </div>
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="task-modal-actions">
//                   <button
//                     className="task-modal-btn task-modal-btn-secondary"
//                     onClick={() => {
//                       setShowForm(false);
//                       resetForm();
//                       setEditMode(false);
//                       setEditTaskId(null);
//                     }}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="task-modal-btn task-modal-btn-primary"
//                     onClick={handleSaveTask}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="task-loading-spinner-small"></div>
//                         {editMode ? "Updating..." : "Creating..."}
//                       </>
//                     ) : (
//                       <>{editMode ? "Update Task" : "Create Task"}</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//         {showAssigneeModal && (
//           <div className="task-modal">
//             <div
//               className="task-modal-backdrop"
//               onClick={handleCloseAssigneeModal}
//             />
//             <div className="task-modal-content task-assignee-modal-content">
//               <div className="task-modal-header">
//                 <h2 className="task-modal-title">
//                   <Users className="task-modal-icon" />
//                   Task Assignees
//                 </h2>
//                 <button
//                   className="task-modal-close"
//                   onClick={handleCloseAssigneeModal}
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="task-modal-body">
//                 {assigneeLoading ? (
//                   <div className="task-loading-container">
//                     <div className="task-loading-spinner"></div>
//                     <p className="task-loading-message">
//                       Loading assignee details...
//                     </p>
//                   </div>
//                 ) : assigneeData.length === 0 ? (
//                   <div className="task-no-tasks-container">
//                     <div className="task-no-tasks-icon">
//                       <Users />
//                     </div>
//                     <h3 className="task-no-tasks-title">No assignees found</h3>
//                     <p className="task-no-tasks-subtitle">
//                       This task hasn't been assigned to anyone yet
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="task-assignee-table-container">
//                     <table className="task-assignee-table">
//                       <thead>
//                         <tr>
//                           <th>
//                             <User className="task-table-icon" />
//                             Name
//                           </th>
//                           <th>Type</th>
//                           <th>Email</th>
//                           <th>Status</th>
//                           <th>Assigned</th>
//                           <th>Completed</th>
//                           <th>Delay Reason</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {assigneeData.map((assignee) => {
//                           const isCompleted =
//                             assignee.taskStatus === "COMPLETED";
//                           return (
//                             <tr key={assignee.assigneeId}>
//                               <td className="task-assignee-name">
//                                 {assignee.userName}
//                               </td>
//                               <td>
//                                 <span className="task-assignee-type">
//                                   {assignee.assigneeType}
//                                 </span>
//                               </td>
//                               <td>{assignee.emailId}</td>
//                               <td>
//                                 <span
//                                   className={`task-status task-${
//                                     assignee.taskStatus
//                                       ?.replace(/\s/g, "")
//                                       .toLowerCase() || "pending"
//                                   }`}
//                                 >
//                                   {assignee.taskStatus || "PENDING"}
//                                 </span>
//                               </td>
//                               <td>{assignee.assignedDate || "N/A"}</td>
//                               <td>{assignee.completedDate || "N/A"}</td>
//                               <td>{assignee.delayReason || "N/A"}</td>
//                               <td>
//                                 <div className="task-table-actions">
//                                   <button
//                                     className="task-action-btn task-delete-btn task-table-action"
//                                     onClick={() =>
//                                       handleDeleteAssignee(
//                                         assignee.taskAssignedId
//                                       )
//                                     }
//                                     disabled={assigneeLoading}
//                                     title="Remove Assignee"
//                                   >
//                                     <Trash2 className="task-action-icon" />
//                                   </button>
//                                   <button
//                                     className="task-action-btn task-view-btn task-table-action"
//                                     onClick={() =>
//                                       handleShowEligibleAssignees(
//                                         selectedTask,
//                                         assignee
//                                       )
//                                     }
//                                     disabled={assigneeLoading || isCompleted}
//                                     title={
//                                       isCompleted
//                                         ? "Cannot reassign completed task"
//                                         : "Reassign Task"
//                                     }
//                                   >
//                                     {isCompleted ? (
//                                       <Ban className="task-action-icon task-block-icon" />
//                                     ) : (
//                                       <Users className="task-action-icon" />
//                                     )}
//                                     Reassign
//                                   </button>
//                                   {assignee.replacedTaskAssignmentId !==
//                                     null && (
//                                     <button
//                                       className="task-action-btn task-view-btn task-table-action"
//                                       onClick={() =>
//                                         handleShowHistory(
//                                           assignee.taskAssignedId
//                                         )
//                                       }
//                                       disabled={assigneeLoading}
//                                       title="Show History"
//                                     >
//                                       <CalendarDays className="task-action-icon" />
//                                       History
//                                     </button>
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//               <div className="task-modal-actions">
//                 <button
//                   className="task-modal-btn task-modal-btn-secondary"
//                   onClick={handleCloseAssigneeModal}
//                   disabled={assigneeLoading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showHistoryModal && (
//           <div className="task-modal">
//             <div
//               className="task-modal-backdrop"
//               onClick={handleCloseHistoryModal}
//             />
//             <div className="task-modal-content task-assignee-modal-content">
//               <div className="task-modal-header">
//                 <h2 className="task-modal-title">
//                   <CalendarDays className="task-modal-icon" />
//                   Task Assignment History
//                 </h2>
//                 <button
//                   className="task-modal-close"
//                   onClick={handleCloseHistoryModal}
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="task-modal-body">
//                 {historyLoading ? (
//                   <div className="task-loading-container">
//                     <div className="task-loading-spinner"></div>
//                     <p className="task-loading-message">Loading history...</p>
//                   </div>
//                 ) : historyData.length === 0 ? (
//                   <div className="task-no-tasks-container">
//                     <div className="task-no-tasks-icon">
//                       <CalendarDays />
//                     </div>
//                     <h3 className="task-no-tasks-title">No history found</h3>
//                     <p className="task-no-tasks-subtitle">
//                       No previous assignees found for this task assignment
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="task-assignee-table-container">
//                     <table className="task-assignee-table">
//                       <thead>
//                         <tr>
//                           <th>
//                             <User className="task-table-icon" />
//                             Name
//                           </th>
//                           <th>Type</th>
//                           <th>Email</th>
//                           <th>Status</th>
//                           <th>Assigned</th>
//                           <th>Completed</th>
//                           <th>Delay Reason</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {historyData.map((history, index) => (
//                           <tr key={history.assigneeId || `history-${index}`}>
//                             <td className="task-assignee-name">
//                               {history.userName || "N/A"}
//                             </td>
//                             <td>
//                               <span className="task-assignee-type">
//                                 {history.assigneeType || "N/A"}
//                               </span>
//                             </td>
//                             <td>{history.emailId || "N/A"}</td>
//                             <td>
//                               <div className="task-priority-badge">
//                                 <span
//                                   className={`task-status task-${history.taskStatus
//                                     ?.replace(/\s/g, "")
//                                     .toLowerCase()}`}
//                                 >
//                                   {history.taskStatus || "N/A"}
//                                 </span>
//                               </div>
//                             </td>
//                             <td>{history.assignedDate || "N/A"}</td>
//                             <td>{history.completedDate || "N/A"}</td>
//                             <td>{history.delayReason || "N/A"}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//               <div className="task-modal-actions">
//                 <button
//                   className="task-modal-btn task-modal-btn-secondary"
//                   onClick={handleCloseHistoryModal}
//                   disabled={historyLoading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showEligibleAssigneesModal && (
//           <div className="task-modal">
//             <div
//               className="task-modal-backdrop"
//               onClick={handleCloseEligibleAssigneesModal}
//             />
//             <div className="task-modal-content task-assignee-modal-content">
//               <div className="task-modal-header">
//                 <h2 className="task-modal-title">
//                   <Users className="task-modal-icon" />
//                   Eligible Assignees
//                 </h2>
//                 <button
//                   className="task-modal-close"
//                   onClick={handleCloseEligibleAssigneesModal}
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="task-modal-body">
//                 {eligibleAssigneesLoading ? (
//                   <div className="task-loading-container">
//                     <div className="task-loading-spinner"></div>
//                     <p className="task-loading-message">
//                       Loading eligible assignees...
//                     </p>
//                   </div>
//                 ) : eligibleAssignees.length === 0 ? (
//                   <div className="task-no-tasks-container">
//                     <div className="task-no-tasks-icon">
//                       <Users />
//                     </div>
//                     <h3 className="task-no-tasks-title">
//                       No eligible assignees found
//                     </h3>
//                     <p className="task-no-tasks-subtitle">
//                       No employees or heads are available for reassignment
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="task-assignee-table-container">
//                     <table className="task-assignee-table">
//                       <thead>
//                         <tr>
//                           <th>
//                             <User className="task-table-icon" />
//                             Name
//                           </th>
//                           <th>Type</th>
//                           <th>Email</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {eligibleAssignees.map((assignee, index) => {
//                           const assigneeId =
//                             assignee.employeeId ||
//                             assignee.id ||
//                             assignee.userId;
//                           return (
//                             <tr key={assigneeId || `assignee-${index}`}>
//                               <td className="task-assignee-name">
//                                 {assignee.employeeName}
//                               </td>
//                               <td>
//                                 <span className="task-assignee-type">
//                                   {assignee.employeeType}
//                                 </span>
//                               </td>
//                               <td>
//                                 {assignee.email || assignee.emailId || "N/A"}
//                               </td>
//                               <td>
//                                 <button
//                                   className="task-action-btn task-view-btn task-table-action"
//                                   onClick={() => {
//                                     if (!assigneeId) {
//                                       console.error(
//                                         "🚫 Reassign: Assignee ID is undefined:",
//                                         assignee
//                                       );
//                                       alert(
//                                         "Cannot reassign: Assignee ID is missing."
//                                       );
//                                       return;
//                                     }
//                                     if (!selectedAssigneeToReplace) {
//                                       console.error(
//                                         "🚫 Reassign: No assignee selected to replace"
//                                       );
//                                       alert(
//                                         "Please select an assignee to replace first."
//                                       );
//                                       return;
//                                     }
//                                     if (
//                                       window.confirm(
//                                         `Are you sure you want to reassign this task to ${assignee.employeeName}?`
//                                       )
//                                     ) {
//                                       handleReassignTask(
//                                         selectedTask.taskId,
//                                         assigneeId,
//                                         assignee.employeeType,
//                                         selectedAssigneeToReplace.taskAssignedId
//                                       );
//                                     }
//                                   }}
//                                   disabled={
//                                     eligibleAssigneesLoading ||
//                                     !selectedAssigneeToReplace
//                                   }
//                                   title="Reassign to this employee"
//                                 >
//                                   <Users className="task-action-icon" />
//                                   Reassign
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//               <div className="task-modal-actions">
//                 <button
//                   className="task-modal-btn task-modal-btn-secondary"
//                   onClick={handleCloseEligibleAssigneesModal}
//                   disabled={eligibleAssigneesLoading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showAssigneeEditModal && (
//           <div className="task-modal">
//             <div
//               className="task-modal-backdrop"
//               onClick={handleCloseAssigneeEditModal}
//             />
//             <div className="task-modal-content">
//               <div className="task-modal-header">
//                 <h2 className="task-modal-title">
//                   <Edit2 className="task-modal-icon" />
//                   Update Task Status
//                 </h2>
//                 <button
//                   className="task-modal-close"
//                   onClick={handleCloseAssigneeEditModal}
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="task-modal-body">
//                 <div className="task-form-grid">
//                   <div className="task-form-group task-form-full">
//                     <label className="task-form-label">
//                       {getStatusIcon(assigneeFormData.taskStatus)}Task Status *
//                     </label>
//                     <select
//                       name="taskStatus"
//                       value={assigneeFormData.taskStatus}
//                       onChange={handleAssigneeInputChange}
//                       disabled={loading}
//                       className="task-form-select"
//                     >
//                       <option value="PENDING">⏳ Pending</option>
//                       <option value="IN_PROGRESS">🔄 In Progress</option>
//                       <option value="COMPLETED">✅ Completed</option>
//                     </select>
//                   </div>
//                   <div className="task-form-group task-form-full">
//                     <label className="task-form-label">
//                       <AlertCircle className="task-form-label-icon" />
//                       Delay Reason (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       name="delayReason"
//                       placeholder="Explain any delays or issues"
//                       value={assigneeFormData.delayReason}
//                       onChange={handleAssigneeInputChange}
//                       disabled={loading}
//                       className="task-form-input"
//                     />
//                   </div>
//                   {assigneeFormData.taskStatus === "COMPLETED" && (
//                     <div className="task-form-group task-form-full">
//                       <label className="task-form-label">
//                         <CheckCircle className="task-form-label-icon" />
//                         Completed Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="completedDate"
//                         value={assigneeFormData.completedDate}
//                         onChange={handleAssigneeInputChange}
//                         disabled={loading}
//                         required
//                         className="task-form-input"
//                         max={new Date().toISOString().split("T")[0]}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="task-modal-actions">
//                 <button
//                   className="task-modal-btn task-modal-btn-secondary"
//                   onClick={handleCloseAssigneeEditModal}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="task-modal-btn task-modal-btn-primary"
//                   onClick={() => updateAssigneeTask(editAssigneeTaskId)}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="task-loading-spinner-small"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     <>Update Status</>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Task;

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./task.css";
import { BASE_URL } from "../../config";
import {
  CalendarDays,
  Edit2,
  Trash2,
  Search,
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  User,
  Building2,
  Calendar,
  Target,
  Ban,
} from "lucide-react";

const Task = () => {
  const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
  const token = userData?.token;
  const role =
    typeof userData?.role === "string"
      ? userData.role
      : userData?.role?.roleName || userData?.role?.[0]?.roleName || "Partner";
  const userId = userData?.id;

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState(
    role === "Employee" ? "My Task" : "Created Task"
  );
  const [activeSubTab, setActiveSubTab] = useState("All Tasks");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    taskDescription: "",
    priority: "LOW",
    dueDate: "",
    departmentId: "",
    assignees: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [assigneeData, setAssigneeData] = useState([]);
  const [assigneeLoading, setAssigneeLoading] = useState(false);
  const [assigneeError, setAssigneeError] = useState(null);
  const [showAssigneeEditModal, setShowAssigneeEditModal] = useState(false);
  const [editAssigneeTaskId, setEditAssigneeTaskId] = useState(null);
  const [assigneeFormData, setAssigneeFormData] = useState({
    taskStatus: "PENDING",
    delayReason: "",
    completedDate: "",
  });
  const [showEligibleAssigneesModal, setShowEligibleAssigneesModal] =
    useState(false);
  const [eligibleAssignees, setEligibleAssignees] = useState([]);
  const [eligibleAssigneesLoading, setEligibleAssigneesLoading] =
    useState(false);
  const [eligibleAssigneesError, setEligibleAssigneesError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAssigneeToReplace, setSelectedAssigneeToReplace] =
    useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const statusMap = {
    "All Tasks": "ALL",
    Pending: "PENDING",
    "In Progress": "IN_PROGRESS",
    Completed: "COMPLETED",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="status-icon" />;
      case "IN_PROGRESS":
        return <Clock className="status-icon" />;
      case "PENDING":
        return <AlertCircle className="status-icon" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return <Target className="priority-icon priority-high" />;
      case "MEDIUM":
        return <Target className="priority-icon priority-medium" />;
      case "LOW":
        return <Target className="priority-icon priority-low" />;
      default:
        return <Target className="priority-icon priority-low" />;
    }
  };

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      setLoading(false);
      console.error("🚫 fetchTasks: Authentication token is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const status = statusMap[activeSubTab];
      let endpoint;
      let res;
      if (activeMainTab === "My Task") {
        endpoint = `${BASE_URL}/get/assign/tasks?status=${status}`;
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks (My Task): Response:", {
          endpoint,
          status: res.status,
          data: res.data,
        });
        const normalizedTasks = res.data.map((task) => ({
          ...task,
          taskId: task.taskId || task.id,
          taskAssignmentId: task.taskAssignedId || task.taskAssignmentId,
          status: task.taskStatus || task.status || "PENDING",
          department: {
            departmentId: task.department?.departmentId || null,
            departmentName: task.department?.departmentName || "N/A",
          },
          assignees: task.assignees || [
            {
              assigneeId: userId,
              assigneeType: role,
              employeeName: task.assigneeName || "Current User",
            },
          ],
        }));
        setTasks(normalizedTasks);
        setFilteredTasks(normalizedTasks);
      } else if (activeMainTab === "Head Created Task") {
        endpoint = `${BASE_URL}/get/head-created/tasks?status=${status}`;
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks (Head Created Task): Response:", {
          endpoint,
          status: res.status,
          data: res.data,
        });
        const normalizedTasks = res.data.map((task) => ({
          ...task,
          status: task.taskStatus || task.status || "PENDING",
          department: {
            departmentId: task.department?.departmentId || null,
            departmentName: task.department?.departmentName || "N/A",
          },
          assignees: task.assignees || [],
        }));
        setTasks(normalizedTasks);
        setFilteredTasks(normalizedTasks);
      } else {
        endpoint = `${BASE_URL}/created/task?status=${status}`;
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks (Created Task): Response:", {
          endpoint,
          status: res.status,
          data: res.data,
        });
        setTasks(res.data || []);
        setFilteredTasks(res.data || []);
      }
    } catch (err) {
      console.error("🚫 fetchTasks: Failed to fetch tasks:", {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          "Failed to fetch tasks. Please try again later."
      );
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  }, [activeMainTab, activeSubTab, token, userId, role]);

  const fetchTaskById = useCallback(
    async (taskId) => {
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        console.error("🚫 fetchTaskById: Authentication token is missing.");
        return null;
      }
      try {
        const endpoint = `${BASE_URL}/task/${taskId}`;
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTaskById: Response:", {
          endpoint,
          taskId,
          status: res.status,
          data: res.data,
        });
        return res.data;
      } catch (err) {
        console.error("🚫 fetchTaskById: Failed to fetch task:", {
          taskId,
          error: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(
          err.response?.data?.message || "Failed to fetch task details."
        );
        return null;
      }
    },
    [token]
  );

  const fetchAssigneeDetails = useCallback(
    async (taskId) => {
      if (!token) {
        setAssigneeError("Authentication token is missing. Please log in.");
        setAssigneeLoading(false);
        console.error(
          "🚫 fetchAssigneeDetails: Authentication token is missing."
        );
        return;
      }
      setAssigneeLoading(true);
      setAssigneeError(null);
      try {
        const status = statusMap[activeSubTab];
        const endpoint = `${BASE_URL}/task/${taskId}/assign-info-list?status=${status}`;
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchAssigneeDetails: Response:", {
          endpoint,
          taskId,
          status,
          data: res.data,
        });
        setAssigneeData(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchAssigneeDetails: Failed to fetch assignee details:",
          {
            taskId,
            error: err.message,
            response: err.response?.data,
            status: err.response?.status,
          }
        );
        setAssigneeError(
          err.response?.data?.message || "Failed to fetch assignee details."
        );
        setAssigneeData([]);
      } finally {
        setAssigneeLoading(false);
      }
    },
    [token, activeSubTab]
  );

  const fetchEligibleAssignees = useCallback(
    async (departmentId, taskId) => {
      if (!token || !departmentId || !taskId) {
        setEligibleAssigneesError(
          "Authentication token, department ID, or task ID is missing."
        );
        setEligibleAssigneesLoading(false);
        console.error("🚫 fetchEligibleAssignees: Missing parameters:", {
          token: !!token,
          departmentId,
          taskId,
        });
        return;
      }
      setEligibleAssigneesLoading(true);
      setEligibleAssigneesError(null);
      try {
        const endpoint = `${BASE_URL}/department/${departmentId}/task/${taskId}/reassigned/eligible/employees-head`;
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchEligibleAssignees: Response:", {
          endpoint,
          departmentId,
          taskId,
          status: res.status,
          data: res.data,
        });
        setEligibleAssignees(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchEligibleAssignees: Failed to fetch eligible assignees:",
          {
            departmentId,
            taskId,
            error: err.message,
            response: err.response?.data,
            status: err.response?.status,
          }
        );
        setEligibleAssigneesError(
          err.response?.data?.message || "Failed to fetch eligible assignees."
        );
        setEligibleAssignees([]);
      } finally {
        setEligibleAssigneesLoading(false);
      }
    },
    [token]
  );

  const fetchTaskAssignmentHistory = useCallback(
    async (taskAssignmentId) => {
      if (!token) {
        setHistoryError("Authentication token is missing. Please log in.");
        setHistoryLoading(false);
        console.error(
          "🚫 fetchTaskAssignmentHistory: Authentication token is missing."
        );
        return;
      }
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const endpoint = `${BASE_URL}/task-assignment/${taskAssignmentId}/history`;
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTaskAssignmentHistory: Response:", {
          endpoint,
          taskAssignmentId,
          status: res.status,
          data: res.data,
        });
        setHistoryData(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchTaskAssignmentHistory: Failed to fetch history:",
          {
            taskAssignmentId,
            error: err.message,
            response: err.response?.data,
            status: err.response?.status,
          }
        );
        setHistoryError(
          err.response?.data?.message ||
            "Failed to fetch task assignment history."
        );
        setHistoryData([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [token]
  );

  const handleReassignTask = useCallback(
    async (taskId, newAssignedId, newAssigneeType, replaceTaskAssignmentId) => {
      if (!token) {
        setAssigneeError("Authentication token is missing. Please log in.");
        console.error(
          "🚫 handleReassignTask: Authentication token is missing."
        );
        return;
      }
      if (!newAssignedId || !newAssigneeType || !replaceTaskAssignmentId) {
        setAssigneeError("Missing required parameters for reassignment.");
        console.error("🚫 handleReassignTask: Missing parameters:", {
          taskId,
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
        });
        alert("Cannot reassign task: Missing required parameters.");
        return;
      }
      try {
        const endpoint = `${BASE_URL}/task/${taskId}/reassign?newAssignedId=${newAssignedId}&newAssigneeType=${newAssigneeType}&replaceTaskAssignmentId=${replaceTaskAssignmentId}`;
        const res = await axiosInstance.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ handleReassignTask: Response:", {
          endpoint,
          taskId,
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
          status: res.status,
          data: res.data,
        });
        await fetchAssigneeDetails(taskId);
        await fetchTasks();
        setShowEligibleAssigneesModal(false);
        setSelectedAssigneeToReplace(null);
        setEligibleAssignees([]);
        setEligibleAssigneesError(null);
        alert("Task reassigned successfully!");
      } catch (err) {
        console.error("🚫 handleReassignTask: Failed to reassign task:", {
          taskId,
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
          error: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setAssigneeError(
          err.response?.data?.message || "Failed to reassign task."
        );
        alert("Failed to reassign task. Please try again.");
      }
    },
    [token, fetchAssigneeDetails, fetchTasks]
  );

  const fetchDepartments = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      console.error("🚫 fetchDepartments: Authentication token is missing.");
      return;
    }
    try {
      setLoading(true);
      const endpoint = `${BASE_URL}/get-all-department`;
      const res = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ fetchDepartments: Response:", {
        endpoint,
        status: res.status,
        data: res.data,
      });
      setDepartments(res.data || []);
    } catch (err) {
      console.error("🚫 fetchDepartments: Failed to fetch departments:", {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          "Failed to fetch departments. Please try again later."
      );
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchEmployeesByDepartment = useCallback(
    async (deptId) => {
      if (!deptId || !token) {
        console.error("🚫 fetchEmployeesByDepartment: Missing parameters:", {
          deptId,
          token: !!token,
        });
        setEmployees([]);
        return;
      }
      try {
        const endpoint = `${BASE_URL}/get/department/${deptId}/head-and-employee`;
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchEmployeesByDepartment: Response:", {
          endpoint,
          deptId,
          status: res.status,
          data: res.data,
        });
        const formattedEmployees = res.data.map((e) => ({
          ...e,
          employeeId: e.employeeId || e.id || e.userId,
        }));
        setEmployees(formattedEmployees);
      } catch (err) {
        console.error(
          "🚫 fetchEmployeesByDepartment: Failed to fetch employees:",
          {
            deptId,
            error: err.message,
            response: err.response?.data,
            status: err.response?.status,
          }
        );
        setEmployees([]);
      }
    },
    [token]
  );

  const updateAssigneeTask = useCallback(
    async (taskAssignmentId) => {
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        alert("Authentication token is missing. Please log in.");
        console.error(
          "🚫 updateAssigneeTask: Authentication token is missing."
        );
        return;
      }
      if (
        assigneeFormData.taskStatus === "COMPLETED" &&
        !assigneeFormData.completedDate
      ) {
        setError("Completed date is required for Completed status.");
        alert("Completed date is required for Completed status.");
        console.error(
          "🚫 updateAssigneeTask: Missing completed date for COMPLETED status."
        );
        return;
      }
      setLoading(true);
      const payload = {
        taskStatus: assigneeFormData.taskStatus,
        delayReason: assigneeFormData.delayReason || "",
        completedDate: assigneeFormData.completedDate || "",
      };
      try {
        const endpoint = `${BASE_URL}/update/assign-task/${Number(
          taskAssignmentId
        )}`;
        const res = await axiosInstance.put(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ updateAssigneeTask: Response:", {
          endpoint,
          taskAssignmentId,
          payload,
          status: res.status,
          data: res.data,
        });

        // Validate response
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(`Unexpected status code: ${res.status}`);
        }
        if (!res.data || !res.data.taskStatus) {
          throw new Error("Invalid response data: missing taskStatus");
        }

        // Update tasks state
        let taskUpdated = false;
        setTasks((prev) => {
          const updatedTasks = prev.map((task) => {
            if (
              task.taskAssignmentId &&
              task.taskAssignmentId === Number(taskAssignmentId)
            ) {
              taskUpdated = true;
              return {
                ...task,
                status: res.data.taskStatus,
                delayReason: res.data.delayReason || "",
                completedDate: res.data.completedDate || "",
              };
            }
            return task;
          });
          if (!taskUpdated) {
            console.warn(
              "🚫 updateAssigneeTask: No task found with taskAssignmentId:",
              taskAssignmentId
            );
          }
          return updatedTasks;
        });

        // Refresh assignee details if selectedTask exists
        if (selectedTask?.taskId) {
          try {
            await fetchAssigneeDetails(selectedTask.taskId);
          } catch (fetchError) {
            console.error(
              "🚫 updateAssigneeTask: Failed to fetch assignee details:",
              {
                taskId: selectedTask.taskId,
                error: fetchError.message,
                response: fetchError.response?.data,
                status: fetchError.response?.status,
              }
            );
            // Don't throw; allow success alert since API update succeeded
          }
        } else {
          console.warn(
            "🚫 updateAssigneeTask: selectedTask or taskId is missing, skipping fetchAssigneeDetails"
          );
        }

        // Show success alert
        alert("Task status updated successfully!");
      } catch (err) {
        console.error("🚫 updateAssigneeTask: Failed to update task status:", {
          taskAssignmentId,
          payload,
          error: err.message,
          response: err.response?.data,
          status: err.response?.status,
          stack: err.stack,
        });
        setError(
          err.response?.data?.message ||
            `Failed to update task status: ${err.message}`
        );
        alert("Failed to update task status. Please try again.");
      } finally {
        setShowAssigneeEditModal(false);
        setAssigneeFormData({
          taskStatus: "PENDING",
          delayReason: "",
          completedDate: "",
        });
        setLoading(false);
      }
    },
    [token, assigneeFormData, selectedTask, fetchAssigneeDetails]
  );

  const handleDeleteAssignee = useCallback(
    async (taskAssignedId) => {
      if (!token) {
        setAssigneeError("Authentication token is missing. Please log in.");
        console.error(
          "🚫 handleDeleteAssignee: Authentication token is missing."
        );
        return;
      }
      if (!window.confirm("Are you sure you want to delete this assignee?"))
        return;
      try {
        setAssigneeLoading(true);
        const endpoint = `${BASE_URL}/delete/taskAssignId/${Number(
          taskAssignedId
        )}`;
        const res = await axiosInstance.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ handleDeleteAssignee: Response:", {
          endpoint,
          taskAssignedId,
          status: res.status,
          data: res.data,
        });
        setAssigneeData((prev) =>
          prev.filter((a) => a.taskAssignedId !== Number(taskAssignedId))
        );
        await fetchTasks();
        alert("Assignee deleted successfully!");
      } catch (err) {
        console.error("🚫 handleDeleteAssignee: Failed to delete assignee:", {
          taskAssignedId,
          error: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setAssigneeError(
          err.response?.data?.message || "Failed to delete assignee."
        );
        alert("Failed to delete assignee. Please try again.");
      } finally {
        setAssigneeLoading(false);
      }
    },
    [token, fetchTasks]
  );

  const filterTasks = useCallback(() => {
    let filtered = [...tasks];
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.taskName?.toLowerCase().includes(lowerSearch) ||
          task.taskDescription?.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  const handleShowEligibleAssignees = useCallback(
    async (task, assigneeToReplace = null) => {
      setSelectedTask(task);
      setSelectedAssigneeToReplace(assigneeToReplace);
      await fetchEligibleAssignees(task.department?.departmentId, task.taskId);
      setShowEligibleAssigneesModal(true);
    },
    [fetchEligibleAssignees]
  );

  const handleShowHistory = useCallback(
    async (taskAssignedId) => {
      await fetchTaskAssignmentHistory(taskAssignedId);
      setShowHistoryModal(true);
    },
    [fetchTaskAssignmentHistory]
  );

  const handleCloseHistoryModal = useCallback(() => {
    setShowHistoryModal(false);
    setHistoryData([]);
    setHistoryError(null);
  }, []);

  const handleCloseEligibleAssigneesModal = () => {
    setShowEligibleAssigneesModal(false);
    setEligibleAssignees([]);
    setEligibleAssigneesError(null);
    setSelectedTask(null);
    setSelectedAssigneeToReplace(null);
  };

  const handleCloseAssigneeModal = () => {
    setShowAssigneeModal(false);
    setAssigneeData([]);
    setAssigneeError(null);
    setSelectedTask(null);
    setSelectedAssigneeToReplace(null);
  };

  const handleEditAssigneeTask = (task) => {
    setAssigneeFormData({
      taskStatus: task.status || "PENDING",
      delayReason: task.delayReason || "",
      completedDate: task.completedDate || "",
    });
    setEditAssigneeTaskId(task.taskAssignedId || task.taskAssignmentId);
    setShowAssigneeEditModal(true);
  };

  const handleAssigneeInputChange = (e) => {
    const { name, value } = e.target;
    setAssigneeFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseAssigneeEditModal = () => {
    setShowAssigneeEditModal(false);
    setAssigneeFormData({
      taskStatus: "PENDING",
      delayReason: "",
      completedDate: "",
    });
    setEditAssigneeTaskId(null);
    setError(null);
  };

  const handleMainTabChange = (tab) => {
    setActiveMainTab(tab);
    setActiveSubTab("All Tasks");
  };

  const handleSubTabChange = (tab) => {
    setActiveSubTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      setFormData((prev) => ({ ...prev, departmentId: value, assignees: [] }));
      fetchEmployeesByDepartment(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAssigneeToggle = (employee, isChecked) => {
    if (!employee.employeeId) return;
    const uniqueId = `${employee.employeeId}-${employee.employeeType}`;
    setFormData((prev) => ({
      ...prev,
      assignees: isChecked
        ? [
            ...prev.assignees,
            {
              assigneeId: uniqueId,
              employeeId: employee.employeeId,
              assigneeType: employee.employeeType,
              employeeName: employee.employeeName,
            },
          ]
        : prev.assignees.filter((a) => a.assigneeId !== uniqueId),
    }));
  };

  const resetForm = () => {
    setFormData({
      taskName: "",
      taskDescription: "",
      priority: "LOW",
      dueDate: "",
      departmentId: "",
      assignees: [],
    });
    setEmployees([]);
  };

  const handleSaveTask = async () => {
    setError(null);
    if (
      !formData.taskName.trim() ||
      !formData.taskDescription.trim() ||
      !formData.dueDate ||
      (!editMode && (!formData.departmentId || formData.assignees.length === 0))
    ) {
      setError(
        `Please fill in all required fields${
          editMode ? "" : " and select at least one assignee."
        }`
      );
      console.error(
        "🚫 handleSaveTask: Form validation failed: Missing required fields",
        {
          formData,
          editMode,
        }
      );
      return;
    }
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      console.error("🚫 handleSaveTask: Authentication token is missing.");
      return;
    }
    const payload = editMode
      ? {
          taskName: formData.taskName,
          taskDescription: formData.taskDescription,
          priority: formData.priority.toUpperCase(),
          dueDate: formData.dueDate,
        }
      : {
          taskName: formData.taskName,
          taskDescription: formData.taskDescription,
          priority: formData.priority.toUpperCase(),
          dueDate: formData.dueDate,
          departmentId: Number(formData.departmentId),
          assignees: formData.assignees.map((a) => ({
            assigneeId: Number(a.employeeId),
            assigneeType: a.assigneeType,
            employeeName: a.employeeName,
          })),
        };
    try {
      setLoading(true);
      let res;
      if (editMode) {
        const endpoint = `${BASE_URL}/task/${editTaskId}`;
        res = await axiosInstance.put(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ handleSaveTask (Update): Response:", {
          endpoint,
          editTaskId,
          payload,
          status: res.status,
          data: res.data,
        });
        setTasks((prev) =>
          prev.map((task) =>
            task.taskId === editTaskId ? { ...task, ...res.data } : task
          )
        );
        setFilteredTasks((prev) =>
          prev.map((task) =>
            task.taskId === editTaskId ? { ...task, ...res.data } : task
          )
        );
      } else {
        const endpoint = `${BASE_URL}/created/task`;
        res = await axiosInstance.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ handleSaveTask (Create): Response:", {
          endpoint,
          payload,
          status: res.status,
          data: res.data,
        });
        if (activeSubTab === "All Tasks" || activeSubTab === "Pending") {
          setTasks((prev) => [res.data, ...prev]);
          setFilteredTasks((prev) => [res.data, ...prev]);
        }
      }
      setShowForm(false);
      resetForm();
      setEditMode(false);
      setEditTaskId(null);
      alert("Task saved successfully!");
    } catch (err) {
      console.error("🚫 handleSaveTask: Failed to save task:", {
        editMode,
        editTaskId,
        payload,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || "Failed to save task.");
      alert("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (task) => {
    setLoading(true);
    setError(null);
    const taskData = await fetchTaskById(task.taskId);
    if (taskData) {
      setFormData({
        taskName: taskData.taskName || "",
        taskDescription: taskData.taskDescription || "",
        priority: taskData.priority || "LOW",
        dueDate: taskData.dueDate || "",
        departmentId: taskData.department?.departmentId || "",
        assignees: (taskData.assignees || []).map((a) => ({
          assigneeId: `${a.assigneeId}-${a.assigneeType}`,
          employeeId: a.assigneeId,
          assigneeType: a.assigneeType,
          employeeName: a.employeeName,
        })),
      });
      setEditTaskId(task.taskId);
      setEditMode(true);
      setShowForm(true);
      if (!editMode) {
        fetchEmployeesByDepartment(taskData.department?.departmentId);
      }
    }
    setLoading(false);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      alert("Authentication token is missing. Please log in.");
      console.error("🚫 handleDeleteTask: Authentication token is missing.");
      return;
    }
    try {
      setLoading(true);
      const endpoint = `${BASE_URL}/task/${taskId}`;
      const res = await axiosInstance.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ handleDeleteTask: Response:", {
        endpoint,
        taskId,
        status: res.status,
        data: res.data,
      });
      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      setFilteredTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error("🚫 handleDeleteTask: Failed to delete task:", {
        taskId,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || "Failed to delete task.");
      alert("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAssignees = (taskId) => {
    setSelectedTask(tasks.find((t) => t.taskId === taskId));
    fetchAssigneeDetails(taskId);
    setShowAssigneeModal(true);
  };

  let tabs = [];
  if (role === "Admin") tabs = ["Created Task", "Head Created Task"];
  else if (role === "Head") tabs = ["Created Task", "My Task"];
  else if (role === "Employee") tabs = ["My Task"];

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const pending = filteredTasks.filter(
      (task) => task.status === "PENDING"
    ).length;
    const inProgress = filteredTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    const completed = filteredTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
    return { total, pending, inProgress, completed };
  };

  const stats = getTaskStats();

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchDepartments();
    fetchTasks();
  }, [fetchTasks, fetchDepartments]);

  useEffect(() => {
    filterTasks();
    setCurrentPage(1); // Reset to first page when filtering
  }, [filterTasks]);

  return (
    <div className="task-container">
      <div className="task-wrapper">
        <div className="task-header">
          <div className="task-header-content">
            <div className="task-header-main">
              <div className="task-header-text">
                <h1 className="task-title">Task Management</h1>
              </div>
            </div>
          </div>
        </div>

        {activeMainTab !== "My Task" &&
          (role === "Admin" || role === "Head") && (
            <div className="task-controls">
              <div className="task-controls-left">
                <div
                  className={`task-search-container ${
                    isSearchFocused ? "task-search-focused" : ""
                  }`}
                >
                  <Search className="task-search-icon" />
                  <input
                    type="search"
                    placeholder="Search tasks by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    disabled={loading}
                  />
                  {searchTerm && (
                    <button
                      className="task-search-clear"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <button
                className="task-create-btn"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                <Plus className="task-btn-icon" />
                <span>Create Task</span>
              </button>
            </div>
          )}

        <div className="task-tab-bar">
          <div className="task-main-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`task-main-tab ${
                  activeMainTab === tab ? "task-main-tab-active" : ""
                }`}
                onClick={() => handleMainTabChange(tab)}
                disabled={loading}
                aria-selected={activeMainTab === tab}
                role="tab"
              >
                <span className="task-main-tab-text">{tab}</span>
              </button>
            ))}
          </div>
          <div className="task-sub-tabs">
            {["All Tasks", "Pending", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`task-sub-tab ${
                  activeSubTab === tab ? "task-sub-tab-active" : ""
                }`}
                onClick={() => handleSubTabChange(tab)}
                disabled={loading}
                aria-selected={activeSubTab === tab}
                role="tab"
              >
                {getStatusIcon(statusMap[tab])}
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="task-loading-container">
            <div className="task-loading-spinner"></div>
            <p className="task-loading-message">Loading tasks...</p>
          </div>
        )}

        <div className="task-table-container">
          {!loading && currentTasks.length === 0 && (
            <div className="task-no-tasks-container">
              <div className="task-no-tasks-icon">
                <Target />
              </div>
              <h3 className="task-no-tasks-title">No tasks found</h3>
              <p className="task-no-tasks-subtitle">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create your first task to get started"}
              </p>
              {!searchTerm &&
                activeMainTab !== "My Task" &&
                (role === "Admin" || role === "Head") && (
                  <button
                    className="task-create-btn-secondary"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="task-btn-icon" />
                    Create First Task
                  </button>
                )}
            </div>
          )}

          {currentTasks.length > 0 && (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  {activeMainTab === "Created Task" && <th>Department</th>}
                  {role === "Admin" &&
                    activeMainTab === "Head Created Task" && <th>Head Name</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.taskId || task.taskAssignmentId}>
                    <td className="task-name">{task.taskName}</td>
                    <td className="task-desc">{task.taskDescription}</td>
                    <td>
                      <div className="task-priority-badge">
                        <span
                          className={`task-priority task-${
                            task.priority?.toLowerCase() || "low"
                          }`}
                        >
                          {task.priority || "LOW"}
                        </span>
                      </div>
                    </td>
                    <td>{task.dueDate}</td>
                    {activeMainTab === "Created Task" && (
                      <td>{task.department?.departmentName || "N/A"}</td>
                    )}
                    {role === "Admin" &&
                      activeMainTab === "Head Created Task" && (
                        <td>{task.headName || "N/A"}</td>
                      )}
                    <td>
                      <div className="task-table-actions">
                        {activeMainTab === "My Task" &&
                          (role === "Employee" || role === "Head") && (
                            <button
                              className="task-action-btn task-edit-btn task-table-action"
                              onClick={() => handleEditAssigneeTask(task)}
                              disabled={loading}
                              title="Update Status"
                            >
                              <Edit2 className="task-action-icon" />
                              <span className="sr-only">Update Status</span>
                            </button>
                          )}
                        {activeMainTab !== "My Task" &&
                          (role === "Head" ||
                            (role === "Admin" &&
                              activeMainTab !== "Head Created Task")) && (
                            <>
                              <button
                                className="task-action-btn task-edit-btn task-table-action"
                                onClick={() => handleEditTask(task)}
                                disabled={loading}
                                title="Edit Task"
                              >
                                <Edit2 className="task-action-icon" />
                              </button>
                              <button
                                className="task-action-btn task-delete-btn task-table-action"
                                onClick={() => handleDeleteTask(task.taskId)}
                                disabled={loading}
                                title="Delete Task"
                              >
                                <Trash2 className="task-action-icon" />
                              </button>
                            </>
                          )}
                        {(activeMainTab !== "My Task" || role === "Admin") && (
                          <button
                            className="task-action-btn task-view-btn task-table-action"
                            onClick={() => handleShowAssignees(task.taskId)}
                            disabled={loading}
                            title="View Assignees"
                          >
                            <Eye className="task-action-icon" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="task-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    className={`task-page-btn ${
                      currentPage === number ? "task-page-btn-active" : ""
                    }`}
                    onClick={() => paginate(number)}
                    disabled={loading}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {showForm &&
          activeMainTab !== "My Task" &&
          (role === "Admin" || role === "Head") && (
            <div className="task-modal">
              <div
                className="task-modal-backdrop"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditMode(false);
                  setEditTaskId(null);
                }}
              />
              <div className="task-modal-content">
                <div className="task-modal-header">
                  <h2 className="task-modal-title">
                    <Target className="task-modal-icon" />
                    {editMode ? "Edit Task" : "Create New Task"}
                  </h2>
                  <button
                    className="task-modal-close"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                      setEditMode(false);
                      setEditTaskId(null);
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="task-modal-body">
                  <div className="task-form-grid">
                    <div className="task-form-group task-form-full">
                      <label className="task-form-label">
                        <Target className="task-form-label-icon" />
                        Task Name *
                      </label>
                      <input
                        type="text"
                        name="taskName"
                        placeholder="Enter a descriptive task name"
                        value={formData.taskName}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-form-input"
                      />
                    </div>
                    <div className="task-form-group task-form-full">
                      <label className="task-form-label">
                        <Edit2 className="task-form-label-icon" />
                        Task Description *
                      </label>
                      <textarea
                        name="taskDescription"
                        placeholder="Provide detailed task description and requirements"
                        value={formData.taskDescription}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-form-textarea"
                        rows="4"
                      />
                    </div>
                    <div className="task-form-group">
                      <label className="task-form-label">
                        <AlertCircle className="task-form-label-icon" />
                        Priority *
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-form-select"
                      >
                        <option value="HIGH">🔴 High Priority</option>
                        <option value="MEDIUM">🟡 Medium Priority</option>
                        <option value="LOW">🟢 Low Priority</option>
                      </select>
                    </div>
                    <div className="task-form-group">
                      <label className="task-form-label">
                        <Calendar className="task-form-label-icon" />
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-form-input"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    {!editMode && (
                      <>
                        <div className="task-form-group task-form-full">
                          <label className="task-form-label">
                            <Building2 className="task-form-label-icon" />
                            Department *
                          </label>
                          <select
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="task-form-select"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept, index) => (
                              <option
                                key={dept.departmentId || `dept-${index}`}
                                value={dept.departmentId}
                              >
                                {dept.departmentName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {employees.length > 0 && (
                          <div className="task-form-group task-form-full">
                            <label className="task-form-label">
                              <Users className="task-form-label-icon" />
                              Assignees * ({formData.assignees.length} selected)
                            </label>
                            <div className="task-employee-list">
                              {employees.map((emp, index) => (
                                <div
                                  key={emp.employeeId || `emp-${index}`}
                                  className="task-employee-item"
                                >
                                  <label className="task-employee-label">
                                    <input
                                      type="checkbox"
                                      checked={formData.assignees.some(
                                        (a) =>
                                          a.assigneeId ===
                                          `${emp.employeeId}-${emp.employeeType}`
                                      )}
                                      onChange={(e) =>
                                        handleAssigneeToggle(
                                          emp,
                                          e.target.checked
                                        )
                                      }
                                      disabled={loading}
                                      className="task-employee-checkbox"
                                    />
                                    <div className="task-employee-info">
                                      <span className="task-employee-name">
                                        {emp.employeeName}
                                      </span>
                                      <span className="task-employee-type">
                                        {emp.employeeType} • ID:{" "}
                                        {emp.employeeId}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="task-modal-actions">
                  <button
                    className="task-modal-btn task-modal-btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                      setEditMode(false);
                      setEditTaskId(null);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="task-modal-btn task-modal-btn-primary"
                    onClick={handleSaveTask}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="task-loading-spinner-small"></div>
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editMode ? "Update Task" : "Create Task"}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        {showAssigneeModal && (
          <div className="task-modal">
            <div
              className="task-modal-backdrop"
              onClick={handleCloseAssigneeModal}
            />
            <div className="task-modal-content task-assignee-modal-content">
              <div className="task-modal-header">
                <h2 className="task-modal-title">
                  <Users className="task-modal-icon" />
                  Task Assignees
                </h2>
                <button
                  className="task-modal-close"
                  onClick={handleCloseAssigneeModal}
                >
                  ×
                </button>
              </div>
              <div className="task-modal-body">
                {assigneeLoading ? (
                  <div className="task-loading-container">
                    <div className="task-loading-spinner"></div>
                    <p className="task-loading-message">
                      Loading assignee details...
                    </p>
                  </div>
                ) : assigneeData.length === 0 ? (
                  <div className="task-no-tasks-container">
                    <div className="task-no-tasks-icon">
                      <Users />
                    </div>
                    <h3 className="task-no-tasks-title">No assignees found</h3>
                    <p className="task-no-tasks-subtitle">
                      This task hasn't been assigned to anyone yet
                    </p>
                  </div>
                ) : (
                  <div className="task-assignee-table-container">
                    <table className="task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-table-icon" />
                            Name
                          </th>
                          <th>Type</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Assigned</th>
                          <th>Completed</th>
                          <th>Delay Reason</th>
                          {!(
                            role === "Admin" &&
                            activeMainTab === "Head Created Task"
                          ) && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {assigneeData.map((assignee) => {
                          const isCompleted =
                            assignee.taskStatus === "COMPLETED";
                          return (
                            <tr key={assignee.assigneeId}>
                              <td className="task-assignee-name">
                                {assignee.userName}
                              </td>
                              <td>
                                <span className="task-assignee-type">
                                  {assignee.assigneeType}
                                </span>
                              </td>
                              <td>{assignee.emailId}</td>
                              <td>
                                <span
                                  className={`task-status task-${
                                    assignee.taskStatus
                                      ?.replace(/\s/g, "")
                                      .toLowerCase() || "pending"
                                  }`}
                                >
                                  {assignee.taskStatus || "PENDING"}
                                </span>
                              </td>
                              <td>{assignee.assignedDate || "N/A"}</td>
                              <td>{assignee.completedDate || "N/A"}</td>
                              <td>{assignee.delayReason || "N/A"}</td>
                              {!(
                                role === "Admin" &&
                                activeMainTab === "Head Created Task"
                              ) && (
                                <td>
                                  <div className="task-table-actions">
                                    <button
                                      className="task-action-btn task-delete-btn task-table-action"
                                      onClick={() =>
                                        handleDeleteAssignee(
                                          assignee.taskAssignedId
                                        )
                                      }
                                      disabled={assigneeLoading}
                                      title="Remove Assignee"
                                    >
                                      <Trash2 className="task-action-icon" />
                                    </button>
                                    <button
                                      className="task-action-btn task-view-btn task-table-action"
                                      onClick={() =>
                                        handleShowEligibleAssignees(
                                          selectedTask,
                                          assignee
                                        )
                                      }
                                      disabled={assigneeLoading || isCompleted}
                                      title={
                                        isCompleted
                                          ? "Cannot reassign completed task"
                                          : "Reassign Task"
                                      }
                                    >
                                      {isCompleted ? (
                                        <Ban className="task-action-icon task-block-icon" />
                                      ) : (
                                        <Users className="task-action-icon" />
                                      )}
                                      Reassign
                                    </button>
                                    {assignee.replacedTaskAssignmentId !==
                                      null && (
                                      <button
                                        className="task-action-btn task-view-btn task-table-action"
                                        onClick={() =>
                                          handleShowHistory(
                                            assignee.taskAssignedId
                                          )
                                        }
                                        disabled={assigneeLoading}
                                        title="Show History"
                                      >
                                        <CalendarDays className="task-action-icon" />
                                        History
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="task-modal-actions">
                <button
                  className="task-modal-btn task-modal-btn-secondary"
                  onClick={handleCloseAssigneeModal}
                  disabled={assigneeLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistoryModal && (
          <div className="task-modal">
            <div
              className="task-modal-backdrop"
              onClick={handleCloseHistoryModal}
            />
            <div className="task-modal-content task-assignee-modal-content">
              <div className="task-modal-header">
                <h2 className="task-modal-title">
                  <CalendarDays className="task-modal-icon" />
                  Task Assignment History
                </h2>
                <button
                  className="task-modal-close"
                  onClick={handleCloseHistoryModal}
                >
                  ×
                </button>
              </div>
              <div className="task-modal-body">
                {historyLoading ? (
                  <div className="task-loading-container">
                    <div className="task-loading-spinner"></div>
                    <p className="task-loading-message">Loading history...</p>
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="task-no-tasks-container">
                    <div className="task-no-tasks-icon">
                      <CalendarDays />
                    </div>
                    <h3 className="task-no-tasks-title">No history found</h3>
                    <p className="task-no-tasks-subtitle">
                      No previous assignees found for this task assignment
                    </p>
                  </div>
                ) : (
                  <div className="task-assignee-table-container">
                    <table className="task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-table-icon" />
                            Name
                          </th>
                          <th>Type</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Assigned</th>
                          <th>Completed</th>
                          <th>Delay Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((history, index) => (
                          <tr key={history.assigneeId || `history-${index}`}>
                            <td className="task-assignee-name">
                              {history.userName || "N/A"}
                            </td>
                            <td>
                              <span className="task-assignee-type">
                                {history.assigneeType || "N/A"}
                              </span>
                            </td>
                            <td>{history.emailId || "N/A"}</td>
                            <td>
                              <div className="task-priority-badge">
                                <span
                                  className={`task-status task-${history.taskStatus
                                    ?.replace(/\s/g, "")
                                    .toLowerCase()}`}
                                >
                                  {history.taskStatus || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td>{history.assignedDate || "N/A"}</td>
                            <td>{history.completedDate || "N/A"}</td>
                            <td>{history.delayReason || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="task-modal-actions">
                <button
                  className="task-modal-btn task-modal-btn-secondary"
                  onClick={handleCloseHistoryModal}
                  disabled={historyLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showEligibleAssigneesModal && (
          <div className="task-modal">
            <div
              className="task-modal-backdrop"
              onClick={handleCloseEligibleAssigneesModal}
            />
            <div className="task-modal-content task-assignee-modal-content">
              <div className="task-modal-header">
                <h2 className="task-modal-title">
                  <Users className="task-modal-icon" />
                  Eligible Assignees
                </h2>
                <button
                  className="task-modal-close"
                  onClick={handleCloseEligibleAssigneesModal}
                >
                  ×
                </button>
              </div>
              <div className="task-modal-body">
                {eligibleAssigneesLoading ? (
                  <div className="task-loading-container">
                    <div className="task-loading-spinner"></div>
                    <p className="task-loading-message">
                      Loading eligible assignees...
                    </p>
                  </div>
                ) : eligibleAssignees.length === 0 ? (
                  <div className="task-no-tasks-container">
                    <div className="task-no-tasks-icon">
                      <Users />
                    </div>
                    <h3 className="task-no-tasks-title">
                      No eligible assignees found
                    </h3>
                    <p className="task-no-tasks-subtitle">
                      No employees or heads are available for reassignment
                    </p>
                  </div>
                ) : (
                  <div className="task-assignee-table-container">
                    <table className="task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-table-icon" />
                            Name
                          </th>
                          <th>Type</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eligibleAssignees.map((assignee, index) => {
                          const assigneeId =
                            assignee.employeeId ||
                            assignee.id ||
                            assignee.userId;
                          return (
                            <tr key={assigneeId || `assignee-${index}`}>
                              <td className="task-assignee-name">
                                {assignee.employeeName}
                              </td>
                              <td>
                                <span className="task-assignee-type">
                                  {assignee.employeeType}
                                </span>
                              </td>
                              <td>
                                {assignee.email || assignee.emailId || "N/A"}
                              </td>
                              <td>
                                <button
                                  className="task-action-btn task-view-btn task-table-action"
                                  onClick={() => {
                                    if (!assigneeId) {
                                      console.error(
                                        "🚫 Reassign: Assignee ID is undefined:",
                                        assignee
                                      );
                                      alert(
                                        "Cannot reassign: Assignee ID is missing."
                                      );
                                      return;
                                    }
                                    if (!selectedAssigneeToReplace) {
                                      console.error(
                                        "🚫 Reassign: No assignee selected to replace"
                                      );
                                      alert(
                                        "Please select an assignee to replace first."
                                      );
                                      return;
                                    }
                                    if (
                                      window.confirm(
                                        `Are you sure you want to reassign this task to ${assignee.employeeName}?`
                                      )
                                    ) {
                                      handleReassignTask(
                                        selectedTask.taskId,
                                        assigneeId,
                                        assignee.employeeType,
                                        selectedAssigneeToReplace.taskAssignedId
                                      );
                                    }
                                  }}
                                  disabled={
                                    eligibleAssigneesLoading ||
                                    !selectedAssigneeToReplace
                                  }
                                  title="Reassign to this employee"
                                >
                                  <Users className="task-action-icon" />
                                  Reassign
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="task-modal-actions">
                <button
                  className="task-modal-btn task-modal-btn-secondary"
                  onClick={handleCloseEligibleAssigneesModal}
                  disabled={eligibleAssigneesLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showAssigneeEditModal && (
          <div className="task-modal">
            <div
              className="task-modal-backdrop"
              onClick={handleCloseAssigneeEditModal}
            />
            <div className="task-modal-content">
              <div className="task-modal-header">
                <h2 className="task-modal-title">
                  <Edit2 className="task-modal-icon" />
                  Update Task Status
                </h2>
                <button
                  className="task-modal-close"
                  onClick={handleCloseAssigneeEditModal}
                >
                  ×
                </button>
              </div>
              <div className="task-modal-body">
                <div className="task-form-grid">
                  <div className="task-form-group task-form-full">
                    <label className="task-form-label">
                      {getStatusIcon(assigneeFormData.taskStatus)}Task Status *
                    </label>
                    <select
                      name="taskStatus"
                      value={assigneeFormData.taskStatus}
                      onChange={handleAssigneeInputChange}
                      disabled={loading}
                      className="task-form-select"
                    >
                      <option value="PENDING">⏳ Pending</option>
                      <option value="IN_PROGRESS">🔄 In Progress</option>
                      <option value="COMPLETED">✅ Completed</option>
                    </select>
                  </div>
                  <div className="task-form-group task-form-full">
                    <label className="task-form-label">
                      <AlertCircle className="task-form-label-icon" />
                      Delay Reason (Optional)
                    </label>
                    <input
                      type="text"
                      name="delayReason"
                      placeholder="Explain any delays or issues"
                      value={assigneeFormData.delayReason}
                      onChange={handleAssigneeInputChange}
                      disabled={loading}
                      className="task-form-input"
                    />
                  </div>
                  {assigneeFormData.taskStatus === "COMPLETED" && (
                    <div className="task-form-group task-form-full">
                      <label className="task-form-label">
                        <CheckCircle className="task-form-label-icon" />
                        Completed Date *
                      </label>
                      <input
                        type="date"
                        name="completedDate"
                        value={assigneeFormData.completedDate}
                        onChange={handleAssigneeInputChange}
                        disabled={loading}
                        required
                        className="task-form-input"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="task-modal-actions">
                <button
                  className="task-modal-btn task-modal-btn-secondary"
                  onClick={handleCloseAssigneeEditModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="task-modal-btn task-modal-btn-primary"
                  onClick={() => updateAssigneeTask(editAssigneeTaskId)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="task-loading-spinner-small"></div>
                      Updating...
                    </>
                  ) : (
                    <>Update Status</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
