  // Define userList and userCard
  const userList = document.getElementById('userList');

  // Fetch the user list from the API
  fetch('/api/profiles')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      return response.json();
    })
    .then(users => {
      // console.log("user1", users);
      users.forEach(user => {
        // console.log("user1", user);
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
              <button id="onclick-${user.id}" class="view-Profile">View Profile</button>
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
