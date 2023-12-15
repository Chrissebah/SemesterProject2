document.addEventListener('DOMContentLoaded', function () {
    // Declare jwtToken in this scope
    let jwtToken = localStorage.getItem('jwtToken');

    const navUl = document.getElementById('nav-ul');
    const logoutButton = document.getElementById('logoutButton');
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    const userListingsElement = document.getElementById('userListings');
    const userBidsElement = document.getElementById('userBids');
    const userEmailElement = document.getElementById('userEmail');
    const userCreditsElement = document.getElementById('userCredits');

    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        // Redirect to the login page or perform the logout logic
        window.location.href = 'index.html';
    });

    // Check if jwtToken is available
    if (jwtToken) {
        // Fetch and display user profile information
        fetchUserProfile(jwtToken)
            .then(profileData => {
                // Update the DOM with the fetched profile information
                userNameElement.textContent = profileData.name;

                userAvatarElement.src = profileData.avatar || '/images/placeholder.png';

                userEmailElement.textContent = profileData.email;

                userCreditsElement.textContent = profileData.credits;

                userListingsElement.textContent = profileData.listings;
                

                // Additional logic for displaying other information when i find out
                

            })
            .catch(error => console.error('Error fetching user profile:', error));
    } else {
        console.error('jwtToken is not available or null.');
    }

    // Function to fetch user profile information
    function fetchUserProfile(jwtToken) {
        if (!jwtToken) {
            console.error('jwtToken is null or undefined.');
            return Promise.reject(new Error('jwtToken is null or undefined.'));
        }

        // Get the username from the jwtToken
        const tokenPayload = jwtToken ? JSON.parse(atob(jwtToken.split('.')[1])) : null;
        const username = tokenPayload ? tokenPayload.name : null;

        if (!username) {
            console.error('Username not found in jwtToken.');
            return Promise.reject(new Error('Username not found.'));
        }

        // Construct the API endpoint with the username
        const endpoint = `https://api.noroff.dev/api/v1/auction/profiles/${username}`;

        // Fetch user profile information
        return fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Assuming the API response contains the user's profile data
                return data;
            });
    }
});