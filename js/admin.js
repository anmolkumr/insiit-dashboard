// Function to handle form submission for adding a new event
document.getElementById('addEventForm').addEventListener('submit', async function (event) {
  event.preventDefault(); 

  // Get form data
  const eventData = {
    event_name: document.getElementById('eventNameInput').value,
    location: document.getElementById('eventLocationInput').value,
    date: document.getElementById('eventDateInput').value,
    start_time: document.getElementById('eventStartTimeInput').value,
    poster_image_url: document.getElementById('eventPosterUrlInput').value,
    description: document.getElementById('eventDescriptionInput').value,
    added_by: document.getElementById('eventAddedByInput').value
  };

  // Send POST request to add new event
  try {
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    if (!response.ok) {
      throw new Error('Failed to add event');
    }
    // If successful, reload the page to see the updated list of events
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add event. Please try again.');
  }
});

// Fetch all events and populate the table
function fetchEvents() {
  fetch('http://localhost:3000/api/events')
    .then(response => response.json())
    .then(events => {
      const tableBody = document.getElementById('events-table-body');
      tableBody.innerHTML = '<th><tr></tr><th>Event Name</th><th>Date</th><th>Added By</th><th>Actions</th></tr>';
      events.forEach(event => {
        const row = `
                  <tr>
                      <td>${event.event_name}</td>
                      <td>${event.date}</td>
                      <td>${event.added_by}</td>
                      <td>
                          <button class="btn btn-primary" id="updateEventModal" data-mdb-ripple-init data-mdb-modal-init
                          data-mdb-target="#updateEventModal" onclick="editEvent('${event._id}')">Edit</button>
                          <button class="btn btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
                      </td>
                  </tr>
              `;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching events:', error));
}

// Function to open the edit event modal with pre-populated data
function editEvent(eventId) {
  // Fetch event details by eventId
  fetch(`http://localhost:3000/api/events/${eventId}`)
    .then(response => response.json())
    .then(event => {
      // Populate the modal fields with event details
      document.getElementById('edit-event-id').value = event._id;
      document.getElementById('edit-event-name').value = event.event_name;
      document.getElementById('edit-event-location').value = event.location;

      document.getElementById('edit-event-date').value = event.date;
      document.getElementById('edit-event-start').value = event.start_time;
      document.getElementById('edit-event-img').value = event.poster_image_url;
      document.getElementById('edit-event-desc').value = event.description;
      document.getElementById('edit-event-added-by').value = event.added_by;

      // Show the modal
      // $('#editEventModal').modal('show');
    })
    .catch(error => console.error('Error fetching event details:', error));
}

// Function to update an event
function updateEvent() {

  const eventId = document.getElementById('edit-event-id').value;
  const updatedEvent = {
    event_name: document.getElementById('edit-event-name').value,
    location: document.getElementById('edit-event-location').value,
    date: document.getElementById('edit-event-date').value,
    start_time: document.getElementById('edit-event-start').value,
    poster_image_url: document.getElementById('edit-event-img').value,
    description: document.getElementById('edit-event-desc').value,
    added_by: document.getElementById('edit-event-added-by').value
    // Add other fields as needed
  };

  // Send PUT request to update the event
  console.log(JSON.stringify(updatedEvent));
  fetch(`http://localhost:3000/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedEvent)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Event updated successfully:', data);
      // Close the modal
      $('#editEventModal').modal('hide');
      // Refresh the events table
      fetchEvents();
    })
    .catch(error => console.error('Error updating event:', error));
}

// Function to delete an event
function deleteEvent(eventId) {
  // Confirm deletion
  if (confirm('Are you sure you want to delete this event?')) {
    // Send DELETE request to delete the event
    fetch(`http://localhost:3000/api/events/${eventId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Event deleted successfully');
          // Refresh the events table
          fetchEvents();
        } else {
          console.error('Error deleting event');
        }
      })
      .catch(error => console.error('Error deleting event:', error));
  }
}

// Call fetchEvents() to load events when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);