// Dropdown.js

// Function to handle the dropdown menus
function handleDropdown() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Loop through each dropdown toggle
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the corresponding dropdown menu
      const dropdownMenu = this.nextElementSibling;

      // Toggle the 'show' class on the dropdown menu
      dropdownMenu.classList.toggle('show');
    });
  });
}

// Close the dropdown menus when clicking outside
window.addEventListener('click', function (e) {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  // Loop through each dropdown menu
  dropdownMenus.forEach((menu) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});

// Prevent scrolling when dropdown menus are open
document.addEventListener('DOMContentLoaded', function () {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  // Loop through each dropdown menu
  dropdownMenus.forEach((menu) => {
    menu.addEventListener('scroll', function (e) {
      e.stopPropagation();
    });
  });
});

// Call the function to handle the dropdown menus
handleDropdown();
