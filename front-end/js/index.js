searchIfSymbolInURL();
function searchIfSymbolInURL() {
  let urlParams = new URLSearchParams(window.location.search);
  let query = urlParams.get("query");
  if (query !== null) {
    search(query, companiesToDisplay => {
      displaySearchResults(companiesToDisplay);
    });
    let searchBar = document.getElementById("searchBar");
    searchBar.value = query;
  }
}

let searchBar = document.getElementById("searchBar");
searchBar.onkeyup = debounce(() => {
  let searchBar = document.getElementById("searchBar");
  let searchQuery = searchBar.value;
  if (searchQuery.length === 0) {
    let ul = document.getElementById("searchResults");
    ul.textContent = "";
    let url = window.location.href.split("?")[0];
    window.history.pushState({ path: url }, "", url);
  } else {
    search(searchQuery, companiesToDisplay => {
      displaySearchResults(companiesToDisplay);
    });
  }
}, 400);

async function search(searchQuery, callback) {
  showSpinner();
  let searchResults = document.getElementById("searchResults");
  searchResults.textContent = "";
  let response = await fetch(
    `http://localhost:5000/search?query=${searchQuery}`
  );
  let companiesToDisplay = await response.json();
  callback(companiesToDisplay);
}

function displaySearchResults(listOfCompanyProfiles) {
  listOfCompanyProfiles.map(profile => {
    if (Object.keys(profile).length !== 0) {
      let img = document.createElement("img");
      img.src = profile.profile.image;
      img.classList.add("company-image");
      let name = document.createElement("a");
      name.href = `./company.html?symbol=${profile.symbol}`;
      name.classList.add("company-name");
      name.textContent = profile.profile.companyName;
      let symbol = document.createElement("span");
      symbol.classList.add("company-symbol");
      symbol.textContent = `(${profile.symbol})`;
      let stockUpOrDown = document.createElement("span");
      if (profile.profile.changesPercentage !== null) {
        stockUpOrDown.textContent = profile.profile.changesPercentage;
        if (profile.profile.changesPercentage.includes("+") === true) {
          stockUpOrDown.classList.add("stock-up");
        } else {
          stockUpOrDown.classList.add("stock-down");
        }
      }
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.append(img, name, symbol, stockUpOrDown);
      searchResults.append(li);
    }
  });
  hideSpinner();
}

function showSpinner() {
  let spinner = document.getElementById("spinner");
  spinner.classList.remove("hide-element");
  spinner.classList.add("display-element");
}

function hideSpinner() {
  let spinner = document.getElementById("spinner");
  spinner.classList.remove("display-element");
  spinner.classList.add("hide-element");
}

function debounce(cb, interval, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) cb.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, interval);

    if (callNow) cb.apply(context, args);
  };
}
