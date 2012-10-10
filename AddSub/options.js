function saveOptions() {
    console.log("saveOptions");
    var apiKey = document.getElementById("api_key").value;
    chrome.storage.sync.set({"api_key": apiKey});

    var status = document.getElementById("status");
    status.innerHTML = "options saved";
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);

    chrome.storage.sync.get("api_key",
        function(val) {
            console.log("chrome.storage.sync.get['api_key']: " + JSON.stringify(val));
        });
}

function restoreOptions() {
    console.log("restoreOptions");
    chrome.storage.sync.get("api_key",
        function (apiKey) {
            console.log("chrome.storage.sync.get['api_key']: " + JSON.stringify(apiKey));
            document.getElementById("api_key").value = apiKey.api_key;
        });
}

window.onload = function() {
    document.getElementById("save").addEventListener('click', saveOptions);
    restoreOptions();
};
