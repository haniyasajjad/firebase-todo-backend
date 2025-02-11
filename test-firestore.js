// test-firestore.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

console.log("Initializing Firebase Admin SDK...");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  process.exit(1);
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

console.log("Firestore DB initialized:", db ? "Yes" : "No");

async function testFirestore() {
  try {
    const docRef = await db.collection("test").add({
      title: "Test3",
      description: "This is a test3",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

testFirestore();