// ==UserScript==
// @author         Martin Rosén-Lidholm
// @version        0.0.0
// @name           Add Sub-story
// @include        https://agilezen.com/*
// @description    Adds sub-story according to the requirements of Telenor MVNO
// @require        http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function () {
    $('#top-panel').append('<button type="button" id="story-toolbar-delete" title="Permanently delete this story"><img src="/content/images/icons/delete.png">Delete</button>');
}());
