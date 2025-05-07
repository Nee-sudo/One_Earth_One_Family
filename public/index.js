const BACKEND_URL = 'https://oneearthonefamily.up.railway.app'; // Replace with your backend URL

// Define userList and userCard
const userList = document.getElementById('userList');

// Fetch the user list from the API
fetch(`${BACKEND_URL}/api/profiles`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }
    return response.json();
  })
  .then(users => {
    // console.log("user1", users);
    users.forEach(user => {
      console.log("user1", user);
      // Create a new user card element
      const userCard = document.createElement('div');
      userCard.className = 'col-lg-3 col-md-6 d-flex align-items-stretch';
      userCard.setAttribute('data-aos', 'fade-up');
      userCard.setAttribute('data-aos-delay', '700');
      userCard.innerHTML = `
        <div class="team-member">
          <div class="member-img">
          <img src="${user.image}" class="img-fluid" alt="">
            <div class="social">
        <a href="#"><i class="bi bi-twitter"></i></a>
        <a href="#"><i class="bi bi-facebook"></i></a>
        <a href="#"><i class="bi bi-instagram"></i></a>
        <a href="#"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>
          <div class="member-info">
            <h4>${user.first_name}</h4>
            <span>${user.familyRole}</span>
            <span>Member from ${user.country}</span>
            <p>${user.bio}</p>
           <center><button id="onclick-${user.id}" class="view-Profile">View Profile</button></center>
          </div>
        </div>
      `;
      
      // Add click event to redirect to the userProfile page with user ID
      const onclickButton = userCard.querySelector(`#onclick-${user.id}`);
      onclickButton.addEventListener('click', () => {
        window.location.href = `userProfile?id=${user.id}`;
      });
      
      // Append the user card to the user list
      userList.appendChild(userCard);
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });

console.log('index.js loaded');

document.addEventListener('DOMContentLoaded', function() {
  const jwtToken = localStorage.getItem('jwt');
  const signupLinks = document.querySelectorAll('a[href="/signup"]'); // Select all signup links
  const loginLinks = document.querySelectorAll('a[href="/login"]'); // Select all login links

  // console.log('JWT Token:', jwtToken);

  if (jwtToken) {
    // User is logged in
    console.log('User is logged in.');

    loginLinks.forEach(loginLink => {
      console.log('Changing Login to Logout.');
      loginLink.textContent = 'Logout';
      loginLink.href = '#';
      loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('jwt');
        console.log('JWT removed, logging out.');
        window.location.reload();
      });
    });

    signupLinks.forEach(signupLink => {
      console.log('Changing Signup to Dashboards.');
      signupLink.textContent = 'Dashboards';
      signupLink.href = '/dashboards';
    });

  } else {
    // User is logged out
    console.log('User is logged out.');

    loginLinks.forEach(loginLink => {
      console.log('Ensuring Login link is correct.');
      loginLink.textContent = 'Login';
      loginLink.href = '/login';
    });

    signupLinks.forEach(signupLink => {
      console.log('Ensuring Signup link is correct.');
      signupLink.textContent = 'Signup';
      signupLink.href = '/signup';
    });
  }
});

// Function to handle the search functionality
document.addEventListener('DOMContentLoaded', () => {
const jwtToken = localStorage.getItem('jwt');
const expandButtonContainer = document.getElementById('post-thought-container');
const expandButton = document.getElementById('expand-search-bar');
const searchBar = document.getElementById('search-bar');
const postButton = document.getElementById('post-thought');
const cancelButton = document.getElementById('cancel-thought');
const thoughtInput = document.getElementById('thought-input');
const thoughtsSection = document.querySelector('#thoughts-section .row');

if (jwtToken) {
    expandButtonContainer.classList.remove('d-none');
}

expandButton.addEventListener('click', () => {
    searchBar.classList.remove('d-none');
    expandButton.classList.add('d-none');
});

cancelButton.addEventListener('click', () => {
    searchBar.classList.add('d-none');
    expandButton.classList.remove('d-none');
    thoughtInput.value = '';
});

postButton.addEventListener('click', () => {
    if (!jwtToken) {
        alert('Please login or signup to post your thought.');
        return;
    }
    const thoughtText = thoughtInput.value.trim();
    if (thoughtText) {
        fetch('/api/thoughts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ text: thoughtText })
        })
        .then(response => response.json())
        .then(data => {
            appendThoughtCard(data);
            thoughtInput.value = '';
            searchBar.classList.add('d-none');
            expandButton.classList.remove('d-none');
        })
        .catch(error => console.error('Error posting thought:', error));
    }
});

// Load thoughts on page load
loadAllThoughts();
});

// Function to fetch and display all thoughts
function loadAllThoughts() {
fetch(`${BACKEND_URL}/api/thoughts`)
.then(response => response.json())
.then(thoughts => {
    thoughts.forEach(thought => appendThoughtCard(thought));
})
.catch(error => console.error('Error fetching thoughts:', error));
}

// Function to display thoughts
function appendThoughtCard(thought) {
console.log('User Image:', thought.userImage);
const newCard = document.createElement('div');
newCard.classList.add('col-lg-4', 'col-md-6');
newCard.innerHTML = `
    <div class="card">
        <div class="card-header d-flex align-items-center">
            <img src="${thought.userImage || 'assets/img/default.jpg'}" alt="User Profile" class="rounded-circle" style="width: 40px; height: 40px; margin-right: 10px;">
            <h5 class="mb-0">${thought.username || 'Anonymous'}</h5>
        </div>
        <div class="card-body">
            <p>${thought.text}</p>
            <div class="d-flex justify-content-between">
                <button class="btn btn-light like-btn" data-id="${thought._id}"><i class="bi bi-hand-thumbs-up"></i> Like <span class="like-count">${thought.likes?.length || 0}</span></button>
                <button class="btn btn-light comment-btn" data-id="${thought._id}"><i class="bi bi-chat"></i> Comment <span class="comment-count">${thought.comments?.length || 0}</span></button>
            </div>
            <div class="comment-section mt-3" style="display: none;">
                <ul class="list-unstyled mt-2 comment-list"></ul>
                <textarea class="form-control mb-2 comment-input" rows="2" placeholder="Write a comment..."></textarea>
                <button class="btn btn-primary btn-sm post-comment-btn">Post Comment</button>
                <button class="btn btn-danger btn-sm close-comment-btn">Close Comments</button>
            </div>
        </div>
    </div>
`;
document.querySelector('#thoughts-section .row').appendChild(newCard);
attachEventListeners(newCard);
}

// Attach event listeners
function attachEventListeners(card) {
const jwtToken = localStorage.getItem('jwt');
const likeButton = card.querySelector('.like-btn');
const commentButton = card.querySelector('.comment-btn');
const commentSection = card.querySelector('.comment-section');
const commentList = card.querySelector('.comment-list');
const commentInput = card.querySelector('.comment-input');
const postCommentButton = card.querySelector('.post-comment-btn');
const closeCommentButton = card.querySelector('.close-comment-btn');

// Like button event
likeButton.addEventListener('click', () => {
    if (!jwtToken) {
        alert('Please login to like posts.');
        return;
    }
    const thoughtId = likeButton.getAttribute('data-id');
    fetch(`/api/thoughts/${thoughtId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwtToken}` }
    })
    .then(response => response.json())
    .then(data => {
        likeButton.querySelector('.like-count').textContent = data.likes;
        likeButton.disabled = true;
    })
    .catch(error => console.error('Error liking thought:', error));
});

// Comment button event (Fetch existing comments)
commentButton.addEventListener('click', () => {
    const thoughtId = commentButton.getAttribute('data-id');

    if (commentSection.style.display === 'none' || commentSection.style.display === '') {
        fetch(`/api/thoughts/${thoughtId}/comments`)
            .then(response => response.json())
            .then(comments => {
                commentList.innerHTML = ''; 
                comments.forEach(comment => {
                    const commentItem = document.createElement('li');
                    commentItem.innerHTML = `<strong>${comment.username || 'Anonymous'}:</strong> ${comment.text}`;
                    commentList.appendChild(commentItem);
                });

                commentSection.style.display = 'block';
            })
            .catch(error => console.error('Error fetching comments:', error));
    } else {
        commentSection.style.display = 'none';
    }
});

// Post a new comment
postCommentButton.addEventListener('click', () => {
    const thoughtId = commentButton.getAttribute('data-id');
    const commentText = commentInput.value.trim();
    if (commentText) {
        fetch(`/api/thoughts/${thoughtId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ comment: commentText })
        })
        .then(response => response.json())
        .then(updatedComments => {
            commentInput.value = '';
            commentList.innerHTML = '';
            updatedComments.forEach(comment => {
                const commentItem = document.createElement('li');
                commentItem.innerHTML = `<strong>${comment.username || 'Anonymous'}:</strong> ${comment.text}`;
                commentList.appendChild(commentItem);
            });
        });
    }
});

closeCommentButton.addEventListener('click', () => {
    commentSection.style.display = 'none';
});
}
