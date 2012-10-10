function saveOptions() {
    var apiKey = document.getElementById("api_key").value;
    var umbrellaDetailsLabel = document.getElementById("umbrella_details_label").value;
    chrome.storage.sync.set({
        "api_key": apiKey,
        "umbrella_details_label": umbrellaDetailsLabel
    });

    var status = document.getElementById("status");
    status.innerHTML = "options saved";
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
}

function restoreOptions() {
    chrome.storage.sync.get(null,
        function (options) {
            document.getElementById("api_key").value = options.api_key;
            document.getElementById("umbrella_details_label").value = options.umbrella_details_label;
        });
}

window.onload = function() {
    document.getElementById("save").addEventListener('click', saveOptions);
    restoreOptions();
};
