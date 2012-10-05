var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";

$("#story-buttons").append(addSubButtonHtml);

var getProjectNo = function() {
    return "41632";
};

var getAddStoryUrl = function () {
    return "https://agilezen.com/api/v1/projects/" + getProjectNo() + "/stories";
};

var createSubStory = function() {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open("POST", getAddStoryUrl(), true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
        xhr.onreadystatechange = function () {
            // Implementeret i <br> - #
            console.log(this.responseText);
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
        xhr.send(JSON.stringify(subStory));
    }
};

$("#story-toolbar-sub").click(createSubStory);
