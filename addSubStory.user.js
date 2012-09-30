// ==UserScript==
// @author         Martin Rosén-Lidholm
// @version        0.0.0
// @name           Add Sub-story
// @include        https://agilezen.com/*
// @include        http://agilezen.com/*
// @description    Adds sub-story according to the requirements of Telenor MVNO
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function add_jquery(callback) {
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
add_jquery(main);

function main() {
    var addSubButtonHtml = "<button type='button' id='story-toolbar-sub' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>";
    
    $("#story-buttons").append(addSubButtonHtml);

    var createSubStory = function () {
        alert("alerted!");
    };

    $("#story-toolbar-sub").click(createSubStory);
}
