document.addEventListener('DOMContentLoaded', function () {
    let jwtToken = localStorage.getItem('jwtToken');
    const itemsPerPage = 10;
    let currentPage = 1;

    fetchAuctionListings(currentPage);

    function fetchAuctionListings(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        fetch('https://api.noroff.dev/api/v1/auction/listings', {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => displayAuctionListings(data.slice(start, end)))
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayAuctionListings(listings) {
        const auctionListingsContainer = document.getElementById('auctionListings');

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

            const loadMoreButton = document.getElementById('loadMoreButton');
            loadMoreButton.style.display = listings.length === itemsPerPage ? 'block' : 'none';
        } else {
            auctionListingsContainer.innerHTML = '<p>No auction listings available. Click again to go back to start.</p>';
            currentPage = 1;
        }
    }

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

    const createPostButton = document.getElementById('createPostButton');
    createPostButton.addEventListener('click', () => {
        openCreatePostModal();
    });

    function openCreatePostModal() {
        const modal = document.getElementById('createPostModal');

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

        const createBtn = modal.querySelector('.create');
        createBtn.addEventListener('click', () => {
            const newAuctionData = {
                title: document.getElementById('postTitle').value,
                description: document.getElementById('postBody').value || null,
                tags: document.getElementById('postTags').value.split(',').filter(tag => tag.trim()) || [],
                media: document.getElementById('postMedia').value.split(',').map(url => url.trim()) || [],
                endsAt: new Date(document.getElementById('postEndsAt').value).toISOString(),
            };

            console.log('New Auction Data:', newAuctionData);

            fetch('https://api.noroff.dev/api/v1/auction/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(newAuctionData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Response Data:', data);
                    modal.style.display = 'none';
                    clearCreatePostForm();
                    console.log('Auction listing created successfully');
                
                })
                .catch(error => {
                    console.error('An error occurred:', error.message);
                    console.log('Request Payload:', JSON.stringify(newAuctionData, null, 2));
                    console.log('Response Status:', error?.response?.status);
                    console.log('Response Data:', error?.response?.data);
                    console.log('Full Error:', error);
                });
        });
    }

    function clearCreatePostForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postBody').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postMedia').value = '';
        document.getElementById('postEndsAt').value = '';
    }
});