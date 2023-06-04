
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments-list');
let editedCommentId = null;

// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');
  if (!isLoggedIn) {
    const errorNotification = document.getElementById('error-notification');
    errorNotification.textContent = 'Please log in to make a comment.';
    errorNotification.style.display = 'block';
    setTimeout(() => {
      errorNotification.style.display = 'none';
    }, 5000);
    return;
  }

  const name = username;
  const commentInput = document.getElementById('comment');
  const comment = commentInput.value;
  if (!editedCommentId && (name.trim() === '' || comment.trim() === '')) {
    // Validate the inputs for new comments
    const errorMessage = document.getElementById('error-notification');
    errorMessage.textContent = 'Please fill in all fields.';
    errorMessage.style.display = 'block';
    return;
  }
  if (editedCommentId) {
    const commentElement = document.getElementById(`comment-${editedCommentId}`);
    const commentTextElement = commentElement.querySelector('.comment-text');
    commentTextElement.textContent = comment;
    editedCommentId = null;
    showSuccessNotification('Comment updated successfully!');
  } else {
    const newComment = createCommentElement(name, comment);
    commentsContainer.prepend(newComment);
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
      await fetchComments();

      showSuccessNotification('Comment submitted successfully!');
      commentInput.value = '';
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  }
};


// Function to create a comment element
const createCommentElement = (name, comment, commentId, createdAt) => {
  const formattedDate = new Date(createdAt).toLocaleString();
  const commentElement = document.createElement('div');
  commentElement.id = `comment-${commentId}`;
  commentElement.classList.add('comment');
  commentElement.innerHTML = `
    <div class="comment-content">
      <h4 class="comment-author">${name}</h4>
      <p class="comment-text">${comment}</p>
      <p class="comment-time">${formattedDate}</p> <!-- Display the formatted date -->
    </div>
    <div class="comment-actions">
      ${editedCommentId === commentId ? `
        <button class="comment-save" onclick="saveComment(${commentId})">Save</button>
        <button class="comment-cancel" onclick="cancelEdit(${commentId})">Cancel</button>
      ` : `
        <button class="comment-edit" onclick="editComment(${commentId})">Edit</button>
        <button class="comment-delete" onclick="deleteComment(${commentId})">Delete</button>
      `}
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
  commentsContainer.innerHTML = '';

  comments.forEach((comment) => {
    const { id, name, comment: text, created_at: createdAt } = comment;

    const commentElement = createCommentElement(name, text, id, createdAt);
    const commentActions = commentElement.querySelector('.comment-actions');

    if (isLoggedIn && name === username) {
      commentActions.innerHTML = `
        <button class="comment-edit" onclick="editComment(${id})">Edit</button>
        <button class="comment-delete" onclick="deleteComment(${id})">Delete</button>
      `;
    } else {
      commentActions.style.display = 'none';
    }

    commentsContainer.appendChild(commentElement);
  });

  // Populate the name field with the username if the user is logged in
  const nameField = document.getElementById('name');
  if (isLoggedIn) {
    nameField.value = username;
    nameField.setAttribute('readonly', true); 
  } else {
    nameField.value = '';
    nameField.removeAttribute('readonly'); 
  }
};



// Function to edit a comment
const editComment = (commentId) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  const commentTextElement = commentElement.querySelector('.comment-text');
  commentTextElement.contentEditable = true;
  commentTextElement.focus();
  editedCommentId = commentId;
  const commentActions = commentElement.querySelector('.comment-actions');
  commentActions.innerHTML = `
    <button class="comment-save" onclick="saveComment(${commentId})">Save</button>
    <button class="comment-cancel" onclick="cancelEdit(${commentId})">Cancel</button>
  `;
};

// Function to save a comment after editing
const saveComment = async (commentId) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  const commentTextElement = commentElement.querySelector('.comment-text');
  const commentText = commentTextElement.textContent;
  commentTextElement.contentEditable = false;

  // Send the updated comment to the server
  try {
    const response = await fetch(`/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: commentText }),
    });

    if (response.ok) {
      showSuccessNotification('Comment updated successfully!');
    } else {
      throw new Error('Failed to update comment');
    }
  } catch (error) {
    console.error('Failed to update comment:', error);
    showErrorNotification('Failed to update comment. Please try again.');
  }

  editedCommentId = null;
  const commentActions = commentElement.querySelector('.comment-actions');
  commentActions.innerHTML = `
    <button class="comment-edit" onclick="editComment(${commentId})">Edit</button>
    <button class="comment-delete" onclick="deleteComment(${commentId})">Delete</button>
  `;
};

// Function to cancel editing a comment
const cancelEdit = (commentId) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  const commentTextElement = commentElement.querySelector('.comment-text');
  commentTextElement.contentEditable = false;
  commentTextElement.textContent = commentTextElement.dataset.originalText;
  editedCommentId = null;
  const commentActions = commentElement.querySelector('.comment-actions');
  commentActions.innerHTML = `
    <button class="comment-edit" onclick="editComment(${commentId})">Edit</button>
    <button class="comment-delete" onclick="deleteComment(${commentId})">Delete</button>
  `;
};

// Function to delete a comment
const deleteComment = async (commentId) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    try {
      const response = await fetch(`/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
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

commentForm.addEventListener('submit', handleFormSubmit);
fetchComments();
