const emailForm = document.getElementById('emailForm');
const emailResponseMessage = document.getElementById('emailResponseMessage');

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(emailForm);
  emailResponseMessage.textContent = '';
  emailResponseMessage.style.color = '';

  try {
    const response = await fetch('http://localhost:3000/api/emails/send', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer YOUR_JWT_TOKEN`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      emailResponseMessage.textContent = 'Email sent successfully!';
      emailResponseMessage.style.color = 'green';
      emailForm.reset();
    } else {
      emailResponseMessage.textContent = result.message || 'Failed to send email.';
      emailResponseMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error sending email:', error);
    emailResponseMessage.textContent = 'An unexpected error occurred. Please try again later.';
    emailResponseMessage.style.color = 'red';
  }
});