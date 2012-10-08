// Saves options to localStorage.
function save_options() {
    console.log("save_options");
    var apiKey = document.getElementById("api_key").value;
    localStorage["api_key"] = apiKey;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "options saved";
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
    console.log("localStorage['api_key']: " + localStorage["api_key"]);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    console.log("restore_options");
    var apiKey = localStorage["api_key"];
    if (!apiKey) {
        return;
    }
    document.getElementById("api_key").value = apiKey;
}
document.addEventListener('DOMContentReady', restore_options);
//document.querySelector('#save').addEventListener('click', save_options);

window.onload = function() {
    document.getElementById("save").addEventListener('click', save_options);
};
