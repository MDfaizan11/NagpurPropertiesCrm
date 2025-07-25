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
//   Filter,
//   Eye,
//   User,
//   Building2,
//   Calendar,
//   Target,
// } from "lucide-react";

// const Task = () => {
//   const userData = JSON.parse(localStorage.getItem("NagpurProperties")) || {};
//   const token = userData?.token;
//   const role = userData?.role?.[0]?.roleName || "Partner";
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

//   // Map sub-tab names to API status values
//   const statusMap = {
//     "All Tasks": "ALL",
//     Pending: "PENDING",
//     "In Progress": "IN_PROGRESS",
//     Completed: "COMPLETED",
//   };

//   // Get status icon
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "COMPLETED":
//         return <CheckCircle className="task-status-icon" />;
//       case "IN_PROGRESS":
//         return <Clock className="task-status-icon" />;
//       case "PENDING":
//         return <AlertCircle className="task-status-icon" />;
//       default:
//         return <AlertCircle className="task-status-icon" />;
//     }
//   };

//   // Get priority icon
//   const getPriorityIcon = (priority) => {
//     switch (priority?.toUpperCase()) {
//       case "HIGH":
//         return (
//           <Target className="task-priority-icon task-priority-high-icon" />
//         );
//       case "MEDIUM":
//         return (
//           <Target className="task-priority-icon task-priority-medium-icon" />
//         );
//       case "LOW":
//         return <Target className="task-priority-icon task-priority-low-icon" />;
//       default:
//         return <Target className="task-priority-icon task-priority-low-icon" />;
//     }
//   };

//   // Fetch tasks based on active tab and sub-tab
//   const fetchTasks = useCallback(async () => {
//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       setLoading(false);
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

//         setTasks(res.data);
//         setFilteredTasks(res.data);
//       }
//     } catch (err) {
//       console.error("Failed to fetch tasks:", err);
//       setError(err.response?.data?.message || "Failed to fetch tasks.");
//       setTasks([]);
//       setFilteredTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeMainTab, activeSubTab, token, userId, role]);

//   // Fetch task details by ID
//   const fetchTaskById = useCallback(
//     async (taskId) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in.");
//         return null;
//       }

//       try {
//         const res = await axiosInstance.get(`${BASE_URL}/task/${taskId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         return res.data;
//       } catch (err) {
//         console.error("Failed to fetch task by ID:", err);
//         setError(
//           err.response?.data?.message || "Failed to fetch task details."
//         );
//         return null;
//       }
//     },
//     [token]
//   );

//   // Fetch assignee details for a task
//   const fetchAssigneeDetails = useCallback(
//     async (taskId) => {
//       if (!token) {
//         setAssigneeError("Authentication token is missing. Please log in.");
//         setAssigneeLoading(false);
//         return;
//       }

//       setAssigneeLoading(true);
//       setAssigneeError(null);

//       try {
//         const res = await axiosInstance.get(
//           `${BASE_URL}/task/${taskId}/assign-info-list?status=ALL`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setAssigneeData(res.data);
//       } catch (err) {
//         console.error("Failed to fetch assignee details:", err);
//         setAssigneeError(
//           err.response?.data?.message || "Failed to fetch assignee details."
//         );
//         setAssigneeData([]);
//       } finally {
//         setAssigneeLoading(false);
//       }
//     },
//     [token]
//   );

//   // Update assignee task status
//   const updateAssigneeTask = useCallback(
//     async (taskAssignmentId) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in.");
//         alert("Authentication token is missing. Please log in.");
//         return;
//       }

//       if (
//         assigneeFormData.taskStatus === "COMPLETED" &&
//         !assigneeFormData.completedDate
//       ) {
//         setError("Completed date is required for Completed status.");
//         alert("Completed date is required for Completed status.");
//         return;
//       }

//       try {
//         const payload = {
//           taskStatus: assigneeFormData.taskStatus,
//           delayReason: assigneeFormData.delayReason || "",
//           completedDate: assigneeFormData.completedDate || "",
//         };

//         const res = await axiosInstance.put(
//           `${BASE_URL}/update/assign-task/${Number(taskAssignmentId)}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setTasks((prev) =>
//           prev.map((task) =>
//             task.taskAssignmentId === Number(taskAssignmentId)
//               ? {
//                   ...task,
//                   status: res.data.taskStatus,
//                   delayReason: res.data.delayReason,
//                   completedDate: res.data.completedDate,
//                 }
//               : task
//           )
//         );

//         setFilteredTasks((prev) =>
//           prev.map((task) =>
//             task.taskAssignmentId === Number(taskAssignmentId)
//               ? {
//                   ...task,
//                   status: res.data.taskStatus,
//                   delayReason: res.data.delayReason,
//                   completedDate: res.data.completedDate,
//                 }
//               : task
//           )
//         );

//         setShowAssigneeEditModal(false);
//         setAssigneeFormData({
//           taskStatus: "PENDING",
//           delayReason: "",
//           completedDate: "",
//         });
//         alert("Task status updated successfully!");
//       } catch (err) {
//         console.error(
//           "Failed to update assignee task:",
//           err.response?.data || err.message
//         );
//         setError(
//           err.response?.data?.message || "Failed to update task status."
//         );
//         alert("Failed to update task status. Please try again.");
//       }
//     },
//     [token, assigneeFormData]
//   );

//   // Delete an assignee
//   const handleDeleteAssignee = useCallback(
//     async (taskAssignedId) => {
//       if (!token) {
//         setAssigneeError("Authentication token is missing. Please log in.");
//         return;
//       }

//       if (!window.confirm("Are you sure you want to delete this assignee?"))
//         return;

//       try {
//         setAssigneeLoading(true);
//         const res = await axiosInstance.delete(
//           `${BASE_URL}/delete/taskAssignId/${Number(taskAssignedId)}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setAssigneeData((prev) =>
//           prev.filter((a) => a.taskAssignedId !== Number(taskAssignedId))
//         );
//         alert("Assignee deleted successfully!");
//       } catch (err) {
//         console.error(
//           "Failed to delete assignee:",
//           err.response?.data || err.message
//         );
//         setAssigneeError(
//           err.response?.data?.message || "Failed to delete assignee."
//         );
//         alert("Failed to delete assignee. Please try again.");
//       } finally {
//         setAssigneeLoading(false);
//       }
//     },
//     [token]
//   );

//   // Filter tasks based on search term
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

//   // Fetch all departments
//   const fetchDepartments = useCallback(async () => {
//     if (!token) {
//       console.error("Authentication token is missing.");
//       return;
//     }

//     try {
//       const res = await axiosInstance.get(`${BASE_URL}/get-all-department`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setDepartments(res.data);
//     } catch (err) {
//       console.error("Failed to fetch departments:", err);
//     }
//   }, [token]);

//   // Fetch employees by department
//   const fetchEmployeesByDepartment = useCallback(
//     async (deptId) => {
//       if (!deptId || !token) {
//         console.error("Department ID or token is missing.");
//         return;
//       }

//       try {
//         const res = await axiosInstance.get(
//           `${BASE_URL}/get/department/${deptId}/head-and-employee`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const formattedEmployees = res.data.map((e) => ({
//           ...e,
//           employeeId: e.employeeId || e.id || e.userId,
//         }));
//         setEmployees(formattedEmployees);
//       } catch (err) {
//         console.error("Failed to fetch employees:", err);
//         setEmployees([]);
//       }
//     },
//     [token]
//   );

//   // Fetch departments and tasks on mount
//   useEffect(() => {
//     fetchDepartments();
//     fetchTasks();
//   }, [fetchTasks, fetchDepartments]);

//   // Filter tasks when search term changes
//   useEffect(() => {
//     filterTasks();
//   }, [filterTasks]);

//   // Handle main tab change
//   const handleMainTabChange = (tab) => {
//     setActiveMainTab(tab);
//     setActiveSubTab("All Tasks");
//   };

//   // Handle sub-tab change
//   const handleSubTabChange = (tab) => {
//     setActiveSubTab(tab);
//   };

//   // Handle input changes in the form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "departmentId") {
//       setFormData((prev) => ({ ...prev, departmentId: value, assignees: [] }));
//       fetchEmployeesByDepartment(value);
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle assignee checkbox toggle
//   const handleAssigneeToggle = (employee, isChecked) => {
//     if (!employee.employeeId) return;

//     const uniqueId = `${employee.employeeId}-${employee.employeeType}`;
//     setFormData((prev) => {
//       if (isChecked) {
//         return {
//           ...prev,
//           assignees: [
//             ...prev.assignees,
//             {
//               assigneeId: uniqueId,
//               employeeId: employee.employeeId,
//               assigneeType: employee.employeeType,
//               employeeName: employee.employeeName,
//             },
//           ],
//         };
//       } else {
//         return {
//           ...prev,
//           assignees: prev.assignees.filter((a) => a.assigneeId !== uniqueId),
//         };
//       }
//     });
//   };

//   // Reset form data
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

//   // Handle saving or updating a task
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
//       return;
//     }

//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
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
//       if (editMode) {
//         const res = await axiosInstance.put(
//           `${BASE_URL}/task/${editTaskId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setTasks((prev) =>
//           prev.map((task) => (task.taskId === editTaskId ? res.data : task))
//         );
//         setFilteredTasks((prev) =>
//           prev.map((task) => (task.taskId === editTaskId ? res.data : task))
//         );
//       } else {
//         const res = await axiosInstance.post(
//           `${BASE_URL}/created/task`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

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
//       console.error("Failed to save task:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to save task.");
//       alert("Failed to save task. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle editing a task
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

//   // Handle deleting a task
//   const handleDeleteTask = async (taskId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;

//     if (!token) {
//       setError("Authentication token is missing. Please log in.");
//       alert("Authentication token is missing. Please log in.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axiosInstance.delete(`${BASE_URL}/task/${taskId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
//       setFilteredTasks((prev) => prev.filter((task) => task.taskId !== taskId));
//       alert("Task deleted successfully!");
//     } catch (err) {
//       console.error(
//         "Failed to delete task:",
//         err.response?.data || err.message
//       );
//       setError(err.response?.data?.message || "Failed to delete task.");
//       alert("Failed to delete task. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show assignee details modal
//   const handleShowAssignees = (taskId) => {
//     fetchAssigneeDetails(taskId);
//     setShowAssigneeModal(true);
//   };

//   // Close assignee details modal
//   const handleCloseAssigneeModal = () => {
//     setShowAssigneeModal(false);
//     setAssigneeData([]);
//     setAssigneeError(null);
//   };

//   // Open assignee edit modal
//   const handleEditAssigneeTask = (task) => {
//     setAssigneeFormData({
//       taskStatus: task.status || "PENDING",
//       delayReason: task.delayReason || "",
//       completedDate: task.completedDate || "",
//     });
//     setEditAssigneeTaskId(task.taskAssignedId || task.taskAssignmentId);
//     setShowAssigneeEditModal(true);
//   };

//   // Handle input changes in assignee edit form
//   const handleAssigneeInputChange = (e) => {
//     const { name, value } = e.target;
//     setAssigneeFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Close assignee edit modal
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

//   // Define tabs based on role
//   let tabs = [];
//   if (role === "Admin") {
//     tabs = ["Created Task", "Head Created Task"];
//   } else if (role === "Head") {
//     tabs = ["Created Task", "Assign Task"];
//   } else if (role === "Employee") {
//     tabs = ["Assign Task"];
//   }

//   // Get task stats
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

//   return (
//     <div className="task-task-container">
//       <div className="task-task-wrapper">
//         {/* Enhanced Header Section */}
//         <div className="task-task-header">
//           <div className="task-task-header-content">
//             <div className="task-task-header-main">
//               <div className="task-task-header-text">
//                 <h1 className="task-task-title">
//                   <Target className="task-task-title-icon" />
//                   Task Management
//                 </h1>
//                 <p className="task-task-subtitle">
//                   Streamline your workflow and boost productivity across all
//                   departments
//                 </p>
//               </div>
//             </div>

//             {/* Task Statistics */}
//             {/* <div className="task-task-stats">
//               <div className="task-task-stat-card">
//                 <div className="task-task-stat-icon task-task-stat-total">
//                   <Target />
//                 </div>
//                 <div className="task-task-stat-info">
//                   <span className="task-task-stat-number">{stats.total}</span>
//                   <span className="task-task-stat-label">Total Tasks</span>
//                 </div>
//               </div>
//               <div className="task-task-stat-card">
//                 <div className="task-task-stat-icon task-task-stat-pending">
//                   <AlertCircle />
//                 </div>
//                 <div className="task-task-stat-info">
//                   <span className="task-task-stat-number">{stats.pending}</span>
//                   <span className="task-task-stat-label">Pending</span>
//                 </div>
//               </div>
//               <div className="task-task-stat-card">
//                 <div className="task-task-stat-icon task-task-stat-progress">
//                   <Clock />
//                 </div>
//                 <div className="task-task-stat-info">
//                   <span className="task-task-stat-number">
//                     {stats.inProgress}
//                   </span>
//                   <span className="task-task-stat-label">In Progress</span>
//                 </div>
//               </div>
//               <div className="task-task-stat-card">
//                 <div className="task-task-stat-icon task-task-stat-completed">
//                   <CheckCircle />
//                 </div>
//                 <div className="task-task-stat-info">
//                   <span className="task-task-stat-number">
//                     {stats.completed}
//                   </span>
//                   <span className="task-task-stat-label">Completed</span>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Enhanced Controls */}
//         {activeMainTab !== "Assign Task" &&
//           (role === "Admin" || role === "Head") && (
//             <div className="task-task-controls-custom">
//               <div className="task-task-controls-left">
//                 <div
//                   className={`task-task-search-container ${
//                     isSearchFocused ? "task-task-search-focused" : ""
//                   }`}
//                 >
//                   <Search className="task-task-search-icon" />
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
//                       className="task-task-search-clear"
//                       onClick={() => setSearchTerm("")}
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>
//               <button
//                 className="task-task-create-btn-custom"
//                 onClick={() => setShowForm(true)}
//                 disabled={loading}
//               >
//                 <Plus className="task-task-btn-icon" />
//                 <span>Create Task</span>
//               </button>
//             </div>
//           )}

//         {/* Enhanced Main Tabs */}
//         <div className="task-task-main-tabs">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               className={`task-task-tab ${
//                 activeMainTab === tab ? "task-task-tab-active" : ""
//               }`}
//               onClick={() => handleMainTabChange(tab)}
//               disabled={loading}
//             >
//               <span className="task-task-tab-text">{tab}</span>
//               {activeMainTab === tab && (
//                 <div className="task-task-tab-indicator" />
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Enhanced Sub-Tabs */}
//         <div className="task-task-sub-tabs">
//           {["All Tasks", "Pending", "In Progress", "Completed"].map((tab) => (
//             <button
//               key={tab}
//               className={`task-task-sub-tab ${
//                 activeSubTab === tab ? "task-task-sub-tab-active" : ""
//               }`}
//               onClick={() => handleSubTabChange(tab)}
//               disabled={loading}
//             >
//               {getStatusIcon(statusMap[tab])}
//               <span>{tab}</span>
//               <span className="task-task-sub-tab-count">
//                 {tab === "All Tasks"
//                   ? stats.total
//                   : tab === "Pending"
//                   ? stats.pending
//                   : tab === "In Progress"
//                   ? stats.inProgress
//                   : stats.completed}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Loading and Error Messages */}
//         {loading && (
//           <div className="task-task-loading-container">
//             <div className="task-task-loading-spinner"></div>
//             <p className="task-task-loading-message">Loading tasks...</p>
//           </div>
//         )}

//         {error && (
//           <div className="task-task-error-container">
//             <AlertCircle className="task-task-error-icon" />
//             <p className="task-task-error-message">{error}</p>
//           </div>
//         )}

//         {/* Enhanced Task List */}
//         <div className="task-task-list">
//           {!loading && filteredTasks.length === 0 && (
//             <div className="task-task-no-tasks-container">
//               <div className="task-task-no-tasks-icon">
//                 <Target />
//               </div>
//               <h3 className="task-task-no-tasks-title">No tasks found</h3>
//               <p className="task-task-no-tasks-subtitle">
//                 {searchTerm
//                   ? "Try adjusting your search criteria"
//                   : "Create your first task to get started"}
//               </p>
//               {!searchTerm &&
//                 activeMainTab !== "Assign Task" &&
//                 (role === "Admin" || role === "Head") && (
//                   <button
//                     className="task-task-create-btn-secondary"
//                     onClick={() => setShowForm(true)}
//                   >
//                     <Plus className="task-task-btn-icon" />
//                     Create First Task
//                   </button>
//                 )}
//             </div>
//           )}

//           {filteredTasks.map((task) => (
//             <div
//               className="task-task-card"
//               key={task.taskId || task.taskAssignmentId}
//             >
//               <div className="task-task-card-header">
//                 <div className="task-task-card-title-section">
//                   <h2 className="task-task-card-title">{task.taskName}</h2>
//                   <div className="task-task-card-meta">
//                     <div className="task-task-priority-badge">
//                       {getPriorityIcon(task.priority)}
//                       <span
//                         className={`task-task-priority task-task-${
//                           task.priority?.toLowerCase() || "low"
//                         }`}
//                       >
//                         {task.priority || "LOW"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="task-task-card-status">
//                   {getStatusIcon(task.status)}
//                   <span
//                     className={`task-task-status task-task-${task.status
//                       ?.replace(/\s/g, "")
//                       .toLowerCase()}`}
//                   >
//                     {task.status}
//                   </span>
//                 </div>
//               </div>

//               <p className="task-task-desc">{task.taskDescription}</p>

//               <div className="task-task-meta-section">
//                 <div className="task-task-meta">
//                   <Calendar className="task-task-meta-icon" />
//                   <span>Due: {task.dueDate}</span>
//                 </div>
//                 {task.assignedDate && (
//                   <div className="task-task-meta">
//                     <CalendarDays className="task-task-meta-icon" />
//                     <span>Assigned: {task.assignedDate}</span>
//                   </div>
//                 )}
//                 {task.completedDate && (
//                   <div className="task-task-meta">
//                     <CheckCircle className="task-task-meta-icon" />
//                     <span>Completed: {task.completedDate}</span>
//                   </div>
//                 )}
//                 {task.delayReason && (
//                   <div className="task-task-meta task-task-delay-reason">
//                     <AlertCircle className="task-task-meta-icon" />
//                     <span>
//                       <strong>Delay:</strong> {task.delayReason}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="task-task-footer">
//                 <div className="task-task-department">
//                   <Building2 className="task-task-department-icon" />
//                   <span>{task.department?.departmentName || "N/A"}</span>
//                 </div>
//               </div>

//               <div className="task-task-card-actions">
//                 {activeMainTab === "Assign Task" &&
//                   (role === "Employee" || role === "Head") && (
//                     <button
//                       className="task-task-action-btn task-task-edit-btn"
//                       onClick={() => handleEditAssigneeTask(task)}
//                       disabled={loading}
//                       title="Edit Task Status"
//                     >
//                       <Edit2 className="task-task-action-icon" />
//                       <span>Update Status</span>
//                     </button>
//                   )}

//                 {activeMainTab !== "Assign Task" &&
//                   (role === "Admin" || role === "Head") && (
//                     <>
//                       <button
//                         className="task-task-action-btn task-task-edit-btn"
//                         onClick={() => handleEditTask(task)}
//                         disabled={loading}
//                         title="Edit Task"
//                       >
//                         <Edit2 className="task-task-action-icon" />
//                         <span>Edit</span>
//                       </button>
//                       <button
//                         className="task-task-action-btn task-task-delete-btn"
//                         onClick={() => handleDeleteTask(task.taskId)}
//                         disabled={loading}
//                         title="Delete Task"
//                       >
//                         <Trash2 className="task-task-action-icon" />
//                         <span>Delete</span>
//                       </button>
//                     </>
//                   )}

//                 {!(
//                   activeMainTab === "Assign Task" &&
//                   (role === "Head" || role === "Employee")
//                 ) && (
//                   <button
//                     className="task-task-action-btn task-task-view-btn"
//                     onClick={() => handleShowAssignees(task.taskId)}
//                     disabled={loading}
//                     title="View Assignees"
//                   >
//                     <Eye className="task-task-action-icon" />
//                     <span>View Assignees</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Enhanced Task Form Modal */}
//         {showForm &&
//           activeMainTab !== "Assign Task" &&
//           (role === "Admin" || role === "Head") && (
//             <div className="task-task-modal">
//               <div
//                 className="task-task-modal-backdrop"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                   setEditMode(false);
//                   setEditTaskId(null);
//                 }}
//               />
//               <div className="task-task-modal-content">
//                 <div className="task-task-modal-header">
//                   <h2 className="task-task-modal-title">
//                     <Target className="task-task-modal-icon" />
//                     {editMode ? "Edit Task" : "Create New Task"}
//                   </h2>
//                   <button
//                     className="task-task-modal-close"
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

//                 <div className="task-task-modal-body">
//                   {error && (
//                     <div className="task-task-error-container">
//                       <AlertCircle className="task-task-error-icon" />
//                       <p className="task-task-error-message">{error}</p>
//                     </div>
//                   )}

//                   <div className="task-task-form-grid">
//                     <div className="task-task-form-group task-task-form-full">
//                       <label className="task-task-form-label">
//                         <Target className="task-task-form-label-icon" />
//                         Task Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="taskName"
//                         placeholder="Enter a descriptive task name"
//                         value={formData.taskName}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-task-form-input"
//                       />
//                     </div>

//                     <div className="task-task-form-group task-task-form-full">
//                       <label className="task-task-form-label">
//                         <Edit2 className="task-task-form-label-icon" />
//                         Task Description *
//                       </label>
//                       <textarea
//                         name="taskDescription"
//                         placeholder="Provide detailed task description and requirements"
//                         value={formData.taskDescription}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-task-form-textarea"
//                         rows="4"
//                       />
//                     </div>

//                     <div className="task-task-form-group">
//                       <label className="task-task-form-label">
//                         <AlertCircle className="task-task-form-label-icon" />
//                         Priority *
//                       </label>
//                       <select
//                         name="priority"
//                         value={formData.priority}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-task-form-select"
//                       >
//                         <option value="HIGH">🔴 High Priority</option>
//                         <option value="MEDIUM">🟡 Medium Priority</option>
//                         <option value="LOW">🟢 Low Priority</option>
//                       </select>
//                     </div>

//                     <div className="task-task-form-group">
//                       <label className="task-task-form-label">
//                         <Calendar className="task-task-form-label-icon" />
//                         Due Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="dueDate"
//                         value={formData.dueDate}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-task-form-input"
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                     </div>

//                     <div className="task-task-form-group task-task-form-full">
//                       <label className="task-task-form-label">
//                         <Building2 className="task-task-form-label-icon" />
//                         Department *
//                       </label>
//                       <select
//                         name="departmentId"
//                         value={formData.departmentId}
//                         onChange={handleInputChange}
//                         disabled={loading}
//                         className="task-task-form-select"
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
//                       <div className="task-task-form-group task-task-form-full">
//                         <label className="task-task-form-label">
//                           <Users className="task-task-form-label-icon" />
//                           Assignees * ({formData.assignees.length} selected)
//                         </label>
//                         <div className="task-task-employee-list">
//                           {employees.map((emp, index) => (
//                             <div
//                               key={emp.employeeId || `emp-${index}`}
//                               className="task-task-employee-item"
//                             >
//                               <label className="task-task-employee-label">
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
//                                   className="task-task-employee-checkbox"
//                                 />
//                                 <div className="task-task-employee-info">
//                                   <span className="task-task-employee-name">
//                                     {emp.employeeName}
//                                   </span>
//                                   <span className="task-task-employee-type">
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

//                 <div className="task-task-modal-actions">
//                   <button
//                     className="task-task-modal-btn task-task-modal-btn-secondary"
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
//                     className="task-task-modal-btn task-task-modal-btn-primary"
//                     onClick={handleSaveTask}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="task-task-loading-spinner-small"></div>
//                         {editMode ? "Updating..." : "Creating..."}
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle className="task-task-btn-icon" />
//                         {editMode ? "Update Task" : "Create Task"}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//         {/* Enhanced Assignee Details Modal */}
//         {showAssigneeModal && (
//           <div className="task-task-modal">
//             <div
//               className="task-task-modal-backdrop"
//               onClick={handleCloseAssigneeModal}
//             />
//             <div className="task-task-modal-content task-task-assignee-modal-content">
//               <div className="task-task-modal-header">
//                 <h2 className="task-task-modal-title">
//                   <Users className="task-task-modal-icon" />
//                   Task Assignees
//                 </h2>
//                 <button
//                   className="task-task-modal-close"
//                   onClick={handleCloseAssigneeModal}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="task-task-modal-body">
//                 {assigneeError && (
//                   <div className="task-task-error-container">
//                     <AlertCircle className="task-task-error-icon" />
//                     <p className="task-task-error-message">{assigneeError}</p>
//                   </div>
//                 )}

//                 {assigneeLoading ? (
//                   <div className="task-task-loading-container">
//                     <div className="task-task-loading-spinner"></div>
//                     <p className="task-task-loading-message">
//                       Loading assignee details...
//                     </p>
//                   </div>
//                 ) : assigneeData.length === 0 ? (
//                   <div className="task-task-no-tasks-container">
//                     <div className="task-task-no-tasks-icon">
//                       <Users />
//                     </div>
//                     <h3 className="task-task-no-tasks-title">
//                       No assignees found
//                     </h3>
//                     <p className="task-task-no-tasks-subtitle">
//                       This task hasn't been assigned to anyone yet
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="task-task-assignee-table-container">
//                     <table className="task-task-assignee-table">
//                       <thead>
//                         <tr>
//                           <th>
//                             <User className="task-task-table-icon" />
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
//                         {assigneeData.map((assignee) => (
//                           <tr key={assignee.assigneeId}>
//                             <td className="task-task-assignee-name">
//                               <div className="task-task-assignee-avatar">
//                                 {assignee.userName?.charAt(0)?.toUpperCase()}
//                               </div>
//                               {assignee.userName}
//                             </td>
//                             <td>
//                               <span className="task-task-assignee-type">
//                                 {assignee.assigneeType}
//                               </span>
//                             </td>
//                             <td>{assignee.emailId}</td>
//                             <td>
//                               {getStatusIcon(assignee.taskStatus)}
//                               <span
//                                 className={`task-task-status task-task-${assignee.taskStatus
//                                   ?.replace(/\s/g, "")
//                                   .toLowerCase()}`}
//                               >
//                                 {assignee.taskStatus}
//                               </span>
//                             </td>
//                             <td>{assignee.assignedDate || "N/A"}</td>
//                             <td>{assignee.completedDate || "N/A"}</td>
//                             <td>{assignee.delayReason || "N/A"}</td>
//                             <td>
//                               <button
//                                 className="task-task-action-btn task-task-delete-btn task-task-table-action"
//                                 onClick={() =>
//                                   handleDeleteAssignee(assignee.taskAssignedId)
//                                 }
//                                 disabled={assigneeLoading}
//                                 title="Remove Assignee"
//                               >
//                                 <Trash2 className="task-task-action-icon" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               <div className="task-task-modal-actions">
//                 <button
//                   className="task-task-modal-btn task-task-modal-btn-secondary"
//                   onClick={handleCloseAssigneeModal}
//                   disabled={assigneeLoading}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Task Status Update Modal */}
//         {showAssigneeEditModal && (
//           <div className="task-task-modal">
//             <div
//               className="task-task-modal-backdrop"
//               onClick={handleCloseAssigneeEditModal}
//             />
//             <div className="task-task-modal-content">
//               <div className="task-task-modal-header">
//                 <h2 className="task-task-modal-title">
//                   <Edit2 className="task-task-modal-icon" />
//                   Update Task Status
//                 </h2>
//                 <button
//                   className="task-task-modal-close"
//                   onClick={handleCloseAssigneeEditModal}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="task-task-modal-body">
//                 {error && (
//                   <div className="task-task-error-container">
//                     <AlertCircle className="task-task-error-icon" />
//                     <p className="task-task-error-message">{error}</p>
//                   </div>
//                 )}

//                 <div className="task-task-form-grid">
//                   <div className="task-task-form-group task-task-form-full">
//                     <label className="task-task-form-label">
//                       {getStatusIcon(assigneeFormData.taskStatus)}
//                       Task Status *
//                     </label>
//                     <select
//                       name="taskStatus"
//                       value={assigneeFormData.taskStatus}
//                       onChange={handleAssigneeInputChange}
//                       disabled={loading}
//                       className="task-task-form-select"
//                     >
//                       <option value="PENDING">⏳ Pending</option>
//                       <option value="IN_PROGRESS">🔄 In Progress</option>
//                       <option value="COMPLETED">✅ Completed</option>
//                     </select>
//                   </div>

//                   <div className="task-task-form-group task-task-form-full">
//                     <label className="task-task-form-label">
//                       <AlertCircle className="task-task-form-label-icon" />
//                       Delay Reason (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       name="delayReason"
//                       placeholder="Explain any delays or issues"
//                       value={assigneeFormData.delayReason}
//                       onChange={handleAssigneeInputChange}
//                       disabled={loading}
//                       className="task-task-form-input"
//                     />
//                   </div>

//                   {assigneeFormData.taskStatus === "COMPLETED" && (
//                     <div className="task-task-form-group task-task-form-full">
//                       <label className="task-task-form-label">
//                         <CheckCircle className="task-task-form-label-icon" />
//                         Completed Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="completedDate"
//                         value={assigneeFormData.completedDate}
//                         onChange={handleAssigneeInputChange}
//                         disabled={loading}
//                         required
//                         className="task-task-form-input"
//                         max={new Date().toISOString().split("T")[0]}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="task-task-modal-actions">
//                 <button
//                   className="task-task-modal-btn task-task-modal-btn-secondary"
//                   onClick={handleCloseAssigneeEditModal}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="task-task-modal-btn task-task-modal-btn-primary"
//                   onClick={() => updateAssigneeTask(editAssigneeTaskId)}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="task-task-loading-spinner-small"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="task-task-btn-icon" />
//                       Update Status
//                     </>
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
    role === "Employee" ? "Assign Task" : "Created Task"
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

  // Map sub-tab names to API status values
  const statusMap = {
    "All Tasks": "ALL",
    Pending: "PENDING",
    "In Progress": "IN_PROGRESS",
    Completed: "COMPLETED",
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="task-status-icon" />;
      case "IN_PROGRESS":
        return <Clock className="task-status-icon" />;
      case "PENDING":
        return <AlertCircle className="task-status-icon" />;
      default:
        return <AlertCircle className="task-status-icon" />;
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return (
          <Target className="task-priority-icon task-priority-high-icon" />
        );
      case "MEDIUM":
        return (
          <Target className="task-priority-icon task-priority-medium-icon" />
        );
      case "LOW":
        return <Target className="task-priority-icon task-priority-low-icon" />;
      default:
        return <Target className="task-priority-icon task-priority-low-icon" />;
    }
  };

  // Fetch tasks based on active tab and sub-tab
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

      if (activeMainTab === "Assign Task") {
        endpoint = `${BASE_URL}/get/assign/tasks?status=${status}`;
        console.log(`📡 fetchTasks: Fetching assigned tasks from ${endpoint}`);
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks: Assigned tasks response:", res.data);

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
        console.log(
          `📡 fetchTasks: Fetching head-created tasks from ${endpoint}`
        );
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks: Head-created tasks response:", res.data);

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
        console.log(`📡 fetchTasks: Fetching created tasks from ${endpoint}`);
        res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTasks: Created tasks response:", res.data);

        setTasks(res.data || []);
        setFilteredTasks(res.data || []);
      }
    } catch (err) {
      console.error("🚫 fetchTasks: Failed to fetch tasks:", {
        message: err.message,
        code: err.code,
        endpoint: `${BASE_URL}/${
          activeMainTab === "Assign Task"
            ? "get/assign/tasks"
            : activeMainTab === "Head Created Task"
            ? "get/head-created/tasks"
            : "created/task"
        }?status=${statusMap[activeSubTab]}`,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : null,
      });
      const errorMessage =
        err.code === "ERR_NETWORK"
          ? "Network error: Unable to connect to the server. Please check your internet connection or server status."
          : err.response?.data?.message ||
            "Failed to fetch tasks. Please try again later.";
      setError(errorMessage);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  }, [activeMainTab, activeSubTab, token, userId, role]);

  // Fetch task details by ID
  const fetchTaskById = useCallback(
    async (taskId) => {
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        console.error("🚫 fetchTaskById: Authentication token is missing.");
        return null;
      }

      try {
        console.log(
          `📡 fetchTaskById: Fetching task from ${BASE_URL}/task/${taskId}`
        );
        const res = await axiosInstance.get(`${BASE_URL}/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ fetchTaskById: Task response:", res.data);
        return res.data;
      } catch (err) {
        console.error("🚫 fetchTaskById: Failed to fetch task:", {
          message: err.message,
          code: err.code,
          endpoint: `${BASE_URL}/task/${taskId}`,
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
              }
            : null,
        });
        setError(
          err.response?.data?.message || "Failed to fetch task details."
        );
        return null;
      }
    },
    [token]
  );

  // Fetch assignee details for a task
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
        console.log(
          `📡 fetchAssigneeDetails: Fetching assignees from ${BASE_URL}/task/${taskId}/assign-info-list?status=ALL`
        );
        const res = await axiosInstance.get(
          `${BASE_URL}/task/${taskId}/assign-info-list?status=ALL`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ fetchAssigneeDetails: Assignees response:", res.data);
        setAssigneeData(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchAssigneeDetails: Failed to fetch assignee details:",
          {
            message: err.message,
            code: err.code,
            endpoint: `${BASE_URL}/task/${taskId}/assign-info-list?status=ALL`,
            response: err.response
              ? {
                  status: err.response.status,
                  data: err.response.data,
                }
              : null,
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
    [token]
  );

  // Fetch eligible employees and heads for reassignment
  const fetchEligibleAssignees = useCallback(
    async (departmentId, taskId) => {
      if (!token || !departmentId || !taskId) {
        setEligibleAssigneesError(
          "Authentication token, department ID, or task ID is missing."
        );
        setEligibleAssigneesLoading(false);
        console.error(
          "🚫 fetchEligibleAssignees: Missing token, departmentId, or taskId:",
          {
            token: !!token,
            departmentId,
            taskId,
          }
        );
        return;
      }

      setEligibleAssigneesLoading(true);
      setEligibleAssigneesError(null);

      try {
        console.log(
          `📡 fetchEligibleAssignees: Fetching eligible assignees from ${BASE_URL}/department/${departmentId}/task/${taskId}/reassigned/eligible/employees-head`
        );
        const res = await axiosInstance.get(
          `${BASE_URL}/department/${departmentId}/task/${taskId}/reassigned/eligible/employees-head`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "✅ fetchEligibleAssignees: Eligible assignees response:",
          res.data
        );
        setEligibleAssignees(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchEligibleAssignees: Failed to fetch eligible assignees:",
          {
            message: err.message,
            code: err.code,
            endpoint: `${BASE_URL}/department/${departmentId}/task/${taskId}/reassigned/eligible/employees-head`,
            response: err.response
              ? {
                  status: err.response.status,
                  data: err.response.data,
                }
              : null,
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

  // Fetch task assignment history
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
        console.log(
          `📡 fetchTaskAssignmentHistory: Fetching history from ${endpoint}`
        );
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(
          "✅ fetchTaskAssignmentHistory: History response:",
          res.data
        );
        setHistoryData(res.data || []);
      } catch (err) {
        console.error(
          "🚫 fetchTaskAssignmentHistory: Failed to fetch history:",
          {
            message: err.message,
            code: err.code,
            endpoint: `${BASE_URL}/task-assignment/${taskAssignmentId}/history`,
            response: err.response
              ? {
                  status: err.response.status,
                  data: err.response.data,
                }
              : null,
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

  // Reassign task to a new assignee
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
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
        });
        alert("Cannot reassign task: Missing required parameters.");
        return;
      }

      try {
        const endpoint = `${BASE_URL}/task/${taskId}/reassign?newAssignedId=${newAssignedId}&newAssigneeType=${newAssigneeType}&replaceTaskAssignmentId=${replaceTaskAssignmentId}`;
        console.log(`📡 handleReassignTask: Initiating task reassignment`, {
          taskId,
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
          endpoint,
        });
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
        console.log("✅ handleReassignTask: Task reassigned successfully:", {
          response: res.data,
          taskId,
          newAssignedId,
          newAssigneeType,
          replaceTaskAssignmentId,
        });

        // Refresh assignee data and task list
        await fetchAssigneeDetails(taskId);
        await fetchTasks();
        setShowEligibleAssigneesModal(false);
        setSelectedAssigneeToReplace(null);
        setEligibleAssignees([]);
        setEligibleAssigneesError(null);
        alert("Task reassigned successfully!");
      } catch (err) {
        console.error("🚫 handleReassignTask: Failed to reassign task:", {
          message: err.message,
          code: err.code,
          endpoint: `${BASE_URL}/task/${taskId}/reassign?newAssignedId=${newAssignedId}&newAssigneeType=${newAssigneeType}&replaceTaskAssignmentId=${replaceTaskAssignmentId}`,
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
              }
            : null,
        });
        setAssigneeError(
          err.response?.data?.message || "Failed to reassign task."
        );
        alert("Failed to reassign task. Please try again.");
      }
    },
    [token, fetchAssigneeDetails, fetchTasks]
  );

  // Fetch all departments
  const fetchDepartments = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      console.error("🚫 fetchDepartments: Authentication token is missing.");
      return;
    }

    try {
      setLoading(true);
      console.log(
        `📡 fetchDepartments: Fetching departments from ${BASE_URL}/get-all-department`
      );
      const res = await axiosInstance.get(`${BASE_URL}/get-all-department`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ fetchDepartments: Departments response:", res.data);
      setDepartments(res.data || []);
    } catch (err) {
      console.error("🚫 fetchDepartments: Failed to fetch departments:", {
        message: err.message,
        code: err.code,
        endpoint: `${BASE_URL}/get-all-department`,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : null,
      });
      const errorMessage =
        err.code === "ERR_NETWORK"
          ? "Network error: Unable to connect to the server. Please check your internet connection or server status."
          : err.response?.data?.message ||
            "Failed to fetch departments. Please try again later.";
      setError(errorMessage);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch employees by department
  const fetchEmployeesByDepartment = useCallback(
    async (deptId) => {
      if (!deptId || !token) {
        console.error(
          "🚫 fetchEmployeesByDepartment: Department ID or token is missing:",
          {
            deptId,
            token: !!token,
          }
        );
        setEmployees([]);
        return;
      }

      try {
        console.log(
          `📡 fetchEmployeesByDepartment: Fetching employees from ${BASE_URL}/get/department/${deptId}/head-and-employee`
        );
        const res = await axiosInstance.get(
          `${BASE_URL}/get/department/${deptId}/head-and-employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "✅ fetchEmployeesByDepartment: Employees response:",
          res.data
        );
        const formattedEmployees = res.data.map((e) => ({
          ...e,
          employeeId: e.employeeId || e.id || e.userId,
        }));
        setEmployees(formattedEmployees);
      } catch (err) {
        console.error(
          "🚫 fetchEmployeesByDepartment: Failed to fetch employees:",
          {
            message: err.message,
            code: err.code,
            endpoint: `${BASE_URL}/get/department/${deptId}/head-and-employee`,
            response: err.response
              ? {
                  status: err.response.status,
                  data: err.response.data,
                }
              : null,
          }
        );
        setEmployees([]);
      }
    },
    [token]
  );

  // Update assignee task status
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

      try {
        const payload = {
          taskStatus: assigneeFormData.taskStatus,
          delayReason: assigneeFormData.delayReason || "",
          completedDate: assigneeFormData.completedDate || "",
        };
        console.log(
          `📡 updateAssigneeTask: Updating task status for taskAssignmentId ${taskAssignmentId} with payload:`,
          payload
        );

        const res = await axiosInstance.put(
          `${BASE_URL}/update/assign-task/${Number(taskAssignmentId)}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ updateAssigneeTask: Task status updated:", res.data);

        setTasks((prev) =>
          prev.map((task) =>
            task.taskAssignmentId === Number(taskAssignmentId)
              ? {
                  ...task,
                  status: res.data.taskStatus,
                  delayReason: res.data.delayReason,
                  completedDate: res.data.completedDate,
                }
              : task
          )
        );

        setFilteredTasks((prev) =>
          prev.map((task) =>
            task.taskAssignmentId === Number(taskAssignmentId)
              ? {
                  ...task,
                  status: res.data.taskStatus,
                  delayReason: res.data.delayReason,
                  completedDate: res.data.completedDate,
                }
              : task
          )
        );

        setShowAssigneeEditModal(false);
        setAssigneeFormData({
          taskStatus: "PENDING",
          delayReason: "",
          completedDate: "",
        });
        alert("Task status updated successfully!");
      } catch (err) {
        console.error("🚫 updateAssigneeTask: Failed to update task status:", {
          message: err.message,
          code: err.code,
          endpoint: `${BASE_URL}/update/assign-task/${Number(
            taskAssignmentId
          )}`,
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
              }
            : null,
        });
        setError(
          err.response?.data?.message || "Failed to update task status."
        );
        alert("Failed to update task status. Please try again.");
      }
    },
    [token, assigneeFormData]
  );

  // Delete an assignee
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
        console.log(
          `📡 handleDeleteAssignee: Deleting assignee for taskAssignedId ${taskAssignedId}`
        );
        await axiosInstance.delete(
          `${BASE_URL}/delete/taskAssignId/${Number(taskAssignedId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ handleDeleteAssignee: Assignee deleted successfully");

        setAssigneeData((prev) =>
          prev.filter((a) => a.taskAssignedId !== Number(taskAssignedId))
        );
        await fetchTasks();
        alert("Assignee deleted successfully!");
      } catch (err) {
        console.error("🚫 handleDeleteAssignee: Failed to delete assignee:", {
          message: err.message,
          code: err.code,
          endpoint: `${BASE_URL}/delete/taskAssignId/${Number(taskAssignedId)}`,
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
              }
            : null,
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

  // Filter tasks based on search term
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

  // Handle showing eligible assignees
  const handleShowEligibleAssignees = useCallback(
    async (task, assigneeToReplace = null) => {
      setSelectedTask(task);
      setSelectedAssigneeToReplace(assigneeToReplace);
      console.log(
        "📋 handleShowEligibleAssignees: Opening eligible assignees modal",
        {
          taskId: task.taskId,
          taskName: task.taskName,
          departmentId: task.department?.departmentId,
          assigneeToReplace: assigneeToReplace
            ? {
                assigneeId: assigneeToReplace.assigneeId,
                userName: assigneeToReplace.userName,
                taskAssignedId: assigneeToReplace.taskAssignedId,
              }
            : null,
        }
      );
      await fetchEligibleAssignees(task.department?.departmentId, task.taskId);
      setShowEligibleAssigneesModal(true);
    },
    [fetchEligibleAssignees]
  );

  // Handle showing task assignment history
  const handleShowHistory = useCallback(
    async (taskAssignedId) => {
      console.log(
        "📋 handleShowHistory: Opening history modal for taskAssignedId:",
        taskAssignedId
      );
      await fetchTaskAssignmentHistory(taskAssignedId);
      setShowHistoryModal(true);
    },
    [fetchTaskAssignmentHistory]
  );

  // Close history modal
  const handleCloseHistoryModal = useCallback(() => {
    console.log("📋 handleCloseHistoryModal: Closing history modal");
    setShowHistoryModal(false);
    setHistoryData([]);
    setHistoryError(null);
  }, []);

  // Close eligible assignees modal
  const handleCloseEligibleAssigneesModal = () => {
    console.log(
      "📋 handleCloseEligibleAssigneesModal: Closing eligible assignees modal"
    );
    setShowEligibleAssigneesModal(false);
    setEligibleAssignees([]);
    setEligibleAssigneesError(null);
    setSelectedTask(null);
    setSelectedAssigneeToReplace(null);
  };

  // Fetch departments and tasks on mount
  useEffect(() => {
    fetchDepartments();
    fetchTasks();
  }, [fetchTasks, fetchDepartments]);

  // Filter tasks when search term changes
  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  // Handle main tab change
  const handleMainTabChange = (tab) => {
    setActiveMainTab(tab);
    setActiveSubTab("All Tasks");
  };

  // Handle sub-tab change
  const handleSubTabChange = (tab) => {
    setActiveSubTab(tab);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      setFormData((prev) => ({ ...prev, departmentId: value, assignees: [] }));
      fetchEmployeesByDepartment(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle assignee checkbox toggle
  const handleAssigneeToggle = (employee, isChecked) => {
    if (!employee.employeeId) return;

    const uniqueId = `${employee.employeeId}-${employee.employeeType}`;
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          assignees: [
            ...prev.assignees,
            {
              assigneeId: uniqueId,
              employeeId: employee.employeeId,
              assigneeType: employee.employeeType,
              employeeName: employee.employeeName,
            },
          ],
        };
      } else {
        return {
          ...prev,
          assignees: prev.assignees.filter((a) => a.assigneeId !== uniqueId),
        };
      }
    });
  };

  // Reset form data
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

  // Handle saving or updating a task
  const handleSaveTask = async () => {
    setError(null);

    if (
      !formData.taskName.trim() ||
      !formData.taskDescription.trim() ||
      !formData.dueDate ||
      !formData.departmentId ||
      formData.assignees.length === 0
    ) {
      setError(
        "Please fill in all required fields and select at least one assignee."
      );
      console.error(
        "🚫 handleSaveTask: Form validation failed: Missing required fields"
      );
      return;
    }

    if (!token) {
      setError("Authentication token is missing. Please log in.");
      console.error("🚫 handleSaveTask: Authentication token is missing.");
      return;
    }

    const payload = {
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
      if (editMode) {
        console.log(
          `📡 handleSaveTask: Updating task ${editTaskId} with payload:`,
          payload
        );
        const res = await axiosInstance.put(
          `${BASE_URL}/task/${editTaskId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ handleSaveTask: Task updated:", res.data);

        setTasks((prev) =>
          prev.map((task) => (task.taskId === editTaskId ? res.data : task))
        );
        setFilteredTasks((prev) =>
          prev.map((task) => (task.taskId === editTaskId ? res.data : task))
        );
      } else {
        console.log(`📡 handleSaveTask: Creating task with payload:`, payload);
        const res = await axiosInstance.post(
          `${BASE_URL}/created/task`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ handleSaveTask: Task created:", res.data);

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
        message: err.message,
        code: err.code,
        endpoint: editMode
          ? `${BASE_URL}/task/${editTaskId}`
          : `${BASE_URL}/created/task`,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : null,
      });
      setError(err.response?.data?.message || "Failed to save task.");
      alert("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a task
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
      fetchEmployeesByDepartment(taskData.department?.departmentId);
    }
    setLoading(false);
  };

  // Handle deleting a task
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
      console.log(`📡 handleDeleteTask: Deleting task ${taskId}`);
      await axiosInstance.delete(`${BASE_URL}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ handleDeleteTask: Task deleted successfully");

      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      setFilteredTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error("🚫 handleDeleteTask: Failed to delete task:", {
        message: err.message,
        code: err.code,
        endpoint: `${BASE_URL}/task/${taskId}`,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : null,
      });
      setError(err.response?.data?.message || "Failed to delete task.");
      alert("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show assignee details modal
  const handleShowAssignees = (taskId) => {
    setSelectedTask(tasks.find((t) => t.taskId === taskId));
    fetchAssigneeDetails(taskId);
    setShowAssigneeModal(true);
  };

  // Close assignee details modal
  const handleCloseAssigneeModal = () => {
    console.log("📋 handleCloseAssigneeModal: Closing assignee details modal");
    setShowAssigneeModal(false);
    setAssigneeData([]);
    setAssigneeError(null);
    setSelectedTask(null);
    setSelectedAssigneeToReplace(null);
  };

  // Open assignee edit modal
  const handleEditAssigneeTask = (task) => {
    setAssigneeFormData({
      taskStatus: task.status || "PENDING",
      delayReason: task.delayReason || "",
      completedDate: task.completedDate || "",
    });
    setEditAssigneeTaskId(task.taskAssignedId || task.taskAssignmentId);
    setShowAssigneeEditModal(true);
  };

  // Handle input changes in assignee edit form
  const handleAssigneeInputChange = (e) => {
    const { name, value } = e.target;
    setAssigneeFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Close assignee edit modal
  const handleCloseAssigneeEditModal = () => {
    console.log("📋 handleCloseAssigneeEditModal: Closing assignee edit modal");
    setShowAssigneeEditModal(false);
    setAssigneeFormData({
      taskStatus: "PENDING",
      delayReason: "",
      completedDate: "",
    });
    setEditAssigneeTaskId(null);
    setError(null);
  };

  // Define tabs based on role
  let tabs = [];
  if (role === "Admin") {
    tabs = ["Created Task", "Head Created Task"];
  } else if (role === "Head") {
    tabs = ["Created Task", "Assign Task"];
  } else if (role === "Employee") {
    tabs = ["Assign Task"];
  }

  // Get task stats
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

  return (
    <div className="task-task-container">
      <div className="task-task-wrapper">
        {/* Enhanced Header Section */}
        <div className="task-task-header">
          <div className="task-task-header-content">
            <div className="task-task-header-main">
              <div className="task-task-header-text">
                <h1 className="task-task-title">
                  <Target className="task-task-title-icon" />
                  Task Management
                </h1>
                <p className="task-task-subtitle">
                  Streamline your workflow and boost productivity across all
                  departments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        {activeMainTab !== "Assign Task" &&
          (role === "Admin" || role === "Head") && (
            <div className="task-task-controls-custom">
              <div className="task-task-controls-left">
                <div
                  className={`task-task-search-container ${
                    isSearchFocused ? "task-task-search-focused" : ""
                  }`}
                >
                  <Search className="task-task-search-icon" />
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
                      className="task-task-search-clear"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <button
                className="task-task-create-btn-custom"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                <Plus className="task-task-btn-icon" />
                <span>Create Task</span>
              </button>
            </div>
          )}

        {/* Enhanced Main Tabs */}
        <div className="task-task-main-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`task-task-tab ${
                activeMainTab === tab ? "task-task-tab-active" : ""
              }`}
              onClick={() => handleMainTabChange(tab)}
              disabled={loading}
            >
              <span className="task-task-tab-text">{tab}</span>
              {activeMainTab === tab && (
                <div className="task-task-tab-indicator" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Sub-Tabs */}
        <div className="task-task-sub-tabs">
          {["All Tasks", "Pending", "In Progress", "Completed"].map((tab) => (
            <button
              key={tab}
              className={`task-task-sub-tab ${
                activeSubTab === tab ? "task-task-sub-tab-active" : ""
              }`}
              onClick={() => handleSubTabChange(tab)}
              disabled={loading}
            >
              {getStatusIcon(statusMap[tab])}
              <span>{tab}</span>
              <span className="task-task-sub-tab-count">
                {tab === "All Tasks"
                  ? stats.total
                  : tab === "Pending"
                  ? stats.pending
                  : tab === "In Progress"
                  ? stats.inProgress
                  : stats.completed}
              </span>
            </button>
          ))}
        </div>

        {/* Loading and Error Messages */}
        {loading && (
          <div className="task-task-loading-container">
            <div className="task-task-loading-spinner"></div>
            <p className="task-task-loading-message">Loading tasks...</p>
          </div>
        )}

        {error && (
          <div className="task-task-error-container">
            <AlertCircle className="task-task-error-icon" />
            <p className="task-task-error-message">{error}</p>
          </div>
        )}

        {/* Enhanced Task List */}
        <div className="task-task-list">
          {!loading && filteredTasks.length === 0 && (
            <div className="task-task-no-tasks-container">
              <div className="task-task-no-tasks-icon">
                <Target />
              </div>
              <h3 className="task-task-no-tasks-title">No tasks found</h3>
              <p className="task-task-no-tasks-subtitle">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create your first task to get started"}
              </p>
              {!searchTerm &&
                activeMainTab !== "Assign Task" &&
                (role === "Admin" || role === "Head") && (
                  <button
                    className="task-task-create-btn-secondary"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="task-task-btn-icon" />
                    Create First Task
                  </button>
                )}
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              className="task-task-card"
              key={task.taskId || task.taskAssignmentId}
            >
              <div className="Otask-task-card-header">
                <div className="task-task-card-title-section">
                  <h2 className="task-task-card-title">{task.taskName}</h2>
                  <div className="task-task-card-meta">
                    <div className="task-task-priority-badge">
                      {getPriorityIcon(task.priority)}
                      <span
                        className={`task-task-priority task-task-${
                          task.priority?.toLowerCase() || "low"
                        }`}
                      >
                        {task.priority || "LOW"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-task-card-status">
                  {getStatusIcon(task.status)}
                  <span
                    className={`task-task-status task-task-${task.status
                      ?.replace(/\s/g, "")
                      .toLowerCase()}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              <p className="task-task-desc">{task.taskDescription}</p>

              <div className="task-task-meta-section">
                <div className="task-task-meta">
                  <Calendar className="task-task-meta-icon" />
                  <span>Due: {task.dueDate}</span>
                </div>
                {task.assignedDate && (
                  <div className="task-task-meta">
                    <CalendarDays className="task-task-meta-icon" />
                    <span>Assigned: {task.assignedDate}</span>
                  </div>
                )}
                {task.completedDate && (
                  <div className="task-task-meta">
                    <CheckCircle className="task-task-meta-icon" />
                    <span>Completed: {task.completedDate}</span>
                  </div>
                )}
                {task.delayReason && (
                  <div className="task-task-meta task-task-delay-reason">
                    <AlertCircle className="task-task-meta-icon" />
                    <span>
                      <strong>Delay:</strong> {task.delayReason}
                    </span>
                  </div>
                )}
              </div>

              <div className="task-task-footer">
                <div className="task-task-department">
                  <Building2 className="task-task-department-icon" />
                  <span>{task.department?.departmentName || "N/A"}</span>
                </div>
              </div>

              <div className="task-task-card-actions">
                {activeMainTab === "Assign Task" &&
                  (role === "Employee" || role === "Head") && (
                    <button
                      className="task-task-action-btn task-task-edit-btn"
                      onClick={() => handleEditAssigneeTask(task)}
                      disabled={loading}
                      title="Edit Task Status"
                    >
                      <Edit2 className="task-task-action-icon" />
                      <span>Update Status</span>
                    </button>
                  )}

                {activeMainTab !== "Assign Task" &&
                  (role === "Admin" || role === "Head") && (
                    <>
                      <button
                        className="task-task-action-btn task-task-edit-btn"
                        onClick={() => handleEditTask(task)}
                        disabled={loading}
                        title="Edit Task"
                      >
                        <Edit2 className="task-task-action-icon" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="task-task-action-btn task-task-delete-btn"
                        onClick={() => handleDeleteTask(task.taskId)}
                        disabled={loading}
                        title="Delete Task"
                      >
                        <Trash2 className="task-task-action-icon" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}

                {!(
                  activeMainTab === "Assign Task" &&
                  (role === "Head" || role === "Employee")
                ) && (
                  <button
                    className="task-task-action-btn task-task-view-btn"
                    onClick={() => handleShowAssignees(task.taskId)}
                    disabled={loading}
                    title="View Assignees"
                  >
                    <Eye className="task-task-action-icon" />
                    <span>View Assignees</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Task Form Modal */}
        {showForm &&
          activeMainTab !== "Assign Task" &&
          (role === "Admin" || role === "Head") && (
            <div className="task-task-modal">
              <div
                className="task-task-modal-backdrop"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditMode(false);
                  setEditTaskId(null);
                }}
              />
              <div className="task-task-modal-content">
                <div className="task-task-modal-header">
                  <h2 className="task-task-modal-title">
                    <Target className="task-task-modal-icon" />
                    {editMode ? "Edit Task" : "Create New Task"}
                  </h2>
                  <button
                    className="task-task-modal-close"
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

                <div className="task-task-modal-body">
                  {error && (
                    <div className="task-task-error-container">
                      <AlertCircle className="task-task-error-icon" />
                      <p className="task-task-error-message">{error}</p>
                    </div>
                  )}

                  <div className="task-task-form-grid">
                    <div className="task-task-form-group task-task-form-full">
                      <label className="task-task-form-label">
                        <Target className="task-task-form-label-icon" />
                        Task Name *
                      </label>
                      <input
                        type="text"
                        name="taskName"
                        placeholder="Enter a descriptive task name"
                        value={formData.taskName}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-task-form-input"
                      />
                    </div>

                    <div className="task-task-form-group task-task-form-full">
                      <label className="task-task-form-label">
                        <Edit2 className="task-task-form-label-icon" />
                        Task Description *
                      </label>
                      <textarea
                        name="taskDescription"
                        placeholder="Provide detailed task description and requirements"
                        value={formData.taskDescription}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-task-form-textarea"
                        rows="4"
                      />
                    </div>

                    <div className="task-task-form-group">
                      <label className="task-task-form-label">
                        <AlertCircle className="task-task-form-label-icon" />
                        Priority *
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-task-form-select"
                      >
                        <option value="HIGH">🔴 High Priority</option>
                        <option value="MEDIUM">🟡 Medium Priority</option>
                        <option value="LOW">🟢 Low Priority</option>
                      </select>
                    </div>

                    <div className="task-task-form-group">
                      <label className="task-task-form-label">
                        <Calendar className="task-task-form-label-icon" />
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-task-form-input"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="task-task-form-group task-task-form-full">
                      <label className="task-task-form-label">
                        <Building2 className="task-task-form-label-icon" />
                        Department *
                      </label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="task-task-form-select"
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
                      <div className="task-task-form-group task-task-form-full">
                        <label className="task-task-form-label">
                          <Users className="task-task-form-label-icon" />
                          Assignees * ({formData.assignees.length} selected)
                        </label>
                        <div className="task-task-employee-list">
                          {employees.map((emp, index) => (
                            <div
                              key={emp.employeeId || `emp-${index}`}
                              className="task-task-employee-item"
                            >
                              <label className="task-task-employee-label">
                                <input
                                  type="checkbox"
                                  checked={formData.assignees.some(
                                    (a) =>
                                      a.assigneeId ===
                                      `${emp.employeeId}-${emp.employeeType}`
                                  )}
                                  onChange={(e) =>
                                    handleAssigneeToggle(emp, e.target.checked)
                                  }
                                  disabled={loading}
                                  className="task-task-employee-checkbox"
                                />
                                <div className="task-task-employee-info">
                                  <span className="task-task-employee-name">
                                    {emp.employeeName}
                                  </span>
                                  <span className="task-task-employee-type">
                                    {emp.employeeType} • ID: {emp.employeeId}
                                  </span>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="task-task-modal-actions">
                  <button
                    className="task-task-modal-btn task-task-modal-btn-secondary"
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
                    className="task-task-modal-btn task-task-modal-btn-primary"
                    onClick={handleSaveTask}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="task-task-loading-spinner-small"></div>
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="task-task-btn-icon" />
                        {editMode ? "Update Task" : "Create Task"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Enhanced Assignee Details Modal */}
        {showAssigneeModal && (
          <div className="task-task-modal">
            <div
              className="task-task-modal-backdrop"
              onClick={handleCloseAssigneeModal}
            />
            <div className="task-task-modal-content task-task-assignee-modal-content">
              <div className="task-task-modal-header">
                <h2 className="task-task-modal-title">
                  <Users className="task-task-modal-icon" />
                  Task Assignees
                </h2>
                <button
                  className="task-task-modal-close"
                  onClick={handleCloseAssigneeModal}
                >
                  ×
                </button>
              </div>

              <div className="task-task-modal-body">
                {assigneeError && (
                  <div className="task-task-error-container">
                    <AlertCircle className="task-task-error-icon" />
                    <p className="task-task-error-message">{assigneeError}</p>
                  </div>
                )}

                {assigneeLoading ? (
                  <div className="task-task-loading-container">
                    <div className="task-task-loading-spinner"></div>
                    <p className="task-task-loading-message">
                      Loading assignee details...
                    </p>
                  </div>
                ) : assigneeData.length === 0 ? (
                  <div className="task-task-no-tasks-container">
                    <div className="task-task-no-tasks-icon">
                      <Users />
                    </div>
                    <h3 className="task-task-no-tasks-title">
                      No assignees found
                    </h3>
                    <p className="task-task-no-tasks-subtitle">
                      This task hasn't been assigned to anyone yet
                    </p>
                  </div>
                ) : (
                  <div className="task-task-assignee-table-container">
                    <table className="task-task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-task-table-icon" />
                            Name
                          </th>
                          <th>Type</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Assigned</th>
                          <th>Completed</th>
                          <th>Delay Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assigneeData.map((assignee) => (
                          <tr key={assignee.assigneeId}>
                            <td className="task-task-assignee-name">
                              <div className="task-task-assignee-avatar">
                                {assignee.userName?.charAt(0)?.toUpperCase()}
                              </div>
                              {assignee.userName}
                            </td>
                            <td>
                              <span className="task-task-assignee-type">
                                {assignee.assigneeType}
                              </span>
                            </td>
                            <td>{assignee.emailId}</td>
                            <td>
                              {getStatusIcon(assignee.taskStatus)}
                              <span
                                className={`task-task-status task-task-${assignee.taskStatus
                                  ?.replace(/\s/g, "")
                                  .toLowerCase()}`}
                              >
                                {assignee.taskStatus}
                              </span>
                            </td>
                            <td>{assignee.assignedDate || "N/A"}</td>
                            <td>{assignee.completedDate || "N/A"}</td>
                            <td>{assignee.delayReason || "N/A"}</td>
                            <td>
                              <button
                                className="task-task-action-btn task-task-delete-btn task-task-table-action"
                                onClick={() =>
                                  handleDeleteAssignee(assignee.taskAssignedId)
                                }
                                disabled={assigneeLoading}
                                title="Remove Assignee"
                              >
                                <Trash2 className="task-task-action-icon" />
                              </button>
                              <button
                                className="task-task-action-btn task-task-view-btn task-task-table-action"
                                onClick={() =>
                                  handleShowEligibleAssignees(
                                    selectedTask,
                                    assignee
                                  )
                                }
                                disabled={assigneeLoading}
                                title="Reassign Task"
                              >
                                <Users className="task-task-action-icon" />
                                Reassign
                              </button>
                              <button
                                className="task-task-action-btn task-task-view-btn task-task-table-action"
                                onClick={() =>
                                  handleShowHistory(assignee.taskAssignedId)
                                }
                                disabled={assigneeLoading}
                                title="Show History"
                              >
                                <CalendarDays className="task-task-action-icon" />
                                History
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="task-task-modal-actions">
                <button
                  className="task-task-modal-btn task-task-modal-btn-secondary"
                  onClick={handleCloseAssigneeModal}
                  disabled={assigneeLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Assignment History Modal */}
        {showHistoryModal && (
          <div className="task-task-modal">
            <div
              className="task-task-modal-backdrop"
              onClick={handleCloseHistoryModal}
            />
            <div className="task-task-modal-content task-task-assignee-modal-content">
              <div className="task-task-modal-header">
                <h2 className="task-task-modal-title">
                  <CalendarDays className="task-task-modal-icon" />
                  Task Assignment History
                </h2>
                <button
                  className="task-task-modal-close"
                  onClick={handleCloseHistoryModal}
                >
                  ×
                </button>
              </div>

              <div className="task-task-modal-body">
                {historyError && (
                  <div className="task-task-error-container">
                    <AlertCircle className="task-task-error-icon" />
                    <p className="task-task-error-message">{historyError}</p>
                  </div>
                )}

                {historyLoading ? (
                  <div className="task-task-loading-container">
                    <div className="task-task-loading-spinner"></div>
                    <p className="task-task-loading-message">
                      Loading history...
                    </p>
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="task-task-no-tasks-container">
                    <div className="task-task-no-tasks-icon">
                      <CalendarDays />
                    </div>
                    <h3 className="task-task-no-tasks-title">
                      No history found
                    </h3>
                    <p className="task-task-no-tasks-subtitle">
                      No previous assignees found for this task assignment
                    </p>
                  </div>
                ) : (
                  <div className="task-task-assignee-table-container">
                    <table className="task-task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-task-table-icon" />
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
                        {historyData.map((history, index) => {
                          console.log(`📋 History Record [${index}]:`, {
                            assigneeId: history.assigneeId,
                            userName: history.userName,
                            assigneeType: history.assigneeType,
                            emailId: history.emailId,
                            taskStatus: history.taskStatus,
                            assignedDate: history.assignedDate,
                            completedDate: history.completedDate,
                            delayReason: history.delayReason,
                          });
                          return (
                            <tr key={history.assigneeId || `history-${index}`}>
                              <td className="task-task-assignee-name">
                                <div className="task-task-assignee-avatar">
                                  {history.userName?.charAt(0)?.toUpperCase()}
                                </div>
                                {history.userName || "N/A"}
                              </td>
                              <td>
                                <span className="task-task-assignee-type">
                                  {history.assigneeType || "N/A"}
                                </span>
                              </td>
                              <td>{history.emailId || "N/A"}</td>
                              <td>
                                {getStatusIcon(history.taskStatus)}
                                <span
                                  className={`task-task-status task-task-${history.taskStatus
                                    ?.replace(/\s/g, "")
                                    .toLowerCase()}`}
                                >
                                  {history.taskStatus || "N/A"}
                                </span>
                              </td>
                              <td>{history.assignedDate || "N/A"}</td>
                              <td>{history.completedDate || "N/A"}</td>
                              <td>{history.delayReason || "N/A"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="task-task-modal-actions">
                <button
                  className="task-task-modal-btn task-task-modal-btn-secondary"
                  onClick={handleCloseHistoryModal}
                  disabled={historyLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Eligible Assignees Modal */}
        {showEligibleAssigneesModal && (
          <div className="task-task-modal">
            <div
              className="task-task-modal-backdrop"
              onClick={handleCloseEligibleAssigneesModal}
            />
            <div className="task-task-modal-content task-task-assignee-modal-content">
              <div className="task-task-modal-header">
                <h2 className="task-task-modal-title">
                  <Users className="task-task-modal-icon" />
                  Eligible Assignees
                </h2>
                <button
                  className="task-task-modal-close"
                  onClick={handleCloseEligibleAssigneesModal}
                >
                  ×
                </button>
              </div>

              <div className="task-task-modal-body">
                {eligibleAssigneesError && (
                  <div className="task-task-error-container">
                    <AlertCircle className="task-task-error-icon" />
                    <p className="task-task-error-message">
                      {eligibleAssigneesError}
                    </p>
                  </div>
                )}

                {eligibleAssigneesLoading ? (
                  <div className="task-task-loading-container">
                    <div className="task-task-loading-spinner"></div>
                    <p className="task-task-loading-message">
                      Loading eligible assignees...
                    </p>
                  </div>
                ) : eligibleAssignees.length === 0 ? (
                  <div className="task-task-no-tasks-container">
                    <div className="task-task-no-tasks-icon">
                      <Users />
                    </div>
                    <h3 className="task-task-no-tasks-title">
                      No eligible assignees found
                    </h3>
                    <p className="task-task-no-tasks-subtitle">
                      No employees or heads are available for reassignment
                    </p>
                  </div>
                ) : (
                  <div className="task-task-assignee-table-container">
                    <table className="task-task-assignee-table">
                      <thead>
                        <tr>
                          <th>
                            <User className="task-task-table-icon" />
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
                          console.log(`📋 Eligible Assignee [${index}]:`, {
                            assigneeId,
                            employeeName: assignee.employeeName,
                            employeeType: assignee.employeeType,
                            email: assignee.email || assignee.emailId,
                          });

                          return (
                            <tr key={assigneeId || `assignee-${index}`}>
                              <td className="task-task-assignee-name">
                                <div className="task-task-assignee-avatar">
                                  {assignee.employeeName
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </div>
                                {assignee.employeeName}
                              </td>
                              <td>
                                <span className="task-task-assignee-type">
                                  {assignee.employeeType}
                                </span>
                              </td>
                              <td>
                                {assignee.email || assignee.emailId || "N/A"}
                              </td>
                              <td>
                                <button
                                  className="task-task-action-btn task-task-view-btn task-task-table-action"
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
                                      console.log(
                                        `📡 Initiating reassignment for task ${selectedTask.taskId}`,
                                        {
                                          newAssignedId: assigneeId,
                                          newAssigneeType:
                                            assignee.employeeType,
                                          replaceTaskAssignmentId:
                                            selectedAssigneeToReplace.taskAssignedId,
                                        }
                                      );
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
                                  <Users className="task-task-action-icon" />
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

              <div className="task-task-modal-actions">
                <button
                  className="task-task-modal-btn task-task-modal-btn-secondary"
                  onClick={handleCloseEligibleAssigneesModal}
                  disabled={eligibleAssigneesLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Task Status Update Modal */}
        {showAssigneeEditModal && (
          <div className="task-task-modal">
            <div
              className="task-task-modal-backdrop"
              onClick={handleCloseAssigneeEditModal}
            />
            <div className="task-task-modal-content">
              <div className="task-task-modal-header">
                <h2 className="task-task-modal-title">
                  <Edit2 className="task-task-modal-icon" />
                  Update Task Status
                </h2>
                <button
                  className="task-task-modal-close"
                  onClick={handleCloseAssigneeEditModal}
                >
                  ×
                </button>
              </div>

              <div className="task-task-modal-body">
                {error && (
                  <div className="task-task-error-container">
                    <AlertCircle className="task-task-error-icon" />
                    <p className="task-task-error-message">{error}</p>
                  </div>
                )}

                <div className="task-task-form-grid">
                  <div className="task-task-form-group task-task-form-full">
                    <label className="task-task-form-label">
                      {getStatusIcon(assigneeFormData.taskStatus)}
                      Task Status *
                    </label>
                    <select
                      name="taskStatus"
                      value={assigneeFormData.taskStatus}
                      onChange={handleAssigneeInputChange}
                      disabled={loading}
                      className="task-task-form-select"
                    >
                      <option value="PENDING">⏳ Pending</option>
                      <option value="IN_PROGRESS">🔄 In Progress</option>
                      <option value="COMPLETED">✅ Completed</option>
                    </select>
                  </div>

                  <div className="task-task-form-group task-task-form-full">
                    <label className="task-task-form-label">
                      <AlertCircle className="task-task-form-label-icon" />
                      Delay Reason (Optional)
                    </label>
                    <input
                      type="text"
                      name="delayReason"
                      placeholder="Explain any delays or issues"
                      value={assigneeFormData.delayReason}
                      onChange={handleAssigneeInputChange}
                      disabled={loading}
                      className="task-task-form-input"
                    />
                  </div>

                  {assigneeFormData.taskStatus === "COMPLETED" && (
                    <div className="task-task-form-group task-task-form-full">
                      <label className="task-task-form-label">
                        <CheckCircle className="task-task-form-label-icon" />
                        Completed Date *
                      </label>
                      <input
                        type="date"
                        name="completedDate"
                        value={assigneeFormData.completedDate}
                        onChange={handleAssigneeInputChange}
                        disabled={loading}
                        required
                        className="task-task-form-input"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="task-task-modal-actions">
                <button
                  className="task-task-modal-btn task-task-modal-btn-secondary"
                  onClick={handleCloseAssigneeEditModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="task-task-modal-btn task-task-modal-btn-primary"
                  onClick={() => updateAssigneeTask(editAssigneeTaskId)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="task-task-loading-spinner-small"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="task-task-btn-icon" />
                      Update Status
                    </>
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