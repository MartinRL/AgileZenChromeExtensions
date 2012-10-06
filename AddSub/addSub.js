var COMPLETE = 4;
var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";
var currentStoryDetails = "";
var currentUrlSplitBySlash = window.location.pathname.split("/");

$("#story-buttons").append(addSubButtonHtml);

var setCurrentStoryDetails = function() {
    var currentStory = getCurrentStory();
    currentStoryDetails = currentStory.details;
};

var getCurrentStoryNo = function() {
    return currentUrlSplitBySlash[currentUrlSplitBySlash.length - 1];
};

var getProjectNo = function() {
    return currentUrlSplitBySlash[2];
};

var getBaseApiUrl = function () {
    return "https://agilezen.com/api/v1/projects/" + getProjectNo() + "/stories";
};

var getCurrentStory = function () {
    var responseText;
    var xhrGet = new XMLHttpRequest();
    if ("withCredentials" in xhrGet) {
        xhrGet.open("GET", getBaseApiUrl() + "/" + getCurrentStoryNo() + "?with=details", false);
        xhrGet.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
        xhrGet.onreadystatechange = function () {
            if (xhrGet.readyState === COMPLETE) {
                responseText = jQuery.parseJSON(this.responseText);
            }
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
        xhrPost.onreadystatechange = function () {
            if (xhrPost.readyState === COMPLETE) {
                var subStory = jQuery.parseJSON(this.responseText);
                var detailsSubStoryHeader = "Implementeret i";
                if (currentStoryDetails.indexOf(detailsSubStoryHeader) == -1) {
                    currentStoryDetails = currentStoryDetails.concat("Implementeret i:");
                }
                currentStoryDetails = currentStoryDetails.concat("<br /> - #" + subStory.id + " " + subStory.text);
                var xhrUpdate = new XMLHttpRequest();
                xhrUpdate.open("PUT", getBaseApiUrl() + "/" + getCurrentStoryNo(), true);
                xhrUpdate.setRequestHeader("Content-Type", "application/json");
                xhrUpdate.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
                xhrUpdate.send(JSON.stringify({ details: currentStoryDetails }));
//            location.reload(true);
            }
        };
        var subStoryText = prompt("Venligst, angiv understorynavn.", "Lorem ipsum...");
        var tag = prompt("Venligst, angiv projekt-tag.", "Lorem ipsum...");
        var subStory = {
            text: subStoryText,
            details: "Laves som en del af #" + getCurrentStoryNo(),
            size: "S",
            /*phase: pending / the step after backlog,*/
            /*owner: [username of current story],*/
            tags: [tag]
        };
        xhrPost.send(JSON.stringify(subStory));
    }
};

setCurrentStoryDetails();
$("#story-toolbar-sub").click(createSubStory);
