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
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const profileMessage = document.getElementById('profileMessage');

    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        
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
                userAvatarElement.style.width = '200px';
                userAvatarElement.style.height = '200px';
                userEmailElement.textContent = profileData.email;
                userCreditsElement.textContent = profileData.credits;
                userListingsElement.textContent = profileData.listings;

            
            })
            .catch(error => console.error('Error fetching user profile:', error));
    } else {
        console.error('jwtToken is not available or null.');
        loginButton.style.marginTop = '20px';
        registerButton.style.marginTop = '5px';
        profileMessage.style.marginTop = '5px';
        // Show login and register buttons
        loginButton.style.display = 'block';
        registerButton.style.display = 'block';
        console.log('Setting profile message text.');
        profileMessage.textContent = 'Login or register to view your profile.';
        //hide the section with text
        profileSection.style.display = 'none';
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
                
                return data;
            });
    }
});