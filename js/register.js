document.addEventListener('DOMContentLoaded', function () {
    const authForm = document.getElementById('authForm');

    authForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(authForm);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });

        // Send a POST request to register the user
        fetch('https://api.noroff.dev/api/v1/auction/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response (data contains the JWT or error messages)
            if (data.token) {
                // Registration successful, you can store the JWT and redirect the user
                console.log('Registration successful. JWT:', data.token);
                // Example: redirect to the content page
                window.location.href = 'homepage.html';
            } else {
                // Registration failed, handle errors
                console.error('Registration failed:', data.message);
                // Example: display an error message to the user
                alert('Registration failed. Please check your information and try again.');
            }
        })
        .catch(error => {
            // Handle any network errors
            console.error('Network error:', error);
            // Example: display a generic error message to the user
            alert('An unexpected error occurred. Please try again later.');
        });
    });
});