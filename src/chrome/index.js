chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {
            cancel: details.url.indexOf("wikipedia") !== -1
        };
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]);
