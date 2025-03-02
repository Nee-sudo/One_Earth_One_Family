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
        userCard.className = 'user-card';
        userCard.innerHTML = `
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <button id="onclick-${user.id}">View Profile</button>
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