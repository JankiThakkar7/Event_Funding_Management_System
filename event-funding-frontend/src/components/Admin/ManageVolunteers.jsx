import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageVolunteers.css";

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [eventName, setEventName] = useState(""); // State for event name
  const [selectedVolunteers, setSelectedVolunteers] = useState([]); // State to store selected volunteers
  const [error, setError] = useState(""); // To handle errors

  // Fetch volunteers for the logged-in admin's organization
  const fetchVolunteers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
      const response = await axios.get("http://localhost:8000/api/organization/volunteers/", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
        },
      });

      // Set the fetched volunteers to state
      setVolunteers(response.data.volunteers); // Assuming response contains the list of volunteers
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      setError("Unable to fetch volunteers. Please try again later.");
    }
  };

  // Fetch volunteers when the component mounts
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Handle change in volunteer selection
  const handleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers((prev) =>
      prev.includes(volunteerId)
        ? prev.filter((id) => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  // Handle the event creation
  const handleCreateEvent = async () => {
    if (!eventName) {
      alert("Please provide a valid event name!");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:8000/api/create-event", {
        name: eventName,
        volunteers: selectedVolunteers,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("Event created successfully!");
      console.log("Event creation response:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div className="manage-volunteers container-fluid">
      <h2 className="mb-4">Manage Volunteers</h2>
      <p>View, add, edit, and remove volunteers below:</p>

      {/* Error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Event Creation Form */}
      <div className="event-creation mb-4">
        <h4>Create Event</h4>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={handleCreateEvent}>
          Create Event
        </button>
      </div>

      {/* Volunteers List Table */}
      <h4>Volunteers</h4>
      <p>Select volunteers to add to the event.</p>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.length > 0 ? (
            volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.id}</td>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.phone}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedVolunteers.includes(volunteer.id)}
                    onChange={() => handleVolunteerSelection(volunteer.id)}
                  />
                  <button className="btn btn-warning btn-sm me-2">Edit</button>
                  <button className="btn btn-danger btn-sm">Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No volunteers available for this organization.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Button to add selected volunteers to event */}
      {eventName && (
        <button
          className="btn btn-success mt-2"
          onClick={() => alert(`Volunteers added to event: ${eventName}`)}
        >
          Add Selected Volunteers to Event
        </button>
      )}
    </div>
  );
};

export default ManageVolunteers;
