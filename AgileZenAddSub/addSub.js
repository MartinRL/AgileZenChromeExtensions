var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";

$("#story-buttons").append(addSubButtonHtml);

var createSubStory = function() {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open('POST', 'https://agilezen.com/api/v1/projects/41632/stories', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("X-Zen-ApiKey", "f4c92d749eb546c29fc964a7e84c1bfd");
        xhr.onreadystatechange = function() {
            alert(this.responseText);
        };
        xhr.send(JSON.stringify({ text: "test2" }));
    }
};

$("#story-toolbar-sub").click(createSubStory);
