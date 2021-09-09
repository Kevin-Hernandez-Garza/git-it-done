// creating two variables to store a reference to the form element in the index.html file
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoSearchTerm = document.querySelector("#repo-search-term");
var repoContainerEl = document.querySelector("#repos-container");


// creating function call
var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url 
    fetch(apiUrl).then(function (response) {
        // request was a success
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data, user);
        });
    } else {
        alert("Error: GitHub User Not Found");
    }
    })
    .catch(function(error) {
    // this catch() method getting chained onto the end of the then() method
    alert("Unable to connect to GitHub!");
    });
};

// form submission event function
var formSubmitHandler = function(event) {
    // It stops the browser from performing the default action the event wants it to do. In the case of submitting a form, it prevents the browser from sending the form's input data to a URL
    event.preventDefault();

    // getting the value from the input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
    console.log(event);
};

// function to display repos
var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found.";
        return;
    }

    // clear old content 
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // displaying repo data to the page

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // linking it to the single-repo html document from the index.html file (relative path), then we insert a query string for when they click on a repo name. 
        repoEl.setAttribute("href","./single-repo.html?repo=" + repoName);
        
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
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>"
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);

    } 
};


// event listeners
userFormEl.addEventListener("submit", formSubmitHandler);

var response = fetch("https://api.github.com/users/octocat/repos");
console.log(response);