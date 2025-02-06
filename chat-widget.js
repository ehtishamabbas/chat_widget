document.addEventListener("DOMContentLoaded", function () {
  // Create and style the widget elements
  const chatWidget = document.createElement('div');
  chatWidget.style.position = 'fixed';
  chatWidget.style.bottom = '20px';
  chatWidget.style.right = '20px';
  chatWidget.style.width = '300px';
  chatWidget.style.fontFamily = 'Arial, sans-serif';

  // Create the chat container
  const chatContainer = document.createElement('div');
  chatContainer.style.backgroundColor = '#fff';
  chatContainer.style.borderRadius = '10px';
  chatContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  chatContainer.style.display = 'none'; // Initially hidden
  chatContainer.style.flexDirection = 'column';

  // Create the chat header
  const chatHeader = document.createElement('div');
  chatHeader.textContent = 'Chat with us!';
  chatHeader.style.backgroundColor = '#007bff';
  chatHeader.style.color = 'white';
  chatHeader.style.padding = '10px';
  chatHeader.style.textAlign = 'center';
  chatHeader.style.cursor = 'pointer';
  chatHeader.style.borderRadius = '10px 10px 0 0';

  // Create the chat body
  const chatBody = document.createElement('div');
  chatBody.style.display = 'flex';
  chatBody.style.flexDirection = 'column';
  chatBody.style.padding = '10px';
  chatBody.style.height = '250px';
  chatBody.style.overflowY = 'auto';

  // Create the messages area
  const messages = document.createElement('div');
  messages.style.flexGrow = '1';
  messages.style.overflowY = 'auto';
  messages.style.maxHeight = '200px';

  // Create the input container
  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.padding = '5px';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Type a message...';
  inputField.style.flexGrow = '1';
  inputField.style.padding = '10px';
  inputField.style.border = '1px solid #ccc';
  inputField.style.borderRadius = '5px';

  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.style.backgroundColor = '#007bff';
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.padding = '10px';
  sendButton.style.borderRadius = '5px';
  sendButton.style.cursor = 'pointer';
  sendButton.style.marginLeft = '5px';

  // Create the toggle button for showing/hiding the chat
  const toggleButton = document.createElement('button');
  toggleButton.textContent = '💬';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '20px';
  toggleButton.style.right = '20px';
  toggleButton.style.backgroundColor = '#007bff';
  toggleButton.style.color = 'white';
  toggleButton.style.border = 'none';
  toggleButton.style.padding = '10px';
  toggleButton.style.borderRadius = '50%';
  toggleButton.style.width = '50px';
  toggleButton.style.height = '50px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.fontSize = '16px';

  // Append elements to the DOM
  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);
  chatBody.appendChild(messages);
  chatBody.appendChild(inputContainer);
  chatContainer.appendChild(chatHeader);
  chatContainer.appendChild(chatBody);
  chatWidget.appendChild(toggleButton);
  chatWidget.appendChild(chatContainer);
  document.body.appendChild(chatWidget);

  // Toggle chat container visibility
  let isChatOpen = false;
  toggleButton.addEventListener('click', () => {
      isChatOpen = !isChatOpen;
      chatContainer.style.display = isChatOpen ? 'flex' : 'none';
  });

  // Send message when the send button is clicked
  sendButton.addEventListener('click', () => {
      sendMessage(inputField.value);
      inputField.value = ''; // Clear input field after sending
  });

  // Send message when "Enter" key is pressed
  inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          sendMessage(inputField.value);
          inputField.value = ''; // Clear input field after sending
      }
  });

  // Function to append a new message to the chat
  function sendMessage(message) {
      if (!message.trim()) return;

      const newMessage = document.createElement('div');
      newMessage.textContent = message;
      newMessage.style.padding = '5px';
      newMessage.style.margin = '5px';
      newMessage.style.background = '#f1f1f1';
      newMessage.style.borderRadius = '5px';
      messages.appendChild(newMessage);
      messages.scrollTop = messages.scrollHeight; // Scroll to the latest message
  }
});
