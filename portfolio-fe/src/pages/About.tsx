import React from "react";
import "./About.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutMe = () => {
  const { t, i18n } = useTranslation(); // Initialize i18next translation hook
  const navigate = useNavigate();

  const cvFile = i18n.language === "fr" ? "/FrenchCV.pdf" : "/EnglishCV.pdf";

  const goHome = () => {
    navigate("/"); // Navigate to home page
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <header>
          <h1 className="header-title">{t('about_me')}</h1>
          <p className="header-subtitle">{t('header_subtitle')}</p>
        </header>

        {/* Language Switcher */}
        <div className="language-switcher">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('fr')}>Français</button>
        </div>

        {/* Go Back Button */}
        <button className="go-home-button" onClick={goHome}>
          {t('go_back_home')}
        </button>

        {/* About Section */}
        <div className="about-section">
          <div className="about-image">
            <img src="profile.png" alt="Your Portrait" />
          </div>
          <div className="about-content">
            <h2>{t('who_i_am')}</h2>
            <p>{t('intro_text')}</p>
            <p>{t('journey_text')}</p>

            {/* Download CV Button */}
            <a href={cvFile} download className="download-button">
              {t('download_cv')}
            </a>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="timeline-section">
          <h2>{t('my_journey')}</h2>
          <div className="timeline">
            {[
              {
                year: t('present'),
                title: t('internship_at_ccl'),
                description: t('internship_description'),
              },
              {
                year: "2024",
                title: t('mobile_dev_legacy'),
                description: t('mobile_dev_description'),
              },
              {
                year: "2023",
                title: t('full_stack_dev'),
                description: t('full_stack_description'),
              },
              {
                year: "2022",
                title: t('started_java_web'),
                description: t('started_java_web_description'),
              },
            ]
              .map((item, index) => (
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
          {t('footer_text')} {new Date().getFullYear()}.
        </footer>
      </div>
    </div>
  );
};

export default AboutMe;
