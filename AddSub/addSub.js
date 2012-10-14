var API_KEY = "X-Zen-ApiKey";
var options;
var COMPLETE = 4;
var NOT_FOUND = -1;
var ALL = null;
var CALL_SYNC = false;
var ADD_SUB_EXTENSION_INFO_AREA_ID = "add-sub-extension-info-area";
var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Create sub-story to this story'><img src='/content/images/icons/add.png'>Sub</button>";
var extensionInfoAreaHtml = "<div id='" + ADD_SUB_EXTENSION_INFO_AREA_ID + "' class='order-title' style='display: none;'></div>";
var currentStory;
var currentUrlSplitBySlash = window.location.pathname.split("/");

$("#story-buttons").append(addSubButtonHtml);
$("#story-buttons").after(extensionInfoAreaHtml);

var setOptions = function(continuation) {
    chrome.storage.sync.get(ALL,
        function(opt) {
            options = opt;
            continuation();
        });
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

XMLHttpRequest.prototype.withCredentialsIsIn = function () {
    return "withCredentials" in this;
};

var setCurrentStory = function () {
    $.ajax({
        type: "GET",
        url: getBaseApiUrl() + "/" + getCurrentStoryNo() + "?with=details",
        beforeSend: function (xhr) { xhr.setRequestHeader(API_KEY, options.api_key); },
        xhrFields: { withCredentials: true }
    }).then(function (response) {
        currentStory = response;
        console.log(currentStory);
    });
};

var checkApiKey = function () {
    setOptions(function () {});
    var addSubExtensionInfoArea = $("#" + ADD_SUB_EXTENSION_INFO_AREA_ID);
    if (typeof options.api_key === "undefined" || options.api_key === "") {
        var optionsUrl = chrome.extension.getURL("options.html");
        addSubExtensionInfoArea.html("AgileZen API key is missing! Add yours on <a href='" + optionsUrl + "' target='_blank'>the options page.</a>");
        addSubExtensionInfoArea.css("display", "");

        return false;
    }

    addSubExtensionInfoArea.css("display", "none");
    return true;
};

var createSubStory = function () {
    if (!checkApiKey()) return;
    var xhrPost = new XMLHttpRequest();
    if (xhrPost.withCredentialsIsIn()) {
        xhrPost.open("POST", getBaseApiUrl(), CALL_SYNC);
        var CONTENT_TYPE = "Content-Type";
        var APPLICATION_JSON = "application/json";
        xhrPost.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
        xhrPost.setRequestHeader(API_KEY, options.api_key);
        xhrPost.onreadystatechange = function () {
            if (xhrPost.readyState === COMPLETE) {
                var subStory = jQuery.parseJSON(this.responseText);
                var subStoryInfoOfCurrentStoryDetails = "";
                if (currentStory.details.indexOf(options.umbrella_details_label) == NOT_FOUND) {
                    subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br />" + options.umbrella_details_label + ":";
                }
                subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br /> - #" + subStory.id + " " + subStory.text;
                var xhrUpdate = new XMLHttpRequest();
                xhrUpdate.open("PUT", getBaseApiUrl() + "/" + getCurrentStoryNo(), CALL_SYNC);
                xhrUpdate.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
                xhrUpdate.setRequestHeader(API_KEY, options.api_key);
                xhrUpdate.send(JSON.stringify({ details: currentStory.details + subStoryInfoOfCurrentStoryDetails }));
                location.reload(true);
            }
        };
        var subStoryText = prompt("Venligst, angiv understorynavn.", "Lorem ipsum...");
        var tag = prompt("Venligst, angiv projekt-tag.", "Lorem ipsum...");
        var subStory = {
            text: subStoryText,
            details: options.substory_details_label + " #" + getCurrentStoryNo(),
            size: options.substory_size,
            phase: currentStory.phase.id,
            owner: currentStory.owner.id,
            tags: [tag]
        };
        xhrPost.send(JSON.stringify(subStory));
    }
};

setOptions(setCurrentStory);
$("#story-toolbar-sub").click(createSubStory);
