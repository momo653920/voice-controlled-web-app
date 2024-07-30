import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signUpUser } from "../../redux/actionCreators/authActionCreator";
import { useNavigate } from "react-router-dom";

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
      setError("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
    <form onSubmit={handleSubmit}>
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
      <div className="form-group my-2">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="emailHelp"
        />
      </div>
      <div className="form-group my-2">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group my-2">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group my-2">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary my-2 form-control"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
