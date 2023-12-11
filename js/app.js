// app.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the API
    fetch('https://api.noroff.dev/api/v1/auction/listings')
        .then(response => response.json())
        .then(data => displayAuctionListings(data))
        .catch(error => console.error('Error fetching data:', error));

    // Function to display auction listings
    function displayAuctionListings(listings) {
        const auctionListingsContainer = document.getElementById('auctionListings');

        // Check if there are listings to display
        if (listings && listings.length > 0) {
            const listingsHTML = listings.map(listing => `
                <div>
                    <h3>${listing.title}</h3>
                    <p>${listing.description}</p>
                    <p>Current Bid: ${listing.currentBid}</p>
                    <hr>
                </div>
            `).join('');

            auctionListingsContainer.innerHTML = listingsHTML;
        } else {
            auctionListingsContainer.innerHTML = '<p>No auction listings available.</p>';
        }
    }
});