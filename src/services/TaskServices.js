import { db, auth } from "../firebase"; // Firebase setup file
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const addTask = async (task) => {
  try {
    const user = auth.currentUser; // Get logged-in user
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    await addDoc(collection(db, "tasks"), {
      userId: user.uid, // Store user ID
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate,
      createdAt: Timestamp.now(),
    });

    console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const fetchTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
