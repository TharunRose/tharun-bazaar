import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaOutdent,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function TaskDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    dueDate: "",
    category: "Work",
    status: "todo",
  });

  const user = auth.currentUser;

  // console.log(user.displayName);

  useEffect(() => {
    if (!user) return;

    fetchTasks();
  }, [user]);
  useEffect(() => {
    

    // fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const tasksSnapshot = await getDocs(q);
    const fetchedTasks = { todo: [], inProgress: [], completed: [] };
    tasksSnapshot.forEach((doc) => {
      const taskData = { id: doc.id, ...doc.data() };
      console.log("---", doc.data());
      console.log(taskData);
      fetchedTasks[taskData.status].push(taskData);
    });
    console.log(fetchedTasks);

    setTasks(fetchedTasks);
  };
  // Open modal (Edit or Add)
  const openModal = (task = null) => {
    if (task) {
      setTaskData(task);
      setEditMode(true);
      setCurrentTask(task.id);
    } else {
      setTaskData({ title: "", dueDate: "", category: "Work", status: "todo" });
      setEditMode(false);
      setCurrentTask(null);
    }
    setModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Save or update task
  const saveTask = async () => {
    if (!user) return;

    if (editMode) {
      const taskRef = doc(db, "tasks", currentTask);
      await updateDoc(taskRef, { ...taskData, modifiedAt: serverTimestamp() });

      setTasks((prev) => ({
        ...prev,
        [taskData.status]: prev[taskData.status].map((task) =>
          task.id === currentTask ? { id: currentTask, ...taskData } : task
        ),
      }));
      //   fetchTasks();
    } else {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });

      setTasks((prev) => ({
        ...prev,
        [taskData.status]: [
          ...prev[taskData.status],
          { id: docRef.id, ...taskData },
        ],
      }));
    }

    setModalOpen(false);
    setTaskData({ title: "", dueDate: "", category: "Work", status: "todo" });
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status: newStatus,
      modifiedAt: serverTimestamp(),
    });
    //  fetchTasks()
    setTasks((prev) => {
      let updatedTasks = { ...prev };
      Object.keys(updatedTasks).forEach((status) => {
        updatedTasks[status] = updatedTasks[status].filter(
          (task) => task.id !== taskId
        );
      });

      const task =
        prev.todo.find((t) => t.id === taskId) ||
        prev.inProgress.find((t) => t.id === taskId) ||
        prev.completed.find((t) => t.id === taskId);

      updatedTasks[newStatus].push({ ...task, status: newStatus });

      return updatedTasks;
    });
  };
  // Function to delete a task
  const deleteTask = async (taskId, status) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);

    // Update UI after deletion
    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].filter((task) => task.id !== taskId),
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className=" flex  bg-gray-600 justify-between items-center mb-4 p-5">
        <h1 className="text-2xl font-bold text-white">Task Management </h1>
        <button
          onClick={() => handleLogout()}
          className="bg-red-600 text-white px-4 py-2 rounded  flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          LogOut
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
  {user && user.photoURL ? (
    <img 
      src={user.photoURL} 
      alt="User Profile" 
      className="w-20 h-20 rounded-full object-cover"
    />
  ) : (
    <FaUser  className="mr-2" />
  )}
 

 <h1 className="text-2xl font-bold">
  {user ? user.displayName || "User" : "User"}
</h1>


  <button
    onClick={() => openModal()}
    className="bg-purple-600 text-white px-4 py-2 rounded flex items-center"
  >
    <FaPlus className="mr-2" /> ADD TASK
  </button>
</div>


      {/* Task Sections */}
      <div className="grid md:grid-cols-1 gap-4">
        {Object.keys(tasks).map((section) => (
          <div key={section} className="bg-white p-4 rounded shadow-md">
            <h2
              className={`text-lg font-bold mb-2 ${
                section === "todo"
                  ? "text-purple-600"
                  : section === "inProgress"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              {section.toUpperCase()}
            </h2>
            {tasks[section].map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <div>
                  <p className="font-semibold">Task : {task.title}</p>
                  <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                  <p className="text-sm text-gray-700">Category: {task.category}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <FaEdit
                    onClick={() => openModal(task)}
                    className="text-yellow-500 cursor-pointer"
                  />
                  <FaTrash
                    onClick={() => deleteTask(task.id, task.status)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 ">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Task" : "Add Task"}
            </h2>

            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="Task Name"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <select
              name="category"
              value={taskData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                {editMode ? "Update Task" : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
