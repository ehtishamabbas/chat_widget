// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the chat button and chat widget elements
    const chatButton = document.getElementById("open-chat");
    const chatWidget = document.getElementById("chat-widget");
    const closeButton = document.getElementById("toggle-chat");
  
    // Check if the elements are present to avoid errors
    if (chatButton && chatWidget && closeButton) {
      // Function to toggle the visibility of the chat widget
      const toggleChatWidget = () => {
        // Toggle the 'hidden' class on the chat widget
        chatWidget.classList.toggle("hidden");
      };
  
      // When the chat button is clicked, show the chat widget
      chatButton.addEventListener("click", toggleChatWidget);
  
      // When the close button is clicked, hide the chat widget
      closeButton.addEventListener("click", toggleChatWidget);
    }
  });
  