document.addEventListener('DOMContentLoaded', function () {
    const auctionDetailsContainer = document.getElementById('auctionDetails');
    const bidAmountInput = document.getElementById('bidAmount');
    const bidButton = document.getElementById('bidButton');

    // Function to display auction details
    function displayAuctionDetails(auction) {
        if (auction) {
            const detailsHTML = `
                <h1>${auction.title}</h1>
                <p>Images:</p>
                <div class="image-container">
                    ${auction.media.map(imageUrl => `<img src="${imageUrl}" alt="Auction Image">`).join('')}
                </div>
                <p>Description: ${auction.description}</p>
                <p>Current Bid: ${auction.currentBid}</p>
                <p>Created: ${auction.created}</p>
                <p>Updated: ${auction.updated}</p>
                <p>Ends At: ${auction.endsAt}</p>
                <p>Bids: ${auction._count.bids}</p>
                <label for="bidAmount">Enter Bid Amount:</label>
                <input type="number" id="bidAmount" name="bidAmount" min="1">
                <button id="bidButton">Bid</button>`;

            auctionDetailsContainer.innerHTML = detailsHTML;

            // Add event listener for the bid button
            bidButton.addEventListener('click', () => {
                const bidAmount = parseInt(bidAmountInput.value);
                if (!isNaN(bidAmount) && bidAmount >= 1) {
                    // bid logic
                    placeBid(bidAmount);
                } else {
                    alert('Please enter a valid bid amount.');
                }
            });
        } else {
            auctionDetailsContainer.innerHTML = '<p>No auction details available.</p>';
        }
    }

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'index.html';
    });

    // Get the auction ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('id');

    if (auctionId) {
        // Fetch data for the specified auction ID
        const apiUrl = `https://api.noroff.dev/api/v1/auction/listings/${auctionId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayAuctionDetails(data))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        auctionDetailsContainer.innerHTML = '<p>No auction ID specified.</p>';
    }

    // Function for placing a bid 
    function placeBid(bidAmount) {
        // logic to place a bid
        alert(`Bid placed successfully!`);
    }
});