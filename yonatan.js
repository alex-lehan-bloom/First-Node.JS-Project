const http = require('http');
const fetch = require('isomorphic-fetch');

async function searchNasdaq(query) {
  let response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`);
  let data = await response.json();
  return data;
}

async function getCompanyProfile(symbol) {
  const response = await fetch(`https://financialmodelingprep.com/api/v3/company/profile/${symbol}`);
  const data = await response.json()
  return data;
}

async function searchNasdaqWithCompanyProfile(query) {
  const companies = await searchNasdaq(query);
  const getCompaniesProfile = companies.map(company => {
    return getCompanyProfile(company.symbol);
  });
  const companiesProfiles = await Promise.all(getCompaniesProfile);
  return companiesProfiles;
}

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    response.setHeader('content-type', 'application/json');
    if (request.url === '/search') {
      // This server will get a request from some client
      // This server will send it's own request to some other server (https://financialmodelingprep.com)
      // This server will get a response from the other server
      // This server will send to the client the response it received from the other server 
      searchNasdaqWithCompanyProfile('ab').then((companiesProfiles) => {
        response.end(JSON.stringify({ companies: companiesProfiles }));
      });
    } else if (request.url === '/search-history') {
      response.end(JSON.stringify({ history: [{ query: 'ITC' }] }));
    } else {
      response.statusCode = 404;
      response.end(JSON.stringify({ message: `${request.url} not found` }));
    }
  } else {
    response.statusCode = 400;
    response.end('Invalid method error');
  }
});

server.listen(3000, () => {
  console.log("I'm listening on port 3000");
});