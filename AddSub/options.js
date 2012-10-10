function saveOptions() {
    var apiKey = document.getElementById("api_key").value;
    chrome.storage.sync.set({"api_key": apiKey});

    var status = document.getElementById("status");
    status.innerHTML = "options saved";
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
}

function restoreOptions() {
    chrome.storage.sync.get("api_key",
        function (apiKey) {
            document.getElementById("api_key").value = apiKey.api_key;
        });
}

window.onload = function() {
    document.getElementById("save").addEventListener('click', saveOptions);
    restoreOptions();
};
