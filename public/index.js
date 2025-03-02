  // Define userList
  const userList = document.getElementById('userList');
  const userCard = document.getElementById('userCard')
  // Fetch the user list from the API
  fetch('/api/profiles')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }
    return response.json();
  })
  .then(users => {
    console.log("user1",users);
    users.forEach(user => {
      console.log("user1",user);
      const onclick = document.getElementById('onclick');
      console.log(user);
      // Add click event to redirect to the userProfile page with user ID
      onclick.addEventListener('click', () => {
        window.location.href = `userProfile?id=${user.id}`;
      });
      userList.appendChild(userCard);
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });

  console.log('index.js loaded');

 