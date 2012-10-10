$(document).ready(function() {
    var saveOptions = function() {
        var apiKey = $("#api_key").val();
        var umbrellaDetailsLabel = $("#umbrella_details_label").val();
        chrome.storage.sync.set({
            "api_key": apiKey,
            "umbrella_details_label": umbrellaDetailsLabel
        });

        var status = $("#status");
        status.html("options saved");
        setTimeout(function() {
            status.html("");
        }, 750);
    };

    var restoreOptions = function() {
        chrome.storage.sync.get(null,
            function(options) {
                $("#api_key").val(options.api_key);
                $("#umbrella_details_label").val(options.umbrella_details_label);
            });
    };

    $("#save").click(saveOptions);
    restoreOptions();
});
