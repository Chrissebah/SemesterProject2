document.addEventListener('DOMContentLoaded', function () {
    // Declare jwtToken in this scope
    let jwtToken = localStorage.getItem('jwtToken');
    const itemsPerPage = 10;
    let currentPage = 1;

    // Fetch data from the API
    fetchAuctionListings(currentPage);

    // Function to fetch auction listings
    function fetchAuctionListings(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        fetch('https://api.noroff.dev/api/v1/auction/listings')
            .then(response => response.json())
            .then(data => displayAuctionListings(data.slice(start, end)))
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to display auction listings
    function displayAuctionListings(listings) {
        const auctionListingsContainer = document.getElementById('auctionListings');

        // Check if there are listings to display
        if (listings && listings.length > 0) {
            const listingsHTML = listings.map(listing => `
                <a href="auction-details.html?id=${listing.id}" class="auction-item-link">
                    <div class="auction-item">
                        <h3>${listing.title}</h3>
                        <p>${listing.description}</p>
                        <p>Current Bids: ${listing._count.bids}</p>
                        <hr>
                    </div>
                </a>
            `).join('');

            auctionListingsContainer.innerHTML = listingsHTML;

            // Show the "Load More" button if there are more items
            const loadMoreButton = document.getElementById('loadMoreButton');
            loadMoreButton.style.display = listings.length === itemsPerPage ? 'block' : 'none';
        } else {
            auctionListingsContainer.innerHTML = '<p>No auction listings available. Click again to go back to start.</p>';

            // Reset to the first page when no more items to load
            currentPage = 1;
        }
    }

    // Event listener for "Load More" button
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.addEventListener('click', function () {
        currentPage++;
        fetchAuctionListings(currentPage);
    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'index.html';
    });

    // Declare createPostButton in the appropriate scope
    const createPostButton = document.getElementById('createPostButton');

    // Function to open the create post modal
    function openCreatePostModal() {
        const modal = document.getElementById('createPostModal');

        // Ensure the modal element exists
        if (!modal) {
            console.error('Create Post Modal not found');
            return;
        }

        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const cancelBtn = modal.querySelector('.cancel');
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Get the create button and add a click event listener
        const createBtn = modal.querySelector('.create');
        createBtn.addEventListener('click', () => {
            const newPostData = {
                title: document.getElementById('postTitle').value,
                body: document.getElementById('postBody').value,
                tags: document.getElementById('postTags').value.split(','),
                media: document.getElementById('postMedia').value,
            };

            // Send a POST request to create a new post
            fetch('https://api.noroff.dev/api/v1/auction/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(newPostData),
            })
            .then((response) => {
                if (response.ok) {
                    modal.style.display = 'none';
                    clearCreatePostForm();
                    console.log('Post created successfully');
                    window.location.reload();
                } else {
                    console.error('Failed to create post:', response.status);
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        });
    }

    // Function to clear the create post form
    function clearCreatePostForm() {
        document.getElementById('createPostForm').reset();
    }

    document.getElementById('createPostButton').addEventListener('click', () => {
        openCreatePostModal();
    });

    function clearCreatePostForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postBody').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postMedia').value = '';
    }
});