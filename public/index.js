  // Fetch the user list from the API
  fetch('/api/profiles')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user list');
    }
    return response.json();
  })
  .then(users => {
    users.forEach(user => {
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

  try{
    const jwt = localStorage.getItem('jwt');
    if(jwt){
      console.log('jwt found');
      const loginElement = document.getElementById('login');
      const LoginElement = document.getElementById('Login');
      document.getElementById('signup').style.display= 'none';
      document.getElementById('Signup').style.display= 'none';
      if (loginElement) {
        loginElement.innerText = 'Profile';
        LoginElement.innerText = 'Profile';
        loginElement.setAttribute('href', '/dashboards');
        LoginElement.setAttribute('href', '/dashboards');           
      } else {
        console.error('Element with ID "login" not found');
      }
    } else {
      console.log('jwt not found');
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  