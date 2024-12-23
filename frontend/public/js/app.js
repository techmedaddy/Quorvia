const form = document.getElementById('emailForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  responseMessage.textContent = '';
  responseMessage.style.color = '';

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
      responseMessage.textContent = 'Email sent successfully!';
      responseMessage.style.color = 'green';
      form.reset();
    } else {
      responseMessage.textContent = result.message || 'Failed to send email.';
      responseMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error sending email:', error);
    responseMessage.textContent = 'An unexpected error occurred. Please try again later.';
    responseMessage.style.color = 'red';
  }
});