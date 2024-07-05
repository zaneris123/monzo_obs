const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
require("dotenv").config();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL,
});

const db = admin.database();
const ref = db.ref("/processed_transactions");
const balanceRef = ref.child("currentbalance");

exports.onCreateValue = functions
    .region("europe-west3") // Set region here
    .database.ref("/transactions/{valueId}")
    .onCreate(async (snapshot, context) => {
      const newTransaction = snapshot.val();
      const transactionRef = ref.child(newTransaction.data.id);

      const existingTransactionRef = await transactionRef.once("value");
      if (!existingTransactionRef.exists()) {
        if (
          (
            newTransaction.type == "transaction.created" ||
            newTransaction.type == "transaction.updated"
          ) &&
          newTransaction.data.settled != ""
        ) {
          transactionRef.once("value").then((snapshot)=>{
            if (!snapshot.exists()) {
              transactionRef.set(newTransaction);
              balanceRef.transaction((currentValue)=>{
                return newTransaction.data.amount + (currentValue);
              });
            }
          });
        }
      }
    });
