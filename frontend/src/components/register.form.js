const registerForm = document.getElementById('registerForm');
const registerResponseMessage = document.getElementById('registerResponseMessage');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  registerResponseMessage.textContent = '';
  registerResponseMessage.style.color = '';

  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      registerResponseMessage.textContent = 'Registration successful!';
      registerResponseMessage.style.color = 'green';
      registerForm.reset();
    } else {
      registerResponseMessage.textContent = result.message || 'Failed to register.';
      registerResponseMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error registering:', error);
    registerResponseMessage.textContent = 'An unexpected error occurred. Please try again later.';
    registerResponseMessage.style.color = 'red';
  }
});