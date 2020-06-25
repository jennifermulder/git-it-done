var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

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
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //href to link to issues page
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

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

//passing the language parameter into the function so that when its searched it can we added to the URL search
var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            //extract the JSON from the response
            response.json().then(function(data) {
                //logging the data from the response (the response is everything that is returned)
                //console.log(data)
                //passing response -> data -> items into the displayRepos function. Display repos function itself, pulls based on what its being told to pull, here
                displayRepos(data.items, language);
            });
        } else {
          alert("Error: " + response.statusText);
        }
      });
  };

//looks for event (button click event listener below, when you click on a language button)
var buttonClickHandler = function(event) {
    //identifies the target of the event (what was clicked on) and gets value of that "data-language" attribute
    var language = event.target.getAttribute("data-language")
    //value that is retrieved
    //console.log(language);
    if (language) {
        //pass this specified language into the getFeaturedRepos function (use as input)
        getFeaturedRepos(language);
      
        // clear old content (clears it first - asynchronous)
        repoContainerEl.textContent = "";
      }
}


userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);