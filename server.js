const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();
console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT);

const cors = require("cors");

// Load environment variables FIRST


//Initialize Firebase Admin SDK BEFORE importing routes
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
//const serviceAccount = require("./serviceAccountKey.json");
//console.log("Firebase service account loaded successfully");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
console.log("Firebase initialized:", admin.apps.length > 0);


// Now import routes (AFTER Firebase is initialized)
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

const verifyToken = require("./middleware/authMiddleware");



const todoRoutes = require("./routes/todo");
app.use("/api/todos", verifyToken, todoRoutes);

app.get("/", (req, res) => res.send("Firebase Todo Backend Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true }); // Add this!

module.exports = { db };
