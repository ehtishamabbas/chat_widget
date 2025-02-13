(function () {
    if (document.getElementById("chat-widget-container")) return; // Prevent duplicates

    // Create a container div for the chat widget
    var chatContainer = document.createElement("div");
    chatContainer.id = "chat-widget-container";
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "20px";
    chatContainer.style.right = "20px";
    chatContainer.style.zIndex = "9999";

    // Load the chat widget HTML
    fetch("https://ehtishamabbas.github.io/chat_widget/index.html") 
        .then(response => response.text())
        .then(html => {
            chatContainer.innerHTML = html;


            // Fix relative asset paths (only needed if they don't load properly)
            chatContainer.innerHTML = chatContainer.innerHTML.replace(/(src|href)="assets\//g, `$1="https://ehtishamabbas.github.io/chat_widget/assets/`);

            // Append styles to the page
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://ehtishamabbas.github.io/chat_widget/style.css";
            document.head.appendChild(link);

            // Append scripts to the page
            var script = document.createElement("script");
            script.src = "https://ehtishamabbas.github.io/chat_widget/script.js";
            document.body.appendChild(script);
        })
        .catch(error => console.error("Error loading chat widget:", error));

    // Append the container to the body
    document.body.appendChild(chatContainer);
})();
