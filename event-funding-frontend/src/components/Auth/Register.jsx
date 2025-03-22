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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let errors = { ...formErrors };

    if (name === "email" || name === "contact_email" || name === "admin_contact_email") {
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

    if (role === "organization") {
      const requiredFields = ["name", "contact_email", "contact_number", "password", "confirm_password"];
      if (requiredFields.includes(name) && value.trim() === "") {
        errors[name] = "This field is required";
      }

      if (name === "contact_number") {
        const phoneRegex = /^[0-9]{10,15}$/;
        errors.contact_number = phoneRegex.test(value) ? "" : "Invalid contact number";
      }

      if (name === "zip_code") {
        const zipRegex = /^[0-9]{5,10}$/;
        errors.zip_code = zipRegex.test(value) ? "" : "Invalid zip code";
      }
    }

    setFormErrors(errors);
  };

  // Validate all fields before submission
  const validateForm = () => {
    let errors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form before submission
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));
  
    if (Object.values(formErrors).some((error) => error)) {
      console.log("Fix errors before submitting");
      return;
    }
  
    setLoading(true);
  
    // Select API endpoint based on role
    const url =
      role === "user"
        ? "http://127.0.0.1:8000/api/register/user/"
        : "http://127.0.0.1:8000/api/register/organization/";
  
    // Prepare payload based on selected role
    const payload =
      role === "user"
        ? {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }
        : {
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
            password: formData.password,  // ✅ Added password field for organizations
          };
  
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
          </select>
        </div>

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
