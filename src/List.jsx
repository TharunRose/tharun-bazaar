import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { fetchTasks } from "./services/TaskServices";
import { onAuthStateChanged , signOut } from "firebase/auth"; // Import this



import { useNavigate } from "react-router-dom";

const List = () => {
    
     const navigate = useNavigate()

  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTasks().then((tasks) => setTasks(tasks));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskInput.trim() || !user) return;

    try {
      if (editId) {
        const taskRef = doc(db, "tasks", editId);
        await updateDoc(taskRef, { title: taskInput });
      } else {
        await addDoc(collection(db, "tasks"), {
          userId: user.uid,
          title: taskInput,
          createdAt: new Date(),
        });
      }
      setTaskInput("");
      fetchTasks().then((tasks) => setTasks(tasks));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
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
    <div className="container">

        <button onClick={()=>handleLogout()} >logout</button>
      <h2>Task Manager</h2>
      {user ? (
        <>
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter task..."
              required
            />
            <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
          </form>

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <span>{task.title}</span>
                <button onClick={() => setEditId(task.id)}>✏️ Edit</button>
                <button onClick={() => handleDelete(task.id)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Please log in to manage tasks.</p>
      )}
    </div>
  );
};

export default List;
