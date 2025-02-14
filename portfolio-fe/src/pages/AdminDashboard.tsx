import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Modal from "./Modal.tsx"; // Import Modal component
import { ProjectModel } from "../models/ProjectModel"; // Import Project model
import './AdminDashboard.css'
import { useTranslation } from "react-i18next";



// Define the Comment type
interface Comment {
  id: string;
  username: string;
  text: string;
  approved: boolean;
  timestamp: Date;
}

const AdminDashboard = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectModel | undefined>(undefined);
  const { t, i18n } = useTranslation(); // Initialize i18next translation hook

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };

  // Fetch all comments, regardless of approval status
  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          username: data.username || "Unknown",
          text: data.text || "No text",
          approved: data.approved ?? false, // Ensure 'approved' exists
          timestamp: data.timestamp?.toDate() || new Date(), // Convert Firestore timestamp
        };
      });
      setComments(fetchedComments);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all projects
  const getAllProjects = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/projects`, {
        headers: { Accept: "application/json" },
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

  // Approve a comment
  const handleApprove = async (commentId: string) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, { approved: true });
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  // Reject a comment
  const handleReject = async (commentId: string) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error rejecting comment:", error);
    }
  };

  // Handle Add, Edit, and Delete for Projects
  const handleAddProject = async (project: ProjectModel) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/projects", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(project),
      });
      if (response.ok) {
        getAllProjects(); // Refresh the project list
      }
    } catch (error) {
      console.error("Error adding project", error);
    }
  };

  const handleUpdateProject = async (updatedProject: ProjectModel) => {
    if (!updatedProject.projectId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/projects/${updatedProject.projectId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedProject),
        }
      );
      if (response.ok) {
        getAllProjects(); // Refresh the project list
      } else {
        console.error("Error updating project");
      }
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/projects/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        getAllProjects(); // Refresh the project list
      } else {
        console.error("Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };
  

  const openModalForAdd = () => {
    setSelectedProject(undefined);
    setModalOpen(true);
  };

  const openModalForUpdate = (project: ProjectModel) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(undefined);
  };

  const goHome = () => {
    // Replace with your navigation logic
  };

  return (
    <div>
      <h2>{t("dashboard")}</h2>

      {/* Logout Button */}
      <button onClick={() => signOut(auth)}>{t("logout")}</button>

        {/* Language Switcher */}
        <div className="language-switcher">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('fr')}>Français</button>
        </div>

      {/* Comment Management */}
      <h3>{t("manage_comments")}</h3>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.username}</strong>: {c.text} <br />
            <span>{t("approval_status")} {c.approved ? t("approved_message") : t("pending_message")}</span>
            <div>
              {!c.approved ? (
                <>
                  <button onClick={() => handleApprove(c.id)}>{t("approve")}</button>
                  <button onClick={() => handleReject(c.id)}>{t("reject")}</button>
                </>
              ) : (
                <span>{t("approved_message")}</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Project Management */}
      <h3>{t("manage_project")}</h3>
      <button onClick={openModalForAdd}>{t("add_project")}</button>
      <ul>
        {projects.map((project) => (
          <li key={project.projectId}>
            <h4>{project.projectName}</h4>
            <p>{project.projectDescription}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {t("view_project")}
            </a>
            <button onClick={() => openModalForUpdate(project)}>{t("edit")}</button>
            <button onClick={() => project.projectId && handleDeleteProject(project.projectId)}>
              {t("delete")}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for Add/Update Project */}
      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        onSubmit={selectedProject ? handleUpdateProject : handleAddProject}
        project={selectedProject}
      />
    </div>
  );
};

export default AdminDashboard;
