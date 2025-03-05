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
      console.log("user1", users);
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