const express = require("express");
const router = express.Router();
const mongo = require("mongodb").MongoClient;
let mongoDb;
let searchCollectionName = "search";

// Connect to the db
mongo.connect(`mongodb://localhost:27017/NodeProjectDB`, (err, client) => {
  if (!err) {
    console.log("Connected successfully to db");
  }
  mongoDb = client.db("NodeProject");
});

router.get("/", (req, res) => {
  // mongoDb
  //   .collection(searchCollectionName)
  //   .find()
  //   .toArray()
  //   .then(items => {
  //     res.json(items);
  //     console.log("Retrieved search history successfully");
  //   });
  mongoDb.collection(searchCollectionName, (err, collection) => {
    collection.find().toArray(function(err, items) {
      if (!err) {
        res.json(items);
        console.log("Retrieved search history successfully");
      }
    });
  });
});

module.exports = router;
