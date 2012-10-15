var options;
var currentStory;
var findResults = {
    found: 0,
    notFound: -1
};
var ALL = null;
var ids = {
    addSubExtensionInfoArea: "add-sub-extension-info-area",
    storyToolbarSub: "story-toolbar-sub",
    storyButtons: "story-buttons"
};
var elementHtmls = {
    addSubButtonHtml: "<button type='button' id='" + ids.storyToolbarSub + "' title='Create sub-story to this story'><img src='/content/images/icons/add.png'>Sub</button>",
    extensionInfoAreaHtml: "<div id='" + ids.addSubExtensionInfoArea + "' class='order-title' style='display: none;'></div>"
};
var currentUrlSplitBySlash = window.location.pathname.split("/");

var insertExtensionElements = function() {
    $("#" + ids.storyButtons).append(elementHtmls.addSubButtonHtml);
    $("#" + ids.storyButtons).after(elementHtmls.extensionInfoAreaHtml);
    $("#" + ids.storyToolbarSub).click(createSubStoryWorkflow);
};

var setAjaxDefaults = function () {
    jQuery.ajaxSetup({
        xhrFields: { withCredentials: true },
        beforeSend: function (xhr) { xhr.setRequestHeader("X-Zen-ApiKey", options.api_key); },
    });
};

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

var setCurrentStory = function () {
    $.ajax({
        type: "GET",
        url: getBaseApiUrl() + "/" + getCurrentStoryNo() + "?with=details",
    }).then(function (response) {
        currentStory = response;
    });
};

var checkApiKey = function () {
    var addSubExtensionInfoArea = $("#" + ids.addSubExtensionInfoArea);
    if (typeof options.api_key === "undefined" || options.api_key === "") {
        var optionsUrl = chrome.extension.getURL("options.html");
        addSubExtensionInfoArea.html("AgileZen API key is missing! Add yours on <a href='" + optionsUrl + "' target='_blank'>the options page.</a>");
        addSubExtensionInfoArea.css("display", "");

        return false;
    }

    addSubExtensionInfoArea.css("display", "none");
    return true;
};

var refreshPage = function () {
    var FORCE_GET = true;
    location.reload(FORCE_GET);
};

var updateCurrentStory = function (subStory) {
    var subStoryInfoOfCurrentStoryDetails = "";
    if (currentStory.details.indexOf(options.umbrella_details_label) === findResults.notFound) {
        subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br />" + options.umbrella_details_label + ":";
    }
    subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br /> - #" + subStory.id + " " + subStory.text;
    var updateCurrentStoryDetails = {
        type: "PUT",
        url: getBaseApiUrl() + "/" + getCurrentStoryNo(),
        dataType: "json",
        data: JSON.stringify({ details: currentStory.details + subStoryInfoOfCurrentStoryDetails })
    };
    $.ajax(updateCurrentStoryDetails);
};

var getSubStory = function() {
    var subStoryText = prompt("Please, state a sub-story name!", "Lorem ipsum");
    var tags = prompt("Please, state a the story tags (comma-separated).", "").split(",");
    $.each(tags, function (index, tag) { tag.trim(); });
    var subStory = {
        text: subStoryText,
        details: options.substory_details_label + " #" + getCurrentStoryNo(),
        size: options.substory_size,
        phase: currentStory.phase.id,
        owner: currentStory.owner.id
    };
    if (tags.indexOf("") !== findResults.found) {
        subStory.tags = tags;
    }

    return subStory;
};

var createSubStoryWorkflow = function () {
    if (!checkApiKey()) return;

    var subStory = getSubStory();
    var createSubStoryDetails = {
        type: "POST",
        url: getBaseApiUrl(),
        dataType: "json",
        data: JSON.stringify(subStory)
    };

    $.ajax(createSubStoryDetails)
     .then(updateCurrentStory)
     .then(refreshPage);
};

insertExtensionElements();

setAjaxDefaults();

setOptions(setCurrentStory);

chrome.storage.onChanged.addListener(
    function (changes, namespace) {
        setOptions(function() {});
    });
