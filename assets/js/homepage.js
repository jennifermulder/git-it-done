var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
    // format the github api url - SPECIFICALLY REQUESTING REPOS
    var apiUrl = "https://cors-anywhere.herokuapp.com/https://api.github.com/users/" + user + "/repos";

    // make a request to the url (like manually inputting it)
    fetch(apiUrl)
        .then(function (response) {
            // if request was successful and worked, pull repo and input
            if (response.ok) {
                //pull the response in json, pass data into the function, data = repos, user = search term
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            //if false, display error presented as part of console error
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // incase theres any issues with the request
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};


var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        //to clear the form 
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    console.log(repos);
    // console.log(searchTerm);
    // clear old content
    repoContainerEl.textContent = "";
    //set to the same name as the search Term
    repoSearchTerm.textContent = searchTerm;
    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);