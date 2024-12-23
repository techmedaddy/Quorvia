
import ApiHandler from './utils/api.handler';

const app = (() => {
  const init = () => {
    setupEventListeners();
  };

  const setupEventListeners = () => {
    const emailForm = document.getElementById('emailForm');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (emailForm) emailForm.addEventListener('submit', handleEmailFormSubmit);
    if (loginForm) loginForm.addEventListener('submit', handleLoginFormSubmit);
    if (registerForm) registerForm.addEventListener('submit', handleRegisterFormSubmit);

    fetchAndDisplayEmails();
  };

  const handleEmailFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
      const token = localStorage.getItem('token');
      const response = await ApiHandler.post('http://localhost:3000/api/emails/send', Object.fromEntries(formData), token);
      alert('Email sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error.message);
      alert(`Failed to send email: ${error.message}`);
    }
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.loginEmail.value;
    const password = form.loginPassword.value;

    try {
      const response = await ApiHandler.post('http://localhost:3000/api/users/login', { email, password });
      localStorage.setItem('token', response.token);
      alert('Login successful! Redirecting to dashboard.');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.registerName.value;
    const email = form.registerEmail.value;
    const password = form.registerPassword.value;

    try {
      const response = await ApiHandler.post('http://localhost:3000/api/users/register', { name, email, password });
      alert('Registration successful! Please login.');
      form.reset();
    } catch (error) {
      console.error('Error registering user:', error.message);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const fetchAndDisplayEmails = async () => {
    const emailListContainer = document.getElementById('emailListContainer');
    if (!emailListContainer) return;

    try {
      const token = localStorage.getItem('token');
      const emails = await ApiHandler.get('http://localhost:3000/api/emails', token);
      emailListContainer.innerHTML = emails
        .map(
          (email) => `
          <div class="email-item">
            <h3>${email.subject || 'No Subject'}</h3>
            <p><strong>From:</strong> ${email.sender}</p>
            <p><strong>To:</strong> ${email.recipient}</p>
            <p>${email.content}</p>
          </div>`
        )
        .join('');
    } catch (error) {
      console.error('Error fetching emails:', error.message);
      emailListContainer.innerHTML = `<p class="error">Failed to fetch emails: ${error.message}</p>`;
    }
  };

  return { init };
})();

// Initialize the app
document.addEventListener('DOMContentLoaded', app.init);