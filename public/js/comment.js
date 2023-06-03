// Get the comment form element
const commentForm = document.getElementById('comment-form');

// Get the container for comments
const commentsContainer = document.getElementById('comments-list');

// Store the edited comment ID for reference
let editedCommentId = null;

// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');

  if (!isLoggedIn) {
    // Display an error message if the user is not logged in
    const errorNotification = document.getElementById('error-notification');
    errorNotification.textContent = 'Please log in to make a comment.';
    errorNotification.style.display = 'block';
    return;
  }

  // Get the input values
  const name = username;
  const comment = document.getElementById('comment').value;

  if (!editedCommentId && (name.trim() === '' || comment.trim() === '')) {
    // Validate the inputs for new comments only
    const errorMessage = document.getElementById('error-notification');
    errorMessage.textContent = 'Please fill in all fields.';
    errorMessage.style.display = 'block';
    return;
  }

  if (editedCommentId) {
    // Editing an existing comment
    const commentElement = document.getElementById(`comment-${editedCommentId}`);
    const commentTextElement = commentElement.querySelector('.comment-text');
    commentTextElement.textContent = comment;
    commentForm.reset();
    editedCommentId = null;
    showSuccessNotification('Comment updated successfully!');
  } else {
    // Creating a new comment
    const newComment = createCommentElement(name, comment);
    commentsContainer.prepend(newComment);
    commentForm.reset();
    showSuccessNotification('Comment submitted successfully!');
  }

  // Send the comment to the server
  try {
    const method = editedCommentId ? 'PUT' : 'POST';
    const url = editedCommentId ? `/comments/${editedCommentId}` : '/comments';
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit comment');
    }
  } catch (error) {
    console.error('Failed to submit comment:', error);
  }
};

// Function to create a comment element
const createCommentElement = (name, comment, commentId) => {
  const commentElement = document.createElement('div');
  commentElement.id = `comment-${commentId}`;
  commentElement.classList.add('comment');
  commentElement.innerHTML = `
    <div class="comment-content">
      <h4 class="comment-author">${name}</h4>
      <p class="comment-text">${comment}</p>
    </div>
    <div class="comment-actions">
      <button class="comment-edit" onclick="editComment(${commentId})">Edit</button>
      <button class="comment-delete" onclick="deleteComment(${commentId})">Delete</button>
    </div>
    <hr>
  `;
  return commentElement;
};

// Function to fetch existing comments
const fetchComments = async () => {
  try {
    const response = await fetch('/comments');
    if (response.ok) {
      const comments = await response.json();
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const username = localStorage.getItem('username');
      displayComments(comments, isLoggedIn, username);
    } else {
      console.error('Failed to fetch comments');
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
};

// Function to display comments
const displayComments = (comments, isLoggedIn, username) => {
  commentsContainer.innerHTML = ''; // Clear previous comments

  comments.forEach((comment) => {
    const { id, name, comment: text } = comment;

    const commentElement = createCommentElement(name, text, id);

    // Show edit and delete buttons only for the user's own comments
    const commentActions = commentElement.querySelector('.comment-actions');
    if (isLoggedIn && username === name) {
      commentActions.innerHTML = `
        <button class="comment-edit" onclick="editComment(${id})">Edit</button>
        <button class="comment-delete" onclick="deleteComment(${id})">Delete</button>
      `;
    } else {
      commentActions.innerHTML = ''; // Hide the edit and delete buttons
    }

    commentsContainer.appendChild(commentElement);
  });

  // Populate the name field with the username if the user is logged in
  const nameField = document.getElementById('name');
  if (isLoggedIn) {
    nameField.value = username;
    nameField.setAttribute('readonly', true); // Make the name field read-only
  } else {
    nameField.value = '';
    nameField.removeAttribute('readonly'); // Remove the read-only attribute
  }
};

// Function to edit a comment
const editComment = (commentId) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  const commentTextElement = commentElement.querySelector('.comment-text');

  // Enable editing mode
  commentTextElement.contentEditable = true;
  commentTextElement.focus();

  // Store the comment ID being edited
  editedCommentId = commentId;
};

// Function to delete a comment
const deleteComment = async (commentId) => {
  // Display a confirmation popup
  if (confirm('Are you sure you want to delete this comment?')) {
    try {
      const response = await fetch(`/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the comment element from the DOM
        const commentElement = document.getElementById(`comment-${commentId}`);
        commentElement.remove();
        showSuccessNotification('Comment deleted successfully!');
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      showErrorNotification('Failed to delete comment. Please try again.');
    }
  }
};

// Add event listener to the form submit event
commentForm.addEventListener('submit', handleFormSubmit);

// Fetch and display existing comments
fetchComments();
