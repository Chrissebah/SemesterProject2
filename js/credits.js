document.addEventListener('DOMContentLoaded', function () {
    // Check if a user is logged in (based on the presence of JWT token)
    const jwtToken = localStorage.getItem('jwtToken');
    const creditsContainer = document.getElementById('credits-container');

    if (jwtToken) {
        // User is logged in, display the credits
        const credits = 1000; 
        creditsContainer.textContent = `Credits: ${credits}`;
    } else {
        // User is not logged in, hide the credits container
        creditsContainer.style.display = 'none';
    }
});