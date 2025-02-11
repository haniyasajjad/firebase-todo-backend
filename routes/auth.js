const express = require("express");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");

const router = express.Router();
const db = getFirestore();

// Signup Endpoint
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userRecord = await getAuth().createUser({ email, password, displayName: name });
    await db.collection("users").doc(userRecord.uid).set({ email, name });
    res.status(201).json({ message: "User created", uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use Firebase REST API to sign in
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDEOkZxZtzKgzoZ_DmsZRQz28ArY1ACFck`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const idToken = response.data.idToken; // Get the Firebase ID Token

    res.status(200).json({ token: idToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

module.exports = router;
