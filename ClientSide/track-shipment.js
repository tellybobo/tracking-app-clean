document.addEventListener('DOMContentLoaded', function() {
  
  const mobileNavbar = document.getElementById("mobile-navbar");
  if (mobileNavbar) {
    mobileNavbar.classList.remove("active");
  }
 
  const submenu = document.getElementById("services-submenu");
  if (submenu) {
    submenu.classList.remove("active");
  }
  
  console.log("Navbar reset - mobile navbar active:", mobileNavbar?.classList.contains("active"));
  console.log("Submenu reset - submenu active:", submenu?.classList.contains("active"));
});


document.addEventListener('DOMContentLoaded', function() {
    const trackingInput = document.getElementById('tracking-input');
    const trackingResult = document.getElementById('tracking-result');
    const errorMessage = document.getElementById('error-message');

    // Auto-track when user pastes a tracking number
   trackingInput.addEventListener('input', function() {
    const trackingNumber = this.value.trim();
    if (trackingNumber.length === 0) {
        hideResults();
        return;
    }
    trackShipment(trackingNumber);
   });

    
    // Also track when Enter key is pressed
    trackingInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            trackShipment();
        }
    });

    function trackShipment(trackingNumber) {
        hideResults();

          // Fetch shipment data from your API
        fetch(`https://backend-server-km7h.onrender.com/api/shipments/${trackingNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Shipment not found');
                }
                return response.json();
            })
             .then(shipment => {
                displayShipment(shipment);
            })
            .catch(error => {
                showError(error.message || 'Shipment not found. Please check your tracking number.');
            })
            .finally(() => {
                trackingInput.style.background = "";
            });
    }
     

    function displayShipment(shipment) {
        const html = `
            <h2>Shipment Details</h2>
            <div class="shipment-info">
                <div class="info-group">
                    <span class="info-label">Tracking Number:</span>
                    <span class="info-value">${shipment.trackingNumber}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Status:</span>
                    <span class="status-badge">In Transit</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Receiver:</span>
                    <span class="info-value">${shipment.customerName}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${shipment.customerEmail}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Sender:</span>
                    <span class="info-value">${shipment.sender?.name || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Route:</span>
                    <span class="info-value">${shipment.origin || 'N/A'} → ${shipment.destination || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Product:</span>
                    <span class="info-value">${shipment.product || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Quantity:</span>
                    <span class="info-value">${shipment.quantity || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Weight:</span>
                    <span class="info-value">${shipment.weight || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Shipping Date:</span>
                    <span class="info-value">${shipment.shippingDate || 'N/A'}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Estimated Delivery:</span>
                    <span class="info-value">${shipment.deliveryDate || 'N/A'}</span>
                </div>
            </div>
        `;
        
        trackingResult.innerHTML = html;
        trackingResult.style.display = 'block';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    function hideResults() {
        trackingResult.style.display = 'none';
        errorMessage.style.display = 'none';
    }
});