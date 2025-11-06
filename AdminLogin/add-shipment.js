document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔍 add-shipment.js loaded');
    
    const form = document.getElementById('shipment-form');
    const trackingInput = document.getElementById('tracking-number');
    const notification = document.getElementById('notification');
    
    const urlParams = new URLSearchParams(window.location.search);
    const trackingNumber = urlParams.get('trackingNumber');
    
    console.log('📦 Tracking number from URL:', trackingNumber);

    // Check if we're in edit mode
    if (trackingNumber) {
        try {
            console.log('🌐 Fetching shipment data for editing...');
            const response = await fetch(`https://tracking-app-clean.onrender.com/AdminLogin/add-shipment/${trackingNumber}`);
            
            if (response.ok) {
                const shipment = await response.json();
                console.log('✅ Shipment data received:', shipment);
                populateForm(shipment);
                document.querySelector('button[type="submit"]').textContent = 'Update Shipment';
                
                trackingInput.setAttribute('data-original', trackingNumber);
                trackingInput.readOnly = true;
            } else {
                showNotification('Shipment not found!', true);
            }
        } catch (error) {
            console.error('❌ Fetch error:', error);
            showNotification('Error loading shipment data: ' + error.message, true);
        }
    } else {
        console.log('➕ Creating new shipment');
        document.querySelector('button[type="submit"]').textContent = 'Create Shipment';
        generateAndSetTrackingNumber();
        trackingInput.readOnly = false;
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmission(this, trackingNumber);
    });

    async function handleFormSubmission(form, originalTracking) {
        console.log('📤 Handling form submission...');
        
        const trackingInput = document.getElementById('tracking-number');
        let trackingNumberValue = trackingInput.value.trim();
        
        // Validate required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            showNotification('Please fill all required fields correctly', true);
            return;
        }

        // Email validation
        const senderEmail = document.getElementById('sender-email').value;
        const receiverEmail = document.getElementById('receiver-email').value;

        if (senderEmail && !isValidEmail(senderEmail)) {
            showNotification('Please enter a valid sender email address', true);
            return;
        }

        if (!isValidEmail(receiverEmail)) {
            showNotification('Please enter a valid receiver email address', true);
            return;
        }

        // Check if courier is selected
        const courierSelect = document.getElementById('courier');
        if (!originalTracking && !courierSelect.value) {
            showNotification('Please select a courier service', true);
            courierSelect.focus();
            return;
        }

        // For new shipments, ensure we have a tracking number
        if (!originalTracking && !trackingNumberValue) {
            generateAndSetTrackingNumber();
            trackingNumberValue = trackingInput.value;
        }

        // Prepare shipment data
        const shipmentData = {
            trackingNumber: trackingNumberValue,
            customerEmail: document.getElementById('receiver-email').value,
            customerName: document.getElementById('receiver-name').value,
            courier: courierSelect.value,
            shippingDate: document.getElementById('shipping-date').value,
            deliveryDate: document.getElementById('delivery-date').value,
            origin: document.getElementById('country-origin').value,
            destination: document.getElementById('destination').value,
            currentLocation: document.getElementById('current-location').value,
            sender: {
                name: document.getElementById('sender-name').value,
                email: document.getElementById('sender-email').value,
                phone: document.getElementById('sender-number').value,
                address: document.getElementById('sender-address').value
            },
            customerPhone: document.getElementById('receiver-number').value,
            customerAddress: document.getElementById('receiver-address').value,
            product: document.getElementById('product').value,
            quantity: document.getElementById('quantity').value,
            paymentMethod: document.getElementById('payment-method').value,
            weight: document.getElementById('weight').value
        };

        const isUpdate = !!originalTracking;

        console.log('📦 Form data to send:', shipmentData);

        try {
            const payload = {
                ...shipmentData,
                isUpdate: isUpdate,
                originalTrackingNumber: originalTracking
            };

            console.log('🚀 Sending to server...');
            
            const response = await fetch('https://tracking-app-clean.onrender.com/api/add-shipment', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Server response:', result);
            
            if (result.success) {
                showNotification(isUpdate ? '✅ Shipment updated successfully!' : '✅ Shipment created successfully!');
                
                if (!isUpdate) {
                    showNotification(`Tracking number: ${result.trackingNumber} - Emails are being sent`);
                    setTimeout(() => {
                        window.location.href = '/AdminLogin/shipment.html';
                    }, 3000);
                } else {
                    setTimeout(() => {
                        window.location.href = '/AdminLogin/shipment.html';
                    }, 1500);
                }
            } else {
                showNotification('Error: ' + (result.error || 'Unknown error'), true);
            }
        } catch (error) {
            console.error('❌ Submission error:', error);
            showNotification('Error submitting form: ' + error.message, true);
        }
    }

    // Courier change listener
    document.getElementById('courier')?.addEventListener('change', function() {
        if (!trackingInput.getAttribute('data-original')) {
            generateAndSetTrackingNumber();
        }
    });
});

// Rest of your helper functions remain the same
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = isError ? 'notification error' : 'notification success';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    } else {
        alert(isError ? '❌ ' + message : '✅ ' + message);
    }
}

function generateAndSetTrackingNumber() {
    const courierSelect = document.getElementById('courier');
    const trackingInput = document.getElementById('tracking-number');
    
    if (!courierSelect.value) {
        trackingInput.value = '';
        trackingInput.placeholder = 'Select a courier to generate tracking number';
        return;
    }
    
    const trackingNumber = generateTrackingNumber();
    trackingInput.value = trackingNumber;
    trackingInput.classList.add('tracking-generated');
    console.log('🔢 Generated tracking number:', trackingNumber);
}

function generateTrackingNumber() {
    const courierSelect = document.getElementById('courier');
    const courier = courierSelect.value;
    const timestamp = new Date().getTime().toString().substr(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const prefixes = {
        'usps': 'USPS',
        'fedex': 'FDX', 
        'ups': 'UPS',
        'dhl': 'DHL'
    };
    
    const prefix = prefixes[courier] || 'TRK';
    return `${prefix}${timestamp}${random}`;
}

function populateForm(shipment) {
    console.log('📝 Starting form population with shipment:', shipment);
    
    const fieldMappings = {
        'tracking-number': shipment.trackingNumber,
        'courier': shipment.courier,
        'shipping-date': shipment.shippingDate,
        'delivery-date': shipment.deliveryDate,
        'country-origin': shipment.origin,
        'destination': shipment.destination,
        'current-location': shipment.currentLocation,
        'sender-name': shipment.sender?.name,
        'sender-email': shipment.sender?.email,
        'sender-number': shipment.sender?.phone,
        'sender-address': shipment.sender?.address,
        'receiver-name': shipment.customerName,
        'receiver-email': shipment.customerEmail,
        'receiver-number': shipment.customerPhone,
        'receiver-address': shipment.customerAddress,
        'product': shipment.product,
        'quantity': shipment.quantity,
        'weight': shipment.weight,
        'payment-method': shipment.paymentMethod
    };

    for (const [fieldId, value] of Object.entries(fieldMappings)) {
        const element = document.getElementById(fieldId);
        if (element && value !== undefined && value !== null) {
            element.value = value;
        }
    }

    console.log('🎯 Form population completed');
}