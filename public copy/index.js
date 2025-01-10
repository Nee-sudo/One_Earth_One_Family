document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Collect all selected badges
        data.badges = formData.getAll('badges[]') || [];

        // Validate required fields
        if (!data.name?.trim() || !data.country?.trim() || !data.familyRole?.trim()) {
            alert('Please fill out all required fields.');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable the button during the request

        try {
            // Send data to the backend
            const response = await fetch('/submit-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Profile submitted successfully!');
                console.log(result);
                form.reset(); // Reset form fields after success
            } else {
                const error = await response.json();
                console.error('Failed to submit profile:', error.message || response.statusText);
                alert(`Failed to submit profile: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            submitButton.disabled = false; // Re-enable the button
        }
    });
});

