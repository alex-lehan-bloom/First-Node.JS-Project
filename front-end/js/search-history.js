getSearchHistory().then(searchHistory => {
  displaySearchHistory(searchHistory);
});
async function getSearchHistory() {
  let response = await fetch("http://localhost:5000/search-history");
  let searchHistory = await response.json();
  console.log(searchHistory);
  return searchHistory;
}

function displaySearchHistory(searchHistory) {
  console.log(searchHistory);
  let ul = document.getElementById("searchHistory");
  searchHistory.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  for (let previousSearch of searchHistory) {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = previousSearch.date;
    let a = document.createElement("a");
    a.href = `index.html?query=${previousSearch.query}`;
    a.append(li);
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Delete";
    ul.append(a, button);
    deleteButton(button, previousSearch._id);
  }
}

function deleteButton(button, searchId) {
  button.addEventListener("click", async () => {
    console.log("inside listener");
    let response = await fetch(`http://localhost/search-history/${searchId}`);
    let itemDeleted = await response.json();
    console.log(itemDeleted);
  });
}
