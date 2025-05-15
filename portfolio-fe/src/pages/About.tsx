import React from "react";
import "./About.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AboutMeModal from "./AboutMeModal.tsx";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebaseConfig";


const AboutMe = () => {
  const { t, i18n } = useTranslation(); // Initialize i18next translation hook
  const navigate = useNavigate();

  const cvFile = i18n.language === "fr" ? "/FrenchCV.pdf" : "/EnglishCV.pdf";
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    // Check if user is logged in
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            setIsAdmin(idTokenResult.claims.admin === true);
          })
          .catch((error) => {
            console.error("Error getting token result:", error);
            setIsAdmin(false);
          });
      } else {
        setIsAdmin(false);
      }
    });
  }, []); // ✅ Added this to close useEffect and prevent re-runs
  


  const goHome = () => {
    navigate("/"); // Navigate to home page
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAboutSubmit = async (updatedData: {
    intro_text: string;
    journey_text: string;
  }) => {
    await fetch("/api/save-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: i18n.language,
        data: updatedData,
      }),
    });
    window.location.reload();
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <header>
          <h1 className="header-title">{t("about_me")}</h1>
          <p className="header-subtitle">{t("header_subtitle")}</p>
        </header>

        {/* Language Switcher */}
        <div className="language-switcher">
          <button onClick={() => handleLanguageChange("en")}>English</button>
          <button onClick={() => handleLanguageChange("fr")}>Français</button>
        </div>

        {/* Go Back Button */}
        <button className="go-home-button" onClick={goHome}>
          {t("go_back_home")}
        </button>

        {/* About Section */}
        <div className="about-section">
          <div className="about-image">
            <img src="profile.png" alt="Your Portrait" />
          </div>
          <div className="about-content">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="edit-button"
              >
                ✏️ Edit
              </button>
            )}

            <AboutMeModal
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              onSubmit={handleAboutSubmit}
              initialValues={{
                intro_text: t("intro_text"),
                journey_text: t("journey_text"),
              }}
            />

            <h2>{t("who_i_am")}</h2>
            <p>{t("intro_text")}</p>
            <p>{t("journey_text")}</p>

            {/* Download CV Button */}
            <a href={cvFile} download className="download-button">
              {t("download_cv")}
            </a>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="timeline-section">
          <h2>{t("my_journey")}</h2>
          <div className="timeline">
            {[
              {
                year: t("present"),
                title: t("internship_at_ccl"),
                description: t("internship_description"),
              },
              {
                year: "2024",
                title: t("mobile_dev_legacy"),
                description: t("mobile_dev_description"),
              },
              {
                year: "2023",
                title: t("full_stack_dev"),
                description: t("full_stack_description"),
              },
              {
                year: "2022",
                title: t("started_java_web"),
                description: t("started_java_web_description"),
              },
            ].map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-date">{item.year}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          {t("footer_text")} {new Date().getFullYear()}.
        </footer>
      </div>
    </div>
  );
};

export default AboutMe;
