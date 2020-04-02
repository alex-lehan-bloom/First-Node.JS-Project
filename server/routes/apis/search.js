const express = require("express");
const router = express.Router();
const fetch = require("isomorphic-fetch");
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

router.get("/", async (req, res) => {
  const query = req.query.query;
  const allCompanyProfiles = await getAllSearchResults(query);
  res.json(allCompanyProfiles);
});

async function search(query) {
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

async function getAllSearchResults(query) {
  let companies = await search(query);
  let getCompanyProfile = companies.map(company => {
    return getSingleCompanyProfile(company.symbol);
  });
  let allCompanyProfiles = await Promise.all(getCompanyProfile);
  mongoDb.collection(searchCollectionName, (err, collection) => {
    collection
      .insertOne({
        date: moment().format(),
        query: query,
        searchResults: allCompanyProfiles
      })
      .then(console.log("Added document to db Successfully"));
  });
  return allCompanyProfiles;
}

module.exports = router;
