document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(loginForm);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });

        // Send a POST request to log in the user
        fetch('https://api.noroff.dev/api/v1/auction/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response
            if (data.accessToken) {
                // Login successful, store the JWT token
                localStorage.setItem('jwtToken', data.accessToken);
                console.log('Login successful. JWT:', data.accessToken);
                // Example: redirect to the user dashboard
                window.location.href = 'homepage.html';
            } else {
                // Login failed, handle errors
                console.error('Login failed:', data.message);
                // Example: display an error message to the user
                alert('Login failed. Please check your email and password.');
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