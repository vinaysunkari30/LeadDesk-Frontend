import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/";

const BUDGET_OPTIONS = [
  { value: "", label: "Select budget range..." },
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-10k", label: "$5,000 – $10,000" },
  { value: "10k-25k", label: "$10,000 – $25,000" },
  { value: "25k-plus", label: "$25,000+" },
];

const initialForm = { name: "", email: "", budget: "", message: "" };

// CLIENT-SIDE VALIDATION
const validateForm = ({ name, email, budget, message }) => {
  const errors = {};
  if (!name.trim() || name.trim().length < 4)
    errors.name = "Name must be at least 4 characters.";
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (!budget) errors.budget = "Please select a budget range.";
  if (!message.trim() || message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  if (message.trim().length > 1000)
    errors.message = "Message cannot exceed 1000 characters.";
  return errors;
};

const FieldError = ({ msg }) =>
  msg ? (
    <p className="error-text mt-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  ) : null;

const LeadForm = ({ onSuccess, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Validate single field on blur
    const fieldErrors = validateForm(form);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, budget: true, message: true });

    // Client-side validation first
    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await axios.post(`${API_BASE}api/leads`, form);
      if (res.data.success) {
        setForm(initialForm);
        setTouched({});
        onSuccess?.(res.data.message);
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      const serverMessage =
        err.response?.data?.message || "Something went wrong. Please try again.";

      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
      }
      onError?.(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = form.message.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label htmlFor="lead-name" className="input-label">Full Name</label>
        <input
          id="lead-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="John Doe"
          className={`input-form-field ${errors.name ? "error" : ""}`}
          disabled={submitting}
        />
        <FieldError msg={errors.name} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="lead-email" className="input-label">Email Address</label>
        <input
          id="lead-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="john@example.com"
          className={`input-form-field ${errors.email ? "error" : ""}`}
          disabled={submitting}
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="lead-budget" className="input-label">Budget Range</label>
        <select
          id="lead-budget"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-form-field cursor-pointer ${errors.budget ? "error" : ""}`}
          disabled={submitting}
          style={{ appearance: "none" }}
        >
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0f2c] text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <FieldError msg={errors.budget} />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="lead-message" className="input-label">
          Your Message
          <span className="ml-auto text-xs text-slate-600 normal-case font-normal float-right">
            {charCount}/1000
          </span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell us about your project, goals, and timeline..."
          rows={4}
          className={`input-form-field resize-none ${errors.message ? "error" : ""}`}
          disabled={submitting}
        />
        <FieldError msg={errors.message} />
      </div>

      {/* Submit */}
      <button
        id="lead-submit-btn"
        type="submit"
        disabled={submitting}
        className="gradient-btn w-full cursor-pointer py-3.5 rounded-xl text-white font-inter font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
      >
        <span className="flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send My Inquiry
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  );
};

export default LeadForm;
