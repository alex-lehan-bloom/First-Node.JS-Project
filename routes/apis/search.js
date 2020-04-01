const express = require("express");
require("es6-promise").polyfill();
const fetch = require("isomorphic-fetch");
const router = express.Router();
const moment = require("moment");
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
  query = req.query.query;
  getAllSearchResults().then(allCompanyProfiles => {
    res.json(allCompanyProfiles);
  });
});

async function search() {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
  );
  let originalSearchResults = await response.json();
  return originalSearchResults;
}

async function getSingleCompanyProfile(symbol) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
  );
  let data = await response.json();
  return data;
}

async function getAllSearchResults() {
  let companies = await search();
  let getCompanyProfile = companies.map(company => {
    return getSingleCompanyProfile(company.symbol);
  });
  let allCompanyProfiles = await Promise.all(getCompanyProfile);
  console.log(allCompanyProfiles);
  mongoDb.collection(searchCollectionName, (err, collection) => {
    console.log(allCompanyProfiles);
    collection
      .insertOne({
        date: moment().format(),
        searchResults: [{ name: "alex", email: "lehan" }]
        // searchResults: allCompanyProfiles
      })
      .then(console.log("Added document to db Successfully"));
  });

  return allCompanyProfiles;
}

module.exports = router;

// mongoDb.collection(searchCollectionName, (err, collection) => {
//   collection.find().toArray(function(err, items) {
//     console.log(items);
//   });
// });
