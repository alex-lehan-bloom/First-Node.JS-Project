const express = require("express");
require("es6-promise").polyfill();
const fetch = require("isomorphic-fetch");
const router = express.Router();

router.get("/", (req, res) => {
  let symbol = "a";
  getAllSearchResults(symbol).then(allCompanyProfiles => {
    res.json(allCompanyProfiles);
  });
});

async function search(symbol) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${symbol}&limit=10&exchange=NASDAQ`
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

async function getAllSearchResults(symbol) {
  let companies = await search(symbol);
  let getCompanyProfile = companies.map(company => {
    return getSingleCompanyProfile(company.symbol);
  });
  let allCompanyProfiles = await Promise.all(getCompanyProfile);
  return allCompanyProfiles;
}

module.exports = router;
