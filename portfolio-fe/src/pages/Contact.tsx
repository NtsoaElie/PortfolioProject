import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import i18next hook
import "./Contact.css";
import i18n from "./i18n";


const Contact = () => {
  const { t } = useTranslation(); // Initialize i18next translation hook
  const navigate = useNavigate(); // Use useNavigate hook for page navigation

  const goHome = () => {
    navigate("/"); // Navigate to home page
  };

  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await emailjs.send(
        "service_cvn0kp9",
        "template_yfdcdb7",
        {
          from_name: formData.name,
          message: formData.message,
        },
        "04o3zPK4v_XFtwQRY"
      );

      if (response.status === 200) {
        toast.success(t('message_sent'), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          style: {
            background: "#1a1a2e", // Dark Purple
            color: "#e0e0e0",
            borderLeft: "5px solid #8a2be2", // Purple border
          },
        });

        setFormData({ name: "", message: "" });
      }
    } catch (error) {
      toast.error(t('message_failed'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: "#1a1a2e", // Dark Purple
          color: "#e0e0e0",
          borderLeft: "5px solid #ff00ff", // Magenta border
        },
      });
    }
  };

  return (
    <div className="contact-container">
      {/* Go Back Button */}
      <button className="go-home-button" onClick={goHome}>
        {t('go_back_home')}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="contact-content"
      >
        <h1 className="contact-title">{t('contact_me')}</h1>
        <p className="contact-subtitle">{t('inquiries_collaborations')}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t('your_name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('message')}</label>
            <textarea
              id="message"
              name="message"
              placeholder={t('your_message')}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            {t('send_message')}
          </button>
        </form>
      </motion.div>

      {/* Custom Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Contact;
