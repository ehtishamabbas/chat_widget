class ChatWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            font-family: Arial, sans-serif;
          }
          .chat-container {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
          }
          .chat-header {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            border-radius: 10px 10px 0 0;
          }
          .chat-body {
            display: flex;
            flex-direction: column;
            padding: 10px;
            height: 250px;
            overflow-y: auto;
          }
          .messages {
            flex-grow: 1;
            overflow-y: auto;
            max-height: 200px;
          }
          .input-container {
            display: flex;
            padding: 5px;
          }
          input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;
          }
          .toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
  
        <button class="toggle-btn">💬</button>
  
        <div class="chat-container">
          <div class="chat-header">Chat with us!</div>
          <div class="chat-body">
            <div class="messages"></div>
            <div class="input-container">
              <input type="text" placeholder="Type a message..." />
              <button class="send-btn">Send</button>
            </div>
          </div>
        </div>
      `;
  
      this.isOpen = false;
      this.initChat();
    }
  
    initChat() {
      const toggleBtn = this.shadowRoot.querySelector(".toggle-btn");
      const chatContainer = this.shadowRoot.querySelector(".chat-container");
      const sendButton = this.shadowRoot.querySelector(".send-btn");
      const inputField = this.shadowRoot.querySelector("input");
      const messages = this.shadowRoot.querySelector(".messages");
  
      toggleBtn.addEventListener("click", () => {
        this.isOpen = !this.isOpen;
        chatContainer.style.display = this.isOpen ? "flex" : "none";
      });
  
      sendButton.addEventListener("click", () => {
        this.sendMessage(inputField.value);
        inputField.value = "";
      });
  
      inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.sendMessage(inputField.value);
          inputField.value = "";
        }
      });
    }
  
    sendMessage(message) {
      if (!message.trim()) return;
  
      const messages = this.shadowRoot.querySelector(".messages");
      const newMessage = document.createElement("div");
      newMessage.textContent = message;
      newMessage.style.padding = "5px";
      newMessage.style.margin = "5px";
      newMessage.style.background = "#f1f1f1";
      newMessage.style.borderRadius = "5px";
  
      messages.appendChild(newMessage);
      messages.scrollTop = messages.scrollHeight;
    }
  }
  
  customElements.define("chat-widget", ChatWidget);
  