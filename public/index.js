  // Fetch the user list from the API
  fetch('/api/profiles')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }
    return response.json();
  })
  .then(users => {
    const userList = document.getElementById('user-list');
    users.forEach(user => {
      // Create a card for each user
      const userCard = document.createElement('div');
      userCard.className = 'user-card';

      // Add click event to redirect to the userProfile page with user ID
      userCard.addEventListener('click', () => {
        window.location.href = `userProfile?id=${user.id}`;
      });

      // Populate the card with user details
      userCard.innerHTML = `
        <h3>${user.first_name} ${user.last_name}</h3>
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Country:</strong> ${user.country}</p>
        <p><strong>Interests:</strong> ${user.interests}</p>
        <p><strong>Hobbies:</strong> ${user.hobbies}</p>
        <p><strong>Family Role:</strong> ${user.familyRole}</p>
      `;
      // Append the card to the user list
      userList.appendChild(userCard);
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });