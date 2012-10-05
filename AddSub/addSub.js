var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";

$("#story-buttons").append(addSubButtonHtml);

var getCurrentStoryNo = function() {
    console.log("getCurrentStoryNo: " + window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]);
    return window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
};

var getProjectNo = function() {
    console.log("getProjectNo: " + window.location.pathname.split("/")[2]);
    return window.location.pathname.split("/")[2];
};

var getBaseApiUrl = function () {
    console.log("getBaseApiUrl: " + "https://agilezen.com/api/v1/projects/" + getProjectNo() + "/stories");
    return "https://agilezen.com/api/v1/projects/" + getProjectNo() + "/stories";
};

var getCurrentStory = function () {
    var responseText;
    var xhrGet = new XMLHttpRequest();
    if ("withCredentials" in xhrGet) {
        xhrGet.open("GET", getBaseApiUrl() + "/" + getCurrentStoryNo() + "?with=details", false);
        xhrGet.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
        xhrGet.onreadystatechange = function() {
            console.log("getCurrentStory: " + this.responseText);
            responseText = jQuery.parseJSON(this.responseText);
        };
        xhrGet.send();
        return responseText;
    }
};

var createSubStory = function() {
    var xhrPost = new XMLHttpRequest();
    if ("withCredentials" in xhrPost) {
        xhrPost.open("POST", getBaseApiUrl(), true);
        xhrPost.setRequestHeader("Content-Type", "application/json");
        xhrPost.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
        xhrPost.onreadystatechange = function() {
            console.log("POST response: " + this.responseText);
            var subStory = jQuery.parseJSON(this.responseText);
            var currentStory = getCurrentStory();
            var currentStoryDetails = "";
            if (currentStory.details.indexOf("Implementeret i") == -1) {
                currentStoryDetails += "Implementeret i <br />";
            }
            currentStoryDetails += " - #" + subStory.id;
            var xhrUpdate = new XMLHttpRequest();
            xhrUpdate.open("PUT", getBaseApiUrl() + "/" + getCurrentStoryNo(), true);
            xhrUpdate.setRequestHeader("Content-Type", "application/json");
            xhrUpdate.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
            xhrUpdate.onreadystatechange = function() {
                console.log("PUT response: " + this.responseText);
            };
            xhrUpdate.send(JSON.stringify({details: currentStoryDetails}));
        };
        var subStoryText = prompt("Venligst, angiv understorynavn.", "Lorem ipsum...");
        var tag = prompt("Venligst, angiv projekt-tag.", "Lorem ipsum...");
        var subStory = {
            text: subStoryText,
            details: "Laves som en del af # ", /* aktuelt story# */
            size: "S",
            /*phase: pending / the step after backlog,*/
            /*owner: [username of current story],*/
            tags: [tag]
        };
        xhrPost.send(JSON.stringify(subStory));
    }
};

$("#story-toolbar-sub").click(createSubStory);
