(function () {
    // Prevent duplicates of the chat widget
    if (document.getElementById("chat-widget-container")) return;

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

    // Open/Close widget functionality
    document.addEventListener("DOMContentLoaded", function () {
        const chatButton = document.getElementById("open-chat");
        const chatWidget = document.getElementById("chat-widget");
        const closeButton = document.getElementById("toggle-chat");

        // If the elements exist, add event listeners
        if (chatButton && chatWidget && closeButton) {
            const toggleChatWidget = () => {
                chatWidget.classList.toggle("hidden");
            };

            // Open chat on button click
            chatButton.addEventListener("click", toggleChatWidget);

            // Close chat on close button click
            closeButton.addEventListener("click", toggleChatWidget);
        }
    });
})();
