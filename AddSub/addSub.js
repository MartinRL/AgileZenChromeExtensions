var API_KEY = "X-Zen-ApiKey";
var API_TOKEN = "f4c92d749eb546c29fc964a7e84c1bfd";
var COMPLETE = 4;
var CALL_ASYNC = true;
var CALL_SYNC = false;
var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";
var currentStory;
var currentUrlSplitBySlash = window.location.pathname.split("/");

$("#story-buttons").append(addSubButtonHtml);

var getCurrentStoryNo = function() {
    return currentUrlSplitBySlash[currentUrlSplitBySlash.length - 1];
};

var getProjectNo = function() {
    return currentUrlSplitBySlash[2];
};

var getBaseApiUrl = function () {
    return "https://agilezen.com/api/v1/projects/" + getProjectNo() + "/stories";
};

XMLHttpRequest.prototype.withCredentialsIsIn = function () {
    return "withCredentials" in this;
};

var getCurrentStory = function () {
    var responseText;
    var xhrGet = new XMLHttpRequest();
    if (xhrGet.withCredentialsIsIn()) {
        xhrGet.open("GET", getBaseApiUrl() + "/" + getCurrentStoryNo() + "?with=details", CALL_SYNC);
        xhrGet.setRequestHeader(API_KEY, API_TOKEN);
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
    if (xhrPost.withCredentialsIsIn()) {
        xhrPost.open("POST", getBaseApiUrl(), CALL_SYNC);
        var CONTENT_TYPE = "Content-Type";
        var APPLICATION_JSON = "application/json";
        xhrPost.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
        xhrPost.setRequestHeader(API_KEY, API_TOKEN);
        xhrPost.onreadystatechange = function () {
            if (xhrPost.readyState === COMPLETE) {
                var subStory = jQuery.parseJSON(this.responseText);
                var detailsSubStoryHeader = "Implementeret i";
                var currentStoryDetails = "";
                if (currentStory.details.indexOf(detailsSubStoryHeader) == -1) {
                    currentStoryDetails = currentStory.details + "Implementeret i:";
                }
                currentStoryDetails = currentStory.details + currentStoryDetails + "<br /> - #" + subStory.id + " " + subStory.text;
                var xhrUpdate = new XMLHttpRequest();
                xhrUpdate.open("PUT", getBaseApiUrl() + "/" + getCurrentStoryNo(), CALL_ASYNC);
                xhrUpdate.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
                xhrUpdate.setRequestHeader(API_KEY, API_TOKEN);
                xhrUpdate.send(JSON.stringify({ details: currentStoryDetails }));
                location.reload(true);
            }
        };
        var subStoryText = prompt("Venligst, angiv understorynavn.", "Lorem ipsum...");
        var tag = prompt("Venligst, angiv projekt-tag.", "Lorem ipsum...");
        var subStory = {
            text: subStoryText,
            details: "Laves som en del af #" + getCurrentStoryNo(),
            size: "S",
            phase: currentStory.phase.id,
            owner: currentStory.owner.id,
            tags: [tag]
        };
        xhrPost.send(JSON.stringify(subStory));
    }
};

currentStory = getCurrentStory();
$("#story-toolbar-sub").click(createSubStory);
