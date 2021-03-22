const injectedScript ="(" +
  function() {
    const getVaccineType = (boosterDays) => {
      switch (boosterDays) {
        case 21:
          return "<b>PFIZER</b>";
        case 28:
          return "<b>MODERNA</b>";
        case 56:
          return "<b>ASTRAZENECA</b>";
        default:
          return "<b>N/A</b>";
      }
    }

    const updateType = (centres) => {
      let spans = [...document.getElementsByClassName("cdk-column-name")];
      console.log(spans)
      centres.forEach(elem => {
        spans.forEach(span => {
          console.log(span.innerText.replace(/[^a-zA-Z ]/g, ""));
          console.log(elem.name.replace(/[^a-zA-Z ]/g, ""));
          if (span.innerText.includes(elem.name.trim().replace(/\s\s/g, " "))) {
            span.innerHTML = "(" + getVaccineType(elem.boosterDays) + ") " + span.innerText;
          }
        })
      })
    }

    const monkeyPatch = () => {
      let oldXHROpen = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
          if (this.__zone_symbol__xhrURL.includes("/scheduling/api/centres")) {
            const responseBody = JSON.parse(this.responseText);
            setTimeout(function () {updateType(responseBody.content);}, 500);
          }
        });
        return oldXHROpen.apply(this, arguments);
      };
    };
    monkeyPatch();
  } + ")();";

const injectScript = () => {
  var script = document.createElement("script");
  script.textContent = injectedScript;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};

function checkForDOM() {
  if (document.body && document.head) {
    injectScript();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);
