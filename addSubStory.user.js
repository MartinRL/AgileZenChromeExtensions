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
//    alert($("#story-buttons").text());
    //    create_add_sub_button();
    $("#story-buttons").append("<button type='button' id='story-toolbar-sub' onclick='create_sub_story();' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>");

    $("#story-toolbar-sub").click(function create_sub_story() {
        alert("alerted!");
    });
}

function create_add_sub_button() {
    $("#story-buttons").append("<button type='button' id='story-toolbar-sub' onclick='create_sub_story();' title='Danne en Small underopgave til denne story'><img src='/content/images/icons/add.png'>Sub</button>");
}

function create_sub_story() {
    alert("alerted!");
}
