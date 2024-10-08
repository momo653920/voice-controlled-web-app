import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signUpUser } from "../../redux/actionCreators/authActionCreator";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css"; // Ensure this is imported

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !name || !password || !confirmPassword) {
      setError("Моля, попълнете всички полета");
      return;
    }
    if (password !== confirmPassword) {
      setError("Паролите не съвпадат");
      return;
    }
    dispatch(
      signUpUser(name, email, password, setLoading, setError, setSuccessMessage)
    );
  };

  useEffect(() => {
    if (successMessage) {
      navigate("/dashboard");
    }
  }, [successMessage, navigate]);

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error && (
        <div className="alert alert-danger" aria-live="assertive">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" aria-live="assertive">
          {successMessage}
        </div>
      )}
      <div className="form-group my-3">
        <label htmlFor="email">Имейл:</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="emailHelp"
        />
      </div>
      <div className="form-group my-3">
        <label htmlFor="name">Име:</label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group my-3">
        <label htmlFor="password">Парола:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group my-3">
        <label htmlFor="confirmPassword">Потвърдете паролата:</label>
        <input
          type="password"
          id="confirmPassword"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary my-3" disabled={loading}>
        {loading ? "Регистрирам..." : "Продължи"}
      </button>
    </form>
  );
};

export default RegisterForm;
