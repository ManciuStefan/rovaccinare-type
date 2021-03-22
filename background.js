var onCompleted = function(details) {
  const Http = new XMLHttpRequest();
  const url = details.url;
  console.log(details);
}

chrome.webRequest.onCompleted.addListener(onCompleted, {
  urls: ["https://programare.vaccinare-covid.gov.ro/*"]
}, ["responseHeaders"])
