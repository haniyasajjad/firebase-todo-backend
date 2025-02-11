const express = require("express");
const admin = require("firebase-admin"); // Import Firebase Admin
const verifyToken = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Initialize Firestore
const db = admin.firestore();
console.log("Firestore DB initialized:", db ? "Yes" : "No"); // Debug log

const router = express.Router();

// Create a Todo
router.post("/", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Check the request body
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newTodo = {
      title: req.body.title,
      description: req.body.description,
      userId: req.user.uid, // Add the user ID from the decoded token
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log("Writing to Firestore:", newTodo);
    const docRef = await db.collection("todos").add(newTodo);

    res.status(201).json({ id: docRef.id, message: "Todo added successfully" });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Todos
router.get("/", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("todos").where("userId", "==", req.user.uid).get();
    const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Todo
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const todoRef = db.collection("todos").doc(id);
    const todo = await todoRef.get();

    if (!todo.exists || todo.data().userId !== req.user.uid) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    await todoRef.delete();
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////marking todo as DONE
// ✅ PATCH Route for Marking Todo as Completed
router.patch("/:id", authMiddleware, async (req, res) => {
  const userId = req.user.uid; // Get user ID from token
  const todoId = req.params.id; // Get todo ID from URL
  const { completed } = req.body; // Get completed status from request body

  if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Invalid value for completed. Must be true or false." });
  }

  try {
      const todoRef = db.collection("todos").doc(todoId);
      const todoSnapshot = await todoRef.get();

      if (!todoSnapshot.exists) {
          return res.status(404).json({ error: "Todo not found" });
      }

      const todoData = todoSnapshot.data();

      // 🔒 Check if the user owns this todo
      if (todoData.userId !== userId) {
          return res.status(403).json({ error: "Unauthorized to modify this todo" });
      }

      // ✅ Update the completed status
      await todoRef.update({
          completed,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: "Todo marked as completed", todoId, completed });
  } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Failed to update todo" });
  }
});


module.exports = router;