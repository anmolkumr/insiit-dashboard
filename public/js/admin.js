// Function to handle form submission for adding a new event
const apiurl = 'https://insiit-backend-node.vercel.app';

if (document.getElementById('addEventForm')) {
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
      const response = await fetch(`${apiurl}/api/events`, {
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
      // window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add event. Please try again.');
    }
  });
}
// Fetch all events and populate the table
function fetchEvents() {
  fetch(`${apiurl}/api/events`)
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
  fetch(`${apiurl}/api/events/${eventId}`)
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
function updateEvent(event) {
  event.preventDefault();

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
  fetch(`${apiurl}/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'metis-at-insiit'
    },
    body: JSON.stringify(updatedEvent)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Event updated successfully:', data);
      // Close the modal
      $('#editEventModal').modal('hide');
      // Refresh the events table
      // fetchEvents();
    })
    .catch(error => console.error('Error updating event:', error));
}

// Function to delete an event
function deleteEvent(eventId) {
  // Confirm deletion
  if (confirm('Are you sure you want to delete this event?')) {
    // Send DELETE request to delete the event
    fetch(`${apiurl}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': 'metis-at-insiit'
      }
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

if (document.getElementById('events-table-body')) {
  document.addEventListener('DOMContentLoaded', fetchEvents);
}

function fetchOutlets() {
  fetch(`${apiurl}/api/outlets`)
    .then(response => response.json())
    .then(outlets => {
      const spinner = document.getElementById('spinner');
      spinner.style.display = 'none';
      const tableBody = document.getElementById('outlets-table-body');
      tableBody.innerHTML = '<th><tr></tr><th>Outlet Name</th><th>Location</th><th>Open Time</th> <th>Action</th></tr>';
      outlets.forEach(outlet => {
        const row = `
                  <tr>
                      <td>${outlet.name}</td>
                      <td>${outlet.landmark}</td>
                      <td>${outlet.open_time}</td>

                      <td>
                          <button class="btn btn-primary" id="updateOutletModal" data-mdb-ripple-init data-mdb-modal-init
                          data-mdb-target="#updateOutletModal" onclick="editOutlet('${outlet._id}')"><i class='fas fa-pen'></i></button>
                          <button class="btn btn-primary" id="updateOutletMenu" data-mdb-ripple-init data-mdb-modal-init
                          data-mdb-target="#updateOutletMenu" onclick="editOutletMenu('${outlet._id}')">Edit Menu</button>
                          <button class="btn btn-danger" onclick="deleteOutlet('${outlet._id}')"><i class='fas fa-trash'></i></button>
                      </td>
                  </tr>
              `;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching outlets:', error));
}

if (document.getElementById('outlets-table-body')) {
  document.addEventListener('DOMContentLoaded', fetchOutlets);
}

function editOutlet(outletId) {
  fetch(`${apiurl}/api/outlets/${outletId}`)
    .then(response => response.json())
    .then(outlet => {
      document.getElementById('edit-outlet-id').value = outlet._id;
      document.getElementById('edit-outlet-name').value = outlet.name;
      document.getElementById('edit-outlet-location').value = outlet.landmark;
      document.getElementById('edit-outlet-open-time').value = outlet.open_time;
      document.getElementById('edit-outlet-close-time').value = outlet.close_time;
    })
    .catch(error => console.error('Error fetching outlet details:', error));
}

function updateOutlet(event) {
  event.preventDefault();
  const outletId = document.getElementById('edit-outlet-id').value;
  const updatedOutlet = {
    name: document.getElementById('edit-outlet-name').value,
    landmark: document.getElementById('edit-outlet-location').value,
    open_time: document.getElementById('edit-outlet-open-time').value,
    close_time: document.getElementById('edit-outlet-close-time').value
  };

  fetch(`${apiurl}/api/outlets/${outletId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'metis-at-insiit'
    },
    body: JSON.stringify(updatedOutlet)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Outlet updated successfully:', data);
      $('#editOutletModal').modal('hide');
      window.location.reload();
      // fetchOutlets();
    })
    .catch(error => console.error('Error updating outlet:', error));
}

function updateOutletMenu(event) {
  event.preventDefault();
  const outletId = document.getElementById('edit-outlet-menu-id').value;
  const updatedMenu = hot.getData().map(item => ({
    name: item[0],
    price: item[1],
  }));
  console.log(JSON.stringify({ menu: updatedMenu }));

  fetch(`${apiurl}/api/outlets/${outletId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'metis-at-insiit'
    },
    body: JSON.stringify({ menu: updatedMenu }),
  })
    .then(response => {
      if (response.ok) {
        console.log('Menu updated successfully');
        // Close the modal
        $('#updateOutletMenu').modal('hide');
        window.location.reload();
      } else {
        throw new Error('Failed to update menu');
      }
    })
    .catch(error => console.error('Error updating menu:', error));
};

function deleteOutlet(outletId) {
  if (confirm('Are you sure you want to delete this outlet?')) {
    fetch(`${apiurl}/api/outlet/${outletId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': 'metis-at-insiit'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Outlet deleted successfully');
          fetchOutlets();
        } else {
          console.error('Error deleting outlet');
        }
      })
      .catch(error => console.error('Error deleting outlet:', error));
  }
}

let hot;

function editOutletMenu(outletId) {
  fetch(`${apiurl}/api/outlets/menu/${outletId}`)
  .then(response => response.json())
  .then(menu => {
    document.getElementById('edit-outlet-menu-id').value = outletId;

    if (menu && menu.length > 0) {
      const itemData = menu.map(item => [item.name, item.price]);

      if (!hot) { 
        hot = new Handsontable(document.getElementById('hot-container'), {
          data: itemData,
          rowHeaders: true,
          colHeaders: ['Item Name', 'Price'],
          rowWidth: 100,
          height: 500,
          width: '100%',
          readOnly: false,
          colWidths: 100,
          rowHeights: 60,
          stretchH: 'all',
          stretchW: 'all',
          manualColumnResize: true,
          autoWrapRow: true,
          autoWrapCol: true,
          contextMenu: true,
          licenseKey: 'non-commercial-and-evaluation',
        });
      } else {
        hot.loadData(itemData);
      }

    } else {
      if (!hot) {
        hot = new Handsontable(document.getElementById('hot-container'), {
          data: [['', '']], // Blank row
          rowHeaders: true,
          colHeaders: ['Item Name', 'Price'],
          rowWidth: 100,
          height: 500,
          width: '100%',
          readOnly: false,
          colWidths: 100,
          rowHeights: 60,
          stretchH: 'all',
          stretchW: 'all',
          manualColumnResize: true,
          autoWrapRow: true,
          autoWrapCol: true,
          contextMenu: true,
          licenseKey: 'non-commercial-and-evaluation',
        });
      } else {
        hot.loadData([['', '']]); // Blank row
      }
    }
  })
  .catch(error => console.error('Error fetching menu:', error));


}
