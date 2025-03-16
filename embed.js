(function () {
  if (document.getElementById("chat-widget-container")) return; // Prevent duplicates

  // Function to get query parameters from script src
  function getQueryParam(param) {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src.includes("embed.js")) {
        var urlParams = new URLSearchParams(src.split("?")[1]);
        return urlParams.get(param);
      }
    }
    return null;
  }

  var brandId = getQueryParam("brandId");
  var brandName = getQueryParam("brandName");
  var brandLogo = getQueryParam("brandLogo");


  // Create a container div for the chat widget
  var chatContainer = document.createElement("div");
  chatContainer.id = "chat-widget-container";
  chatContainer.setAttribute("data-brand-id", brandId);
  chatContainer.id = "chat-widget-container";
  chatContainer.style.position = "fixed";
  chatContainer.style.bottom = "20px";
  chatContainer.style.right = "20px";
  chatContainer.style.zIndex = "9999";

  // Load the chat widget HTML
  fetch("http://127.0.0.1:5501/index.html")
    .then((response) => response.text())
    .then((html) => {
      // Replace all src and href for assets (including background images and external links)
      html = html.replace(
        /(src|href)="assets\//g,
        `$1="https://ehtishamabbas.github.io/chat_widget/assets/`
      );

      // Update chat-container's innerHTML with the new HTML content
      chatContainer.innerHTML = html;

      // Append styles to the page
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "http://127.0.0.1:5501/style.css";
      document.head.appendChild(link);

      // Append scripts to the page
      var script = document.createElement("script");
      script.src = `http://127.0.0.1:5501/script.js?brandId=${brandId}&brandName=${brandName}&brandLogo=${brandLogo}`;
      document.body.appendChild(script);
    })
    .catch((error) => console.error("Error loading chat widget:", error));

  // Append the container to the body
  document.body.appendChild(chatContainer);
})();
