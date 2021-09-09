// DOM references
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    // getting repo name from url query string
    var queryString = document.location.search;
    // here we are extracting the repo name using the split method
    var repoName = queryString.split("=")[1];

    // conditional statement
    if(repoName) {
     // display repo name from url query string 
     repoNameEl.textContent = repoName;

     getRepoIssues(repoName);
    }
    // if the conditional is false then it will redirect you back to the homepage file 
    else {
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {
    // format the github url
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    // making a GET request to url
    fetch(apiURL).then(function(response) {
        // request was successful
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                // check if API has paginated issues
                if(response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    }); 
};


var displayIssues = function(issues) {
    // if there are no open issues this will display  
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // creating an anchor element for each issue, which will redirect to github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");


        // creating span to hold issue title 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container 
        issueEl.appendChild(titleEl);

        //create a type element 
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull Request)";
        } 
        else {
        typeEl.textContent = "(Issue)"
        } 

        // append to container
        issueEl.appendChild(typeEl);


        // append the issueEl to the #issues-container element
        issueContainerEl.appendChild(issueEl);
    }
};

// function to display in the DOM whenever there is 30+ issues in repo
var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};


// function call/s
getRepoIssues();
getRepoName();