import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role);
    fetchAppointments(user?.role);
  }, []);

  const fetchAppointments = async (role) => {
    try {
      let response;
      if (role === 'doctor') {
        response = await appointmentAPI.getDoctorAppointments();
      } else {
        response = await appointmentAPI.getPatientAppointments();
      }
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="appointments-section">
        <h2>
          {userRole === 'doctor' ? 'My Schedule' : 'My Appointments'}
        </h2>
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>
                  {userRole === 'doctor' ? 'Patient' : 'Doctor'}
                </th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.startTime} - {appointment.endTime}</td>
                  <td>
                    {userRole === 'doctor'
                      ? appointment.patientId?.name
                      : appointment.doctorId?.name}
                  </td>
                  <td>{appointment.title}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
