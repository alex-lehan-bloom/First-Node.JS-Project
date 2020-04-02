const express = require("express");
const router = express.Router();
const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

let mongoDb;
let searchCollectionName = "search";

// Connect to the db
mongoClient.connect(
  `mongodb://localhost:27017/NodeProjectDB`,
  (err, client) => {
    if (!err) {
      console.log("Connected successfully to db");
    }
    mongoDb = client.db("NodeProject");
  }
);

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

router.delete("/:id", (req, res) => {
  let itemToDelete = { _id: mongo.ObjectID(req.params.id) };
  mongoDb
    .collection(searchCollectionName)
    .deleteOne(itemToDelete, (err, obj) => {
      if (obj.deletedCount === 1) {
        res.json({
          message: `Document with id ${req.params.id} was deleted`,
          mongo_response: obj
        });
      } else {
        res.json({
          message: `Document with id ${req.params.id} was NOT deleted`,
          mongo_response: obj
        });
      }
    });
});

module.exports = router;
