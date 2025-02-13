document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById("open-chat");
  const chatWidget = document.getElementById("chat-widget");
  const closeChat = document.getElementById("toggle-chat");
  const widgetHeader = document.getElementsByClassName("chat-header");
  const widgetBody = document.getElementsByClassName("chat-body");
  const messagesBody = document.getElementById("messages");
  const widgetBodyById = document.getElementById("chat-body");
  const widgetLoader = document.getElementsByClassName("chat-loader-overlay");
  const chatInput = document.getElementById("user-message");

  // Get user details from cookies if they exist
  getUserDetails();
  // get the conversation details from the cookie
  let conversations = getConversationDetail();
  const assistantDetails = {
    assistantName: "Alice",
    assistantAvatar: "",
    greetingText: "Hi, I'm Alice. How can I help you today?",
  };

  let messages =  [];
  if (conversations.length > 0) {
    messages = conversations;
  }

  // organization details mock object for the chat widget
  const organizationDetails = {
    name: "Payman Club",
    logo: "",
    description: "Organization Description",
  };

  // render the organization details
  renderOrganizationDetails(organizationDetails);

  // render Assistant Details
  renderAssistantDetails(assistantDetails);

  // render the conversation
  renderMessages(messages, assistantDetails);

  

  // handle unread messages on click and scroll 
  widgetBodyById.addEventListener("click", function () {
    markMessagesAsRead(messages);
    scrollToBottom();
  });

  messagesBody.addEventListener("scroll", function () {
    let separator = document.querySelector(".divider");
    if(widgetBody[0].style.visibility === "visible" && separator){
      console.log("called", widgetBody[0].style.visibility);
      markMessagesAsRead(messages);
    }
  });

  // widget open
  chatIcon.addEventListener("click", function () {
    chatWidget.classList.toggle("visible");
    showWidget(widgetLoader, widgetHeader, widgetBody)
    scrollToBottom();
  });

  // widget close
  closeChat.addEventListener("click", function () {
    chatWidget.classList.remove("visible"); // Close the widget
  });

  // Close chat if clicked outside of widget
  document.addEventListener("click", function (event) {
    if (
      !chatWidget.contains(event.target) &&
      !chatIcon.contains(event.target)
    ) {
      chatWidget.classList.remove("visible");
    }
  });

  // Handle the form phone number section
  document.getElementById("addNextStep").addEventListener("click", function () {
    let userName = document.getElementById("user-name");
    let errorDiv = document.getElementsByClassName("error-message");
    if (isValid(userName.value)) {
      userName.classList.remove("form-input");
      userName.classList.add("form-input-withError");
      errorDiv[0].style.display = "block";
      return;
    } else {
      userName.classList.remove("form-input-withError");
      userName.classList.add("form-input");
      errorDiv[0].style.display = "none";
      // Create and append phone number input section
      addNextStep("");
    }
  });

  // Use event delegation for dynamically added elements for email section
  document
    .getElementById("containerForm")
    .addEventListener("click", handleFormEvents);

  // enable the next button if the user enters the name
  document
    .getElementById("user-name")
    .addEventListener("input", function (event) {
      const button = document.getElementsByClassName("addNextStep");
      if (event.target.value.length > 0) {
        document.getElementById("addNextStep").disabled = false;
        button[0].style.color = "#6C1DCC";
      } else {
        document.getElementById("addNextStep").disabled = true;
        button[0].style.color = "#919EAB";
      }
    });

  // enable the next button
  document.addEventListener("input", function (event) {
    enableNextButton(event);
  });

  // Send message when Enter key is pressed
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(messages);
    }
  });

  // handle the send message
  document
    .getElementById("send-message")
    .addEventListener("click", function () {
      sendMessage(messages);
    });
});

// render the organization details
function renderOrganizationDetails(organizationDetails) {
  if(organizationDetails.logo){
    document.querySelector(".organization-image").src = organizationDetails.logo;
  }
  if( organizationDetails.name){
    document.querySelector(".organization-name").textContent = organizationDetails.name;
  }
}

// render the assistant details
function renderAssistantDetails(assistantDetails) {
  document.getElementById("greetingText").textContent =
    assistantDetails.greetingText;
  document.getElementById("host-name").textContent =
    assistantDetails.assistantName;
    if( assistantDetails.assistantAvatar){
      document.querySelector("#host-image").src = assistantDetails.assistantAvatar ;
    }
}

// get the user details from the cookie
function getUserDetails() {
  const userDetailsCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userDetails="));
  const userDetails = userDetailsCookie
    ? JSON.parse(userDetailsCookie.split("=")[1])
    : null;

  // If user details exist, hide form and show chat
  if (userDetails) {
    const nameInput = document.getElementById("user-name");
    nameInput.value = userDetails.name;
    addNextStep(userDetails.phone);
    handleEmailSection(userDetails.email);
    handleFormSubmission();
  }
}

// add phone number as the next step
function addNextStep(value) {
  // hide the previous button after clicking
  hideElements(".addNextStep");
  // disable input field
  disableInput("user-name");

  const emailSection = createMessageElement(`
    <span>What is your phone number?</span>
    <div class="form-group">
        <div class="form-input-error-container">
          <input type="tel" id="user-phone" placeholder="Enter your phone number" class="form-input user-phone" ${
            value && `value=${value}`
          } />
          <span class="error-message">Please enter a valid phone number.</span>
        </div>
        <button class="next-btn add-email" disabled>Next</button>
    </div>
  `);
  appendAndScroll(emailSection);
}

// next button enable/disable
function enableNextButton(event) {
  if (event.target.id === "user-phone" || event.target.id === "user-email") {
    const buttonClass =
      event.target.id === "user-phone" ? "add-email" : "form-submit";
    const button = document.getElementsByClassName(buttonClass)[0];
    button.disabled = event.target.value.length === 0;
    button.style.color =
      event.target.value.length === 0 ? "#919EAB" : "#6C1DCC";
  }
}

// add email section as next step
function handleEmailSection(value) {
  // Disable previous elements
  hideElements(".add-email");
  disableInput("user-phone");

  // Create and append email input section
  const emailSection = createMessageElement(`
    <span>What is your Email address?</span>
    <div class="form-group">
        <div class="form-input-error-container">
          <input type="email" id="user-email" placeholder="Enter your email" class="form-input" ${
            value && `value=${value}`
          } />
          <span class="error-message">Please enter a valid Email addrress.</span>
        </div>
      <button class="next-btn form-submit" disabled>Submit</button>
    </div>
  `);
  appendAndScroll(emailSection);
}

// handle form submission
function handleFormSubmission() {
  const userDetails = {
    name: document.getElementById("user-name")?.value,
    phone: document.getElementById("user-phone")?.value,
    email: document.getElementById("user-email")?.value,
  };

  if (Object.values(userDetails).some((value) => !value)) {
    alert("Please fill all the fields");
    return;
  }

  hideElements(".form-submit");
  disableInput("user-email");

  // Show completion message
  const completionMessage = createMessageElement(
    "Someone on our team will contact you shortly."
  );

  document.querySelector(".chat-input").style.display = "flex";

  // Convert user details to JSON string and store in cookie
  document.cookie = `userDetails=${JSON.stringify(
    userDetails
  )}; path=/; max-age=86400`; // expires in 24 hours

  appendAndScroll(completionMessage);
}

function createMessageElement(innerHTML) {
  const div = document.createElement("div");
  div.className = "received_message";
  div.innerHTML = innerHTML;
  return div;
}

function hideElements(selector) {
  document
    .querySelectorAll(selector)
    .forEach((el) => (el.style.display = "none"));
}

function disableInput(id) {
  document.getElementById(id).disabled = true;
}

function appendAndScroll(element) {
  document.getElementById("containerForm").appendChild(element);
  scrollToBottom();
}

// scroll to the bottom
function scrollToBottom() {
  let messagesDiv = document.getElementById("messages");
  let separator = document.querySelector(".divider");

  if (separator) {
    // Scroll to separator if it exists (unread messages present)
    separator.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // Otherwise scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

// Function to render messages
function renderMessages(messages, assistantDetails) {
  const chatContainer = document.getElementById("messages");
  const fragment = document.createDocumentFragment();

  messages.forEach((message, index) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "single-thread";

    if (message.isGuest) {
      messageDiv.innerHTML = `<div class="sent"><span>${message.text}</span></div>`;
    } else {
      // Check if this is the first unread message
      let isFirstUnreadMessage =
        !message.isread && !messages.slice(0, index).some((m) => !m.isread);

      if (isFirstUnreadMessage) {
        let separatorBar = document.createElement("div");
        separatorBar.className = "divider";
        separatorBar.innerHTML = `<span>Unread Messages</span>`;
        fragment.appendChild(separatorBar);
      }

      messageDiv.innerHTML = `
      ${
        index + 1 === messages.length || messages[index + 1].isGuest
          ? `<img src="${message.logo ? message.logo: "https://ehtishamabbas.github.io/chat_widget/assets/images/host_default.svg"}" alt="" class="sender-image" id="host-image"> `
          : ""
      }
      <div class="received_message" ${
        index + 1 !== messages.length &&
        !messages[index + 1].isGuest &&
        `style="margin-left: 48px;"`
      }><span>${message.text}</span></div>
      `;

      const hostDiv = document.createElement("div");
      hostDiv.className = "host-name";
      hostDiv.id = "host-name";
      hostDiv.innerHTML = `<span>${assistantDetails.assistantName}</span>`;
      fragment.appendChild(messageDiv);
      if (index + 1 === messages.length || messages[index + 1].isGuest) {
        fragment.appendChild(hostDiv);
      }
      return;
    }

    fragment.appendChild(messageDiv);
  });

  chatContainer.appendChild(fragment);
}

// handle the send message
function sendMessage(messages) {
  let message = document.getElementById("user-message").value;
  if (message) {
    let newDiv = document.createElement("div");
    newDiv.className = "sent";
    newDiv.innerHTML = `
    <span>${message}</span>
    `;

    let newMessage = {
      messageId: generateMessageId(),
      isGuest: true,
      text: message,
      timestamp: new Date().toISOString(),
      status: "read",
    };
    messages.push(newMessage);
    // Convert user details to JSON string and store in cookie
    document.cookie = `conversations=${JSON.stringify(
      messages
    )}; path=/; max-age=86400`; // expires in 24 hours

    document.getElementById("messages").appendChild(newDiv);
    scrollToBottom();
    document.getElementById("user-message").value = "";
  }
}

// check weather the input is valid string or not
const isValid = (value) => {
  // Match number (whole or decimal) OR contains any non-alphanumeric character
  return /^[0-9]+(\.[0-9]+)?$|[^a-zA-Z0-9]/.test(value);
};

// check weather the phone number is valid or not
const isValidNumber = (value) => {
  // Only match strings that are whole numbers
  return /^\d+$/.test(value);
};

// check weather the email is valid or not
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

// main function to handle phone number and email validation
function handleFormEvents(event) {
  if (event.target.classList.contains("add-email")) {
    handlePhoneValidation();
  }
  if (event.target.classList.contains("form-submit")) {
    handleEmailValidation();
  }
}

// validate phone Number
function handlePhoneValidation() {
  const userPhone = document.getElementById("user-phone");
  const isValid = isValidNumber(userPhone.value);

  // to change the classes when the input is valid or not
  toggleInputValidation(userPhone, isValid);

  if (isValid) {
    // add email section
    handleEmailSection();
  }
}

// validate email
function handleEmailValidation() {
  const userEmail = document.getElementById("user-email");
  const isValid = isValidEmail(userEmail.value);

  // to change the classes when the input is valid or not
  toggleInputValidation(userEmail, isValid);

  if (isValid) {
    // handle form submission
    handleFormSubmission();
  }
}

// to change the classes when the input is valid or not
function toggleInputValidation(element, isValid) {
  element.classList.toggle("form-input-withError", !isValid);
  element.classList.toggle("form-input", isValid);
  element.nextElementSibling.style.display = isValid ? "none" : "block";
}

// Function to generate a random message ID
function generateMessageId() {
  return "msg_" + Math.random().toString(36).substr(2, 9);
}

// get the conversation array from the cookie
function getConversationDetail() {
  const conversationCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("conversations="));
  return conversationCookie ? JSON.parse(conversationCookie.split("=")[1]) : [];
}

function markMessagesAsRead(messages) {
  messages.forEach((message) => {
    message.isread = true;
  });
  // Update cookie with read messages
  document.cookie = `conversations=${JSON.stringify(
    messages
  )}; path=/; max-age=86400`;

  // Remove the unread messages divider if it exists
  const divider = document.querySelector(".divider");
  if (divider) {
    divider.remove();
  }
}


function showWidget (widgetLoader, widgetHeader, widgetBody){
  // Show the widget after 2 seconds
  setTimeout(function () {
    widgetLoader[0].style.display = "none";
    widgetHeader[0].style.visibility = "visible";
    widgetBody[0].style.visibility = "visible";
  }, 2000);
}