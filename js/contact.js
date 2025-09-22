document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const responseMessageDiv = document.getElementById('formResponseMessage');

    if (contactForm && responseMessageDiv) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            // Clear previous messages
            responseMessageDiv.innerHTML = '';
            responseMessageDiv.className = 'form-message'; // Reset class

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });

            // Basic client-side validation (Bootstrap's `required` handles empty fields)
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('Please fill out all fields.');
                return;
            }
            if (!isValidEmail(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Disable button to prevent multiple submissions
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch('/send-email', { // This matches the server route
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const resultText = await response.text(); // Get response as text

                if (response.ok) {
                    // Option 1: Display success message on the page (recommended for SPA-like feel)
                    alert("Message sent successfully!")
                    contactForm.reset(); // Reset the form

                    // Option 2: If your server sends back a full HTML success page, you could replace the content
                    // (This was in your previous Node.js example, but inline message is often better here)
                    // document.body.innerHTML = resultText; 
                } else {
                     // Try to parse error if server sends JSON error
                    try {
                        const errorJson = JSON.parse(resultText);
                        alert(`Error: ${errorJson.message || 'Could not send email.'}`, 'error');
                    } catch (e) {
                        // Fallback if response is not JSON
                        alert(`Error: ${resultText || response.statusText || 'Could not send email.'}`, 'error');
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An unexpected network error occurred. Please try again.', 'error');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});