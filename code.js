// Filter settings
var showAllUsers = false; // Set to true to show all users, set to false to show only "Available" users
var statusToDisplay = "Available"; // Change this to "Away" or "Not Online" if showAllUsers is set to false

// Define a global variable to store all online users and popup status
var allOnlineUsers = [];
var popupVisible = false;

// Function to scrape online users and their profiles
function scrapeOnlineUsers() {
  var userElements = document.querySelectorAll('.up-card-section.up-card-hover');

  userElements.forEach(function (userElement) {
    var nameElement = userElement.querySelector('.identity-name');
    var profileLinkElement = userElement.querySelector('button.up-btn-link');
    var statusElementOnline = userElement.querySelector('span.up-presence-indicator-online');
    var statusElementAway = userElement.querySelector('span.up-presence-indicator-away');
    var status = "Not Online";

    if (nameElement && profileLinkElement) {
      var name = nameElement.innerText.trim();
      var profileLink = profileLinkElement.href;

      if (statusElementOnline) {
        status = "Available";
      } else if (statusElementAway) {
        status = "Away";
      }
      if (showAllUsers || status === statusToDisplay) { // Check if the user should be included based on filter settings
        allOnlineUsers.push({ name: name, profileLink: profileLink, status: status });
      }
      }
  });
}

function clickNextButton() {
  var nextIcon = document.querySelector('.next-icon');

  if (nextIcon) {
    nextIcon.click();
  }
}

// Function to check if the "Next" button is disabled
function isNextButtonDisabled() {
  var nextButton = document.querySelector('.next-icon');

  if (nextButton) {
    var parentButton = nextButton.closest('button.up-pagination-item.up-btn.up-btn-link');
    return parentButton !== null && parentButton.classList.contains('disabled');
  }

  return true; // Return true by default if the next button is not found
}

// Function to close the popup
function closePopup() {
  var popupDiv = document.querySelector("#onlineUsersPopup");
  if (popupDiv) {
    document.body.removeChild(popupDiv);
    popupVisible = false;
  }
}

// Function to make the popup draggable
function makePopupDraggable() {
  var popupDiv = document.querySelector("#onlineUsersPopup");
  if (popupDiv) {
    var isDragging = false;
    var offsetX, offsetY;

    popupDiv.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - popupDiv.getBoundingClientRect().left;
      offsetY = e.clientY - popupDiv.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        popupDiv.style.left = e.clientX - offsetX + "px";
        popupDiv.style.top = e.clientY - offsetY + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
    });
  }
}

// Function to display online users in a pop-up div
function displayOnlineUsersPopup() {
  if (allOnlineUsers.length === 0) {
    console.log("No users are online.");
    return;
  }

  if (popupVisible) {
    return; // Don't create duplicate popups
  }

  popupVisible = true;

  var popupDiv = document.createElement("div");
  popupDiv.style.position = "fixed";
  popupDiv.style.top = "50%";
  popupDiv.style.left = "50%";
  popupDiv.style.transform = "translate(-50%, -50%)";
  popupDiv.style.background = "#fff";
  popupDiv.style.padding = "20px";
  popupDiv.style.zIndex = "9999";
  popupDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popupDiv.style.maxHeight = "80vh";
  popupDiv.style.minWidth = "400px"; // Added minimum width
  popupDiv.style.overflowY = "auto";

  // Add a close button to the popup (at the top)
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "Close";
  closeButton.style.float = "right";
  closeButton.addEventListener("click", closePopup);
  popupDiv.appendChild(closeButton);

  var popupContent = document.createElement("div");
  popupContent.innerHTML = "<h2>Online Users:</h2>";

  allOnlineUsers.forEach(function (user) {
    var userStatus = user.status;
    popupContent.innerHTML += `<p>${user.name} : ${userStatus}</p>`;
  });

  popupDiv.appendChild(popupContent);
  document.body.appendChild(popupDiv);
  popupDiv.id = "onlineUsersPopup"; // Set an ID for the popup
  makePopupDraggable(); // Make the popup draggable
}

// Function to scrape online users, click "Next," and repeat
function scrapeAndClickUntilDisabled() {
  var interval = setInterval(function () {
    console.log("Scraping online users...");
    scrapeOnlineUsers();
    console.log("Clicking 'Next' button...");
    clickNextButton();

    // Check if the "Next" button is disabled
    var isDisabled = isNextButtonDisabled();
    if (isDisabled) {
      clearInterval(interval);
      displayOnlineUsersPopup();
    }
  }, 1000); // Adjust the delay time as needed
}

// Call the function to start scraping and clicking
scrapeAndClickUntilDisabled();

// Debugging
console.log("Script started.");
