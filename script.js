// Function to handle form submission
function submitShipmentId() {
    const shipmentId = document.getElementById('shipmentIdInput').value;
    if (shipmentId) {
        getShipmentDetails(shipmentId);
    } else {
        alert('Please enter a shipment ID');
    }
}

// Function to fetch and display shipment details
async function getShipmentDetails(shipmentId) {
    try {
        // Fetch the JSON data from S3
        const response = await fetch('https://shipmentcc.s3.amazonaws.com/shipments.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();

        // Find the shipment details based on shipmentId
        const shipment = data.shipments.find(s => s.shipment_id === shipmentId);

        // Display the shipment details
        const detailsDiv = document.getElementById('shipmentInfo');
        if (shipment) {
            detailsDiv.innerHTML = `
                <p><strong>Order ID:</strong> ${shipment.order_id}</p>
                <p><strong>Status:</strong> ${shipment.tracking_info.status}</p>
                <p><strong>Carrier:</strong> ${shipment.tracking_info.carrier}</p>
                <p><strong>Estimated Delivery:</strong> ${shipment.tracking_info.estimated_delivery}</p>
                <p><strong>Last Location:</strong> ${shipment.tracking_info.last_location}</p>
                <p><strong>Events:</strong></p>
                <ul>
                    ${shipment.tracking_info.events.map(event => `<li>${event.timestamp}: ${event.status} at ${event.location}</li>`).join('')}
                </ul>
            `;
        } else {
            detailsDiv.innerHTML = `<p>Shipment not found</p>`;
        }
    } catch (error) {
        console.error('Error fetching shipment data:', error);
        document.getElementById('shipmentInfo').innerHTML = `<p>Error fetching shipment data: ${error.message}</p>`;
    }
}
