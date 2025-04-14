import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    organization_name: "",
    description: "",
    website: "",
    contact_email: "",
    contact_number: "",
    street_address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    admin_name: "",
    admin_contact_email: "",
    industry_type: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };

    if (["email", "contact_email", "admin_contact_email"].includes(name)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errors[name] = emailRegex.test(value) ? "" : "Invalid email format";
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      errors.password = passwordRegex.test(value)
        ? ""
        : "Password must have 8+ chars, uppercase, lowercase, number, and special character";
    }

    if (name === "confirm_password") {
      errors.confirm_password = value === formData.password ? "" : "Passwords do not match";
    }

    setFormErrors(errors);
  };

  const validateForm = () => {
    let errors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });
    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log("Fix errors before submitting");
      return;
    }

    setLoading(true);

    let url = "";
    let payload = {};

    if (role === "user") {
      url = "http://127.0.0.1:8000/api/register/user/";
      payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
    } else if (role === "organization") {
      url = "http://127.0.0.1:8000/api/register/organization/";
      payload = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        contact_email: formData.contact_email,
        contact_number: formData.contact_number,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.zip_code,
        industry_type: formData.industry_type,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        admin_name: formData.admin_name,
        admin_contact_email: formData.admin_contact_email,
        password: formData.password,
      };
    } else if (role === "volunteer") {
      url = "http://127.0.0.1:8000/api/register/volunteer/";
      payload = {
        name: formData.name,
        organization_name: formData.organization_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password, // Important for backend validation
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        alert("Registration successful!");
        navigate("/login");
      } else {
        console.error("Registration failed:", data);
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <div className="form-group full-width">
          <label>Register As:</label>
          <select className="form-control" value={role} onChange={handleRoleChange}>
            <option value="user">Event Visitor/User</option>
            <option value="organization">Organization/Company</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        {/* User */}
        {role === "user" && (
          <>
            {["username", "email", "password", "confirm_password"].map((field) => (
              <div className="form-group half-width" key={field}>
                <label>{field.replace("_", " ").toUpperCase()}</label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  className="form-control"
                  placeholder={`Enter ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                {formErrors[field] && <small className="error-text">{formErrors[field]}</small>}
              </div>
            ))}
          </>
        )}

        {/* Organization */}
        {role === "organization" && (
          <>
            <h3 className="full-width">Organization Details</h3>
            {["name", "password", "confirm_password", "description", "website", "contact_email", "contact_number", "street_address", "city", "state", "country", "zip_code", "admin_name", "admin_contact_email", "industry_type", "facebook", "twitter", "linkedin"].map((field) => (
              <div className="form-group half-width" key={field}>
                <label>{field.replace("_", " ").toUpperCase()}</label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  className="form-control"
                  placeholder={`Enter ${field.replace("_", " ")}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {formErrors[field] && <small className="error-text">{formErrors[field]}</small>}
              </div>
            ))}
          </>
        )}

        {/* Volunteer */}
        {role === "volunteer" && (
          <>
            <h3 className="full-width">Volunteer Details</h3>
            {["name", "organization_name", "email", "password", "confirm_password"].map((field) => (
              <div className="form-group half-width" key={field}>
                <label>{field.replace("_", " ").toUpperCase()}</label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  className="form-control"
                  placeholder={`Enter ${field.replace("_", " ")}`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                {formErrors[field] && <small className="error-text">{formErrors[field]}</small>}
              </div>
            ))}
          </>
        )}

        <button type="submit" className="btn btn-success btn-block" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
