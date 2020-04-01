const express = require("express");
require("es6-promise").polyfill();
const fetch = require("isomorphic-fetch");
const router = express.Router();

let query;

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
  return allCompanyProfiles;
}

module.exports = router;
