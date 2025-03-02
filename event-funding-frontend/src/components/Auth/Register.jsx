import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    website: '',
    contactEmail: '',
    contactNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    adminName: '',
    adminContactEmail: '',
    registrationNumber: '',
    industryType: '',
    facebook: '',
    twitter: '',
    linkedin: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add your registration logic here
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        {/* Role Selection */}
        <div className="form-group full-width">
          <label>Register As:</label>
          <select className="form-control" value={role} onChange={handleRoleChange}>
            <option value="user">Event Visitor/User</option>
            <option value="organization">Organization/Company</option>
          </select>
        </div>

        {/* Common Fields */}
        <div className="form-group half-width">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group half-width">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group half-width">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Conditional Fields for Organization/Company */}
        {role === 'organization' && (
          <>
            <h3 className='full-width'>Organization Details</h3>
            <div className="form-group half-width">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half-width">
              <label>Website URL</label>
              <input
                type="url"
                name="website"
                className="form-control"
                placeholder="Enter website URL"
                value={formData.website}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half-width">
              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                className="form-control"
                placeholder="Enter contact email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half-width">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                className="form-control"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half-width">
              <label>Admin Name (Optional)</label>
              <input
                type="text"
                name="adminName"
                className="form-control"
                placeholder="Enter admin name"
                value={formData.adminName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group half-width">
              <label>Registration Number/Tax ID (Optional)</label>
              <input
                type="text"
                name="registrationNumber"
                className="form-control"
                placeholder="Enter registration number"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success btn-block">
          Register
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
