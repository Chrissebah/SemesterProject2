document.addEventListener('DOMContentLoaded', function () {
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
            auctionListingsContainer.innerHTML = '<p>No auction listings available.</p>';

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
});