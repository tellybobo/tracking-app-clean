document.addEventListener('DOMContentLoaded', function() {
    loadShipments();
    setupEventListeners();
});

function loadShipments() {
    // Fetch shipments from your server API
    fetch('/api/shipments')
        .then(response => response.json())
        .then(shipments => {
            displayShipments(shipments);
        })
        .catch(error => console.error('Error loading shipments:', error));
}

function displayShipments(shipments) {
    const container = document.getElementById('shipments-container');
    container.innerHTML = ''; // Clear existing content
    
    shipments.forEach(shipment => {
        const shipmentHTML = `
            <div class="shipment-entry">
                <button class="receiver-name">${shipment.customerName}</button>
                <div class="shipment-details">
                    <h3>📦 ${shipment.trackingNumber || 'No Tracking Number'}</h3>
                    <p><strong>Sender:</strong> ${shipment.sender?.name || 'N/A'}</p>
                    <p><strong>Receiver Email:</strong> ${shipment.customerEmail}</p>
                    <p><strong>Route:</strong> ${shipment.origin || 'N/A'} → ${shipment.destination || 'N/A'}</p>
                    <p><strong>Dates:</strong> ${shipment.shippingDate || 'N/A'} → ${shipment.deliveryDate || 'N/A'}</p>
                    <button class="edit-btn" data-tracking="${shipment.trackingNumber}">Edit</button>
                </div>
            </div>
        `;
        container.innerHTML += shipmentHTML;
    });
}

function setupEventListeners()  {
    // Event delegation for clickable receiver names
    document.getElementById('shipments-container').addEventListener('click', function(event) {
        if (event.target.classList.contains('receiver-name')) {
            const details = event.target.nextElementSibling;
            details.classList.toggle('open');
        }
        
 if (event.target.classList.contains('edit-btn')) {
 const trackingNumber = event.target.getAttribute('data-tracking');
window.location.href = 
`/add-shipment.html?trackingNumber=${trackingNumber}`;
        }
    });
}

