var options;
var currentStory;
var findResults = {
    found: 0,
    notFound: -1
};
var ALL = null;
var ids = {
    addSubExtensionInfoArea: "add-sub-extension-info-area",
    storyToolbarSub: "story-toolbar-sub"
};
var addSubButtonHtml = "<button type='button' id='" + ids.storyToolbarSub + "' title='Create sub-story to this story'><img src='/content/images/icons/add.png'>Sub</button>";
var extensionInfoAreaHtml = "<div id='" + ids.addSubExtensionInfoArea + "' class='order-title' style='display: none;'></div>";
var currentUrlSplitBySlash = window.location.pathname.split("/");

$("#story-buttons").append(addSubButtonHtml);
$("#story-buttons").after(extensionInfoAreaHtml);

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

XMLHttpRequest.prototype.withCredentialsIsIn = function () {
    return "withCredentials" in this;
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

var createSubStory = function () {
    if (!checkApiKey()) return;

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
    console.log(tags.indexOf(""));
    if (tags.indexOf("") !== findResults.found) {
        subStory.tags = tags;
    }
    console.log(subStory);

    $.ajax({
        type: "POST",
        url: getBaseApiUrl(),
        dataType: "json",
        data: JSON.stringify(subStory)
    }).then(function (subStory) {
        var subStoryInfoOfCurrentStoryDetails = "";
        if (currentStory.details.indexOf(options.umbrella_details_label) === findResults.notFound) {
            subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br />" + options.umbrella_details_label + ":";
        }
        subStoryInfoOfCurrentStoryDetails = subStoryInfoOfCurrentStoryDetails + "<br /> - #" + subStory.id + " " + subStory.text;
        $.ajax({
            type: "PUT",
            url: getBaseApiUrl() + "/" + getCurrentStoryNo(),
            dataType: "json",
            data: JSON.stringify({ details: currentStory.details + subStoryInfoOfCurrentStoryDetails })
        }).then(function() {
            location.reload(true);
        });
    });
};

setAjaxDefaults();

setOptions(setCurrentStory);

$("#" + ids.storyToolbarSub).click(createSubStory);

chrome.storage.onChanged.addListener(
    function (changes, namespace) {
        setOptions(function() {});
    });
