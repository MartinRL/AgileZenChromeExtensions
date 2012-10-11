$(document).ready(function() {
    var saveOptions = function() {
        chrome.storage.sync.set({
            "api_key": $("#api_key").val(),
            "umbrella_details_label": $("#umbrella_details_label").val(),
            "substory_details_label": $("#substory_details_label").val(),
            "substory_size": $("#substory_size").val()
        });

        var status = $("#status");
        status.html("options saved");
        setTimeout(function() {
            status.html("");
        }, 750);
    };

    var restoreOptions = function() {
        chrome.storage.sync.get(null,
            function (options) {
                $("#api_key").val(options.api_key);
                $("#umbrella_details_label").val(typeof options.umbrella_details_label === "undefined" ? "Implementeret i" : options.umbrella_details_label);
                $("#substory_details_label").val(typeof options.substory_details_label === "undefined" ? "Laves som en del af" : options.substory_details_label);
                $("#substory_size").val(typeof options.substory_size === "undefined" ? "S" : options.substory_size);
            });
    };

    $("#save").click(saveOptions);
    restoreOptions();
});
