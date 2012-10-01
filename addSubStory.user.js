// ==UserScript==
// @author         Martin Rosén-Lidholm
// @version        0.0.0
// @name           Add Sub-story
// @include        https://agilezen.com/*
// @include        http://agilezen.com/*
// @description    Adds sub-story according to the requirements of Telenor MVNO
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//code.jquery.com/jquery-latest.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// load jQuery and execute the main function
addJQuery(main);

function main() {
//    alert($.support.cors);

    var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";
    
    $("#story-buttons").append(addSubButtonHtml);

    var createSubStory = function () {
        $.post("https://agilezen.com/api/v1/projects/41632/stories?apikey=f4c92d749eb546c29fc964a7e84c1bfd", { text: "test" }, function (response) { alert(response); });
//        var xhr = new XMLHttpRequest();
//        xhr.open('POST', 'https://agilezen.com/api/v1/projects/41632/stories?apikey=f4c92d749eb546c29fc964a7e84c1bfd', true);
//        xhr.
//        xhr.onreadystatechange = function () {
//            alert(this.responseText);
//        };
//        xhr.send();
    };

    $("#story-toolbar-sub").click(createSubStory);
}
