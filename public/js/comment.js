$(document).ready(function() {
  // Submit comment form
  $("#commentForm").submit(function(event) {
    event.preventDefault();

    // Retrieve values from the form
    var name = $("#name").val();
    var comment = $("#comment").val();

    // Clear the form
    $("#name").val("");
    $("#comment").val("");

    // Create a new comment element
    var newComment = $("<div>").addClass("comment");
    var commentName = $("<p>").addClass("comment-name").text(name);
    var commentText = $("<p>").addClass("comment-text").text(comment);
    newComment.append(commentName, commentText);

    // Add the new comment to the comment list
    $("#commentList").append(newComment);
  });

  // Close form
  $("#contact-form-container").on("click", "#close-form", function() {
    $("#contact-form-container").hide();
  });

  // Open contact form
  $(".contact-circle").click(function() {
    $("#contact-form-container").show();
  });
});
