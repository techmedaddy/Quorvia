const loginForm = document.getElementById('loginForm');
const loginResponseMessage = document.getElementById('loginResponseMessage');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  loginResponseMessage.textContent = '';
  loginResponseMessage.style.color = '';

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      loginResponseMessage.textContent = 'Login successful!';
      loginResponseMessage.style.color = 'green';
      localStorage.setItem('token', result.token);
      window.location.href = '/dashboard'; // Redirect to dashboard
    } else {
      loginResponseMessage.textContent = result.message || 'Failed to login.';
      loginResponseMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error logging in:', error);
    loginResponseMessage.textContent = 'An unexpected error occurred. Please try again later.';
    loginResponseMessage.style.color = 'red';
  }
});