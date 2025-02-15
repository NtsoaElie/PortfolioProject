import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ProjectModel } from "../models/ProjectModel";
import Modal from "./Modal.tsx"; // Import Modal component
import './Projects.css';
import { useTranslation } from "react-i18next";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<
    ProjectModel | undefined
  >(undefined);
  const { t, i18n } = useTranslation(); // Initialize i18next translation hook

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };



  const getAllProjects = async (): Promise<void> => {
    try {
      const response = await fetch(`http://178.128.227.59:8080/api/v1/projects`, {
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(undefined);
  };

  const goHome = () => {
    navigate("/");
  };

  return (

    
    <div className="projects-container">

       {/* Language Switcher
       <div className="language-switcher">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('fr')}>Français</button>
        </div> */}
      <button className="go-home-button" onClick={goHome}>
        {t("go_back_home")}
      </button>

      


      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="projects-content"
      >
        <h1 className="projects-title">{t("project_title")}</h1>
        <p className="projects-subtitle">
          {t("project_message")}
        </p>

        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.projectId} className="project-item">
              <h2 className="project-title">{project.projectName}</h2>
              <p className="project-description">
                {project.projectDescription}
              </p>
              <a
                href={project.link}
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View details of ${project.projectName}`}
              >
                {t("view_project")}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

    
    </div>
  );
};

export default Projects;
