const emailListContainer = document.getElementById('emailListContainer');

async function fetchEmails() {
  try {
    const response = await fetch('http://localhost:3000/api/emails', {
      method: 'GET',
      headers: {
        Authorization: `Bearer YOUR_JWT_TOKEN`,
      },
    });

    const emails = await response.json();

    if (response.ok) {
      emailListContainer.innerHTML = emails
        .map(
          (email) => `
            <div class="email-item">
              <h3>${email.subject || '(No Subject)'}</h3>
              <p>From: ${email.sender}</p>
              <p>To: ${email.recipient}</p>
              <p>${email.content}</p>
            </div>
          `
        )
        .join('');
    } else {
      emailListContainer.innerHTML = `<p class="error">${emails.message || 'Failed to fetch emails.'}</p>`;
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    emailListContainer.innerHTML = '<p class="error">An unexpected error occurred. Please try again later.</p>';
  }
}

fetchEmails();