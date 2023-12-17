document.addEventListener('DOMContentLoaded', function () {
    const auctionDetailsContainer = document.getElementById('auctionDetails');
    const bidAmountInput = document.getElementById('bidAmount');
    let auctionId;

    function displayAuctionDetails(auction) {
        console.log('Adding event listener to bid button');
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

            // Event listener for bid button
            auctionDetailsContainer.addEventListener('click', function (event) {
                if (event.target && event.target.id === 'bidButton') {
                    handleBidButtonClick();
                }
            });
        } else {
            auctionDetailsContainer.innerHTML = '<p>No auction details available.</p>';
        }
    }

    function handleBidButtonClick() {
        console.log('Button clicked!');
        const bidAmountInputValue = bidAmountInput.value.trim();
    
        console.log('bidAmountInputValue:', bidAmountInputValue);
        console.log('typeof bidAmountInputValue:', typeof bidAmountInputValue);
    
        // Convert the input value to a number
        const bidAmount = Number(bidAmountInputValue);
    
        console.log('Bid Amount:', bidAmount);
        console.log('isNaN(bidAmount):', isNaN(bidAmount));
        console.log('bidAmount >= 1:', bidAmount >= 1);
    
        if (!isNaN(bidAmount) && bidAmount >= 1) {
            placeBid(bidAmount, auctionId);
        } else {
            alert('Please enter a valid bid amount.');
        }
    }
    

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'index.html';
    });

    const urlParams = new URLSearchParams(window.location.search);
    auctionId = urlParams.get('id');

    if (auctionId) {
        const apiUrl = `https://api.noroff.dev/api/v1/auction/listings/${auctionId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayAuctionDetails(data))
            .catch(error => console.error('Error fetching data:', error));
    } else {
        auctionDetailsContainer.innerHTML = '<p>No auction ID specified.</p>';
    }

    function placeBid(bidAmount, auctionId) {
        console.log('Placing bid', bidAmount, 'for auction ID:', auctionId);
        const bidUrl = 'https://api.noroff.dev/api/v1/auction/bids';

        const bidData = {
            amount: bidAmount,
        };

        fetch(bidUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bidData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to place bid');
                }
                return response.json();
            })
            .then(data => {
                alert(`Bid placed successfully for auction ID ${auctionId} with amount ${bidAmount}!`);
            })
            .catch(error => {
                console.error('Error placing bid:', error);
                alert('Failed to place bid. Please try again.');
            });
    }
});