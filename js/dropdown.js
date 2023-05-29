// Dropdown Functionality
function dropdown() {
    // Toggle dropdown menus
    $(".dropdown-toggle").click(function () {
      $(this).siblings(".dropdown-menu").toggleClass("show");
    });
  
    // Close dropdown menus when clicking outside
    $(document).click(function (event) {
      var target = $(event.target);
      if (!target.closest(".dropdown").length) {
        $(".dropdown-menu").removeClass("show");
      }
    });
  }
  
  // Call the dropdown function
  $(document).ready(function () {
    dropdown();
  });
  