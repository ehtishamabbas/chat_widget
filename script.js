document.addEventListener("DOMContentLoaded", async function () {
  const chatContainer = document.getElementById("chat-widget-container");
  const brandId = chatContainer
    ? chatContainer.getAttribute("data-brand-id")
    : null;
  const chatIcon = document.getElementById("open-chat");
  const widgetIcon = document.getElementById("chat-icon");
  const chatWidget = document.getElementById("chat-widget");
  const closeChat = document.getElementById("toggle-chat");
  const widgetHeader = document.getElementsByClassName("chat-header");
  const widgetBody = document.getElementsByClassName("chat-body");
  const messagesBody = document.getElementById("messages");
  const widgetBodyById = document.getElementById("chat-body");
  const widgetLoader = document.getElementsByClassName("chat-loader-overlay");
  const chatInput = document.getElementById("user-message");

  var brandName = getQueryParam("brandName");
  var brandLogo = getQueryParam("brandLogo");

  if (Boolean(brandId)) {
    localStorage.setItem("brandId", brandId);
  }

  let widgetSettings = await getChatWidgetSettings(brandId);

  if (
    widgetSettings &&
    Object.keys(widgetSettings).length > 0 &&
    widgetSettings.widget_enabled
  ) {
    widgetIcon.style.visibility = "visible";
  }

  // Get user details from cookies if they exist
  getUserDetails();

  // get the conversation details from the cookie
  let conversations = await getConversationDetail();
  const assistantDetails = {
    assistantName: "Alice",
    assistantAvatar: "",
    greetingText: widgetSettings.greeting_text
      ? widgetSettings.greeting_text
      : "",
  };

  let messages = [];
  if (conversations.length > 0) {
    messages = conversations;
  }

  // render the organization details
  renderOrganizationDetails(brandName, brandLogo);

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
    if (widgetBody[0].style.visibility === "visible" && separator) {
      markMessagesAsRead(messages);
    }
  });

  // widget open
  chatIcon.addEventListener("click", async function () {
    chatWidget.classList.toggle("visible");
    showWidget(widgetLoader, widgetHeader, widgetBody);
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
    let userName = document.getElementById("first-name");
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
    .getElementById("first-name")
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
      widgetLoader[0].style.display = "flex";
      sendMessage(messages, widgetLoader);
    }
  });

  // handle the send message
  document
    .getElementById("send-message")
    .addEventListener("click", function () {
      widgetLoader[0].style.display = "flex";
      sendMessage(messages, widgetLoader);
    });
});

// render the organization details
function renderOrganizationDetails(brandName, brandLogo) {
  if (brandLogo) {
    document.querySelector(".organization-image").src = brandLogo;
  }
  if (brandName) {
    document.querySelector(".organization-name").textContent = brandName;
  }
}

// render the assistant details
function renderAssistantDetails(assistantDetails) {
  document.getElementById("greetingText").textContent =
    assistantDetails.greetingText;
  document.getElementById("host-name").textContent =
    assistantDetails.assistantName;
  if (assistantDetails.assistantAvatar) {
    document.querySelector("#host-image").src =
      assistantDetails.assistantAvatar;
  }
}

// get the user details from the cookie
function getUserDetails() {
  let userDetails = getUserDetailsFromCookies();

  // If user details exist, hide form and show chat
  if (userDetails) {
    const nameInput = document.getElementById("first-name");
    nameInput.value = userDetails.firstName;
    addNextStep(userDetails.lastName);
    addPhoneStep(userDetails.phone);
    handleEmailSection(userDetails.email);
    handleFormSubmission();
  }
}

// add phone number as the next step
function addNextStep(value) {
  // hide the previous button after clicking
  hideElements(".addNextStep");
  // disable input field
  disableInput("first-name");

  const lastNameSection = createMessageElement(`
    <span>Please enter your last name</span>
    <div class="form-group">
        <div class="form-input-error-container">
          <input type="tel" id="last-name" placeholder="Enter your last name" class="form-input last-name" ${
            value && `value=${value}`
          } />
          <span class="error-message last-name-error">Please enter a valid last name.</span>
        </div>
        <button class="next-btn add-phone" disabled>Next</button>
    </div>
  `);
  appendAndScroll(lastNameSection);
}

function addPhoneStep(value) {
  // hide the previous button after clicking
  hideElements(".add-phone");
  // disable input field
  disableInput("last-name");

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
  if (
    event.target.id === "last-name" ||
    event.target.id === "user-phone" ||
    event.target.id === "user-email"
  ) {
    const buttonClass =
      event.target.id === "user-phone"
        ? "add-email"
        : event.target.id === "last-name"
        ? "add-phone"
        : "form-submit";
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
async function handleFormSubmission() {
  const userDetails = {
    firstName: document.getElementById("first-name")?.value,
    lastName: document.getElementById("last-name")?.value,
    phone: document.getElementById("user-phone")?.value,
    email: document.getElementById("user-email")?.value,
  };
  if (Object.values(userDetails).some((value) => !value)) {
    alert("Please fill all the fields");
    return;
  }

  hideElements(".form-submit");
  disableInput("user-email");
  document.querySelector(".chat-input").style.display = "flex";

  // Convert user details to JSON string and store in cookie
  document.cookie = `userDetails=${JSON.stringify(userDetails)}; path=/`;
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
      messageDiv.style.width = "85%";

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
          ? `<img src="${
              message.logo
                ? message.logo
                : "https://ehtishamabbas.github.io/chat_widget/assets/images/host_default.svg"
            }" alt="" class="sender-image" id="host-image"> `
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
async function sendMessage(messages, widgetLoader) {
  let message = document.getElementById("user-message").value;
  let userDetails = getUserDetailsFromCookies();
  const brand_id = localStorage.getItem("brandId");

  if (message) {
    const payload = {
      brand_id: parseInt(brand_id),
      booking_id: null,
      property_id: null,
      contact_id: null,
      email: userDetails.email,
      phone: userDetails.phone,
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
      middle_name: null,
      message_body: message,
      sender_type: "guest",
      message_type: "chat_widget",
    };

    await initiateWidget(payload);

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
    if (messages.length > 0) {
      messages.push(newMessage);
      document.getElementById("messages").appendChild(newDiv);
    } else {
      messages.push(newMessage);
      document.getElementById("messages").appendChild(newDiv);

      addHostMessage();
      messages.push({
        ...newMessage,
        isGuest: false,
        text: "Someone on our team will contact you shortly.",
      });
    }
    // Convert user details to JSON string and store in cookie
    document.cookie = `conversations=${JSON.stringify(messages)}; path=/`;

    scrollToBottom();
    document.getElementById("user-message").value = "";
    widgetLoader[0].style.display = "none";
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
  if (event.target.classList.contains("add-phone")) {
    handleLastName();
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

// validate last name
function handleLastName() {
  let lastName = document.getElementById("last-name");
  let errorDiv = document.getElementsByClassName("last-name-error");
  if (isValid(lastName.value)) {
    lastName.classList.remove("form-input");
    lastName.classList.add("form-input-withError");
    errorDiv[0].style.display = "block";
    return;
  } else {
    lastName.classList.remove("form-input-withError");
    lastName.classList.add("form-input");
    errorDiv[0].style.display = "none";
    addPhoneStep("");
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
async function getConversationDetail() {
  const conversationCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("conversations="));
  const cookiesConversations = conversationCookie
    ? JSON.parse(conversationCookie.split("=")[1])
    : [];
  const contactInfo = document.cookie
    .split("; ")
    .find((row) => row.startsWith("contactInfo="));

  const contactDetail = contactInfo
    ? JSON.parse(contactInfo.split("=")[1])
    : [];
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(
      `http://localhost:8000/apis/inbox/conversation/${contactDetail.conversationId}/messages?contact_id=${contactDetail.contactId}&draft=false`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Merge and sort conversations
    const allConversations = [...cookiesConversations, ...data];   

    const updatedConversation = allConversations.map((item) => ({
      isGuest: item.isGuest !== undefined ? item.isGuest : item.is_income,
      isread: item.isread !== undefined ? item.isread : false,
      messageId: item.id !== undefined ? item.id : item.messageId,
      status: "unread",
      text: item.message_body !== undefined ? item.message_body : item.text,
      timestamp: item.created_at !== undefined ? item.created_at : item.timestamp,
    }));
    
    const uniqueConversations = Array.from(
      new Map(updatedConversation.map((item) => [item.text, item])).values()
    );

    uniqueConversations.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    return uniqueConversations;
  } catch (error) {
    return cookiesConversations;
  }
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

function showWidget(widgetLoader, widgetHeader, widgetBody) {
  widgetLoader[0].style.display = "none";
  widgetHeader[0].style.visibility = "visible";
  widgetBody[0].style.visibility = "visible";
}

async function addHostMessage() {
  const hostImageUrl =
    "https://ehtishamabbas.github.io/chat_widget/assets/images/host_default.svg";
  const responseMessage = "Someone on our team will contact you shortly.";

  // Create message thread container
  const threadContainer = document.createElement("div");
  threadContainer.className = "single-thread";
  threadContainer.style.width = "85%";

  // Create host message content
  const messageContent = `
    <img
      src="${hostImageUrl}"
      alt="Host"
      class="sender-image"
      id="host-image"
    />
    <div class="received_message">
      <span>${responseMessage}</span>
    </div>
  `;
  threadContainer.innerHTML = messageContent;

  // Create host name container
  const hostNameContainer = document.createElement("div");
  hostNameContainer.className = "host-name";
  hostNameContainer.id = "host-name";
  hostNameContainer.innerHTML = "<span>Assistant</span>";

  // Append elements to messages container
  const messagesContainer = document.getElementById("messages");
  messagesContainer.appendChild(threadContainer);
  messagesContainer.appendChild(hostNameContainer);
}

async function initiateWidget(payload) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      "http://localhost:8000/apis/ggwidget/initiate-widget",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Widget initiated successfully:", data);

    const contactObject = {
      contactId: data.response.data.contact.unified_contact_id,
      conversationId: data.response.data.conversation.unified_conversation_id,
    };

    // Convert user details to JSON string and store in cookie
    document.cookie = `contactInfo=${JSON.stringify(contactObject)}; path=/`;
  } catch (error) {
    console.error("Error initiating widget:", error);
  }
}

async function getChatWidgetSettings(brandId) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:8000/apis/ggwidget/get/${brandId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.response) {
      return { ...data.response.data };
    } else {
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ getChatWidgetSettings ~ error:", error);
    return null;
  }
}

function getUserDetailsFromCookies() {
  const userDetailsCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userDetails="));
  const userDetails = userDetailsCookie
    ? JSON.parse(userDetailsCookie.split("=")[1])
    : null;

  return userDetails;
}

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
