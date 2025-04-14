import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import "./EventsDataAnalytics.css";

const eventData = [
  { name: "Event A", volunteers: 20, attendees: 100 },
  { name: "Event B", volunteers: 15, attendees: 80 },
  { name: "Event C", volunteers: 25, attendees: 150 },
];

const pieData = [
  { name: "Approved", value: 30 },
  { name: "Pending", value: 15 },
  { name: "Rejected", value: 5 },
];

const COLORS = ["#28a745", "#ffc107", "#dc3545"];

const EventsDataAnalytics = () => {
  return (
    <div className="events-data-analytics container-fluid p-4">
      <h2 className="mb-4 text-center">Events Data Analytics</h2>

      <div className="row">
        {/* Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h4 className="text-center mb-3">Volunteers vs Attendees</h4>
            <BarChart width={500} height={300} data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volunteers" fill="#007bff" />
              <Bar dataKey="attendees" fill="#28a745" />
            </BarChart>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h4 className="text-center mb-3">Event Approval Status</h4>
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDataAnalytics;
