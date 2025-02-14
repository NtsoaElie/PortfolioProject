import React, { useState, useEffect } from 'react';
import './Modal.css'; // Ensure the styles are imported correctly
import { ProjectModel } from '../models/ProjectModel';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (project: ProjectModel) => void;
  project?: ProjectModel;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, onSubmit, project }) => {
  // Initialize state based on project prop when modal opens
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [link, setLink] = useState('');

  // Update the state when the project prop changes (e.g., when editing a project)
  useEffect(() => {
    if (project) {
      setProjectName(project.projectName || '');
      setProjectDescription(project.projectDescription || '');
      setLink(project.link || '');
    } else {
      // Reset the state if we are adding a new project
      setProjectName('');
      setProjectDescription('');
      setLink('');
    }
  }, [project]); // Re-run the effect if the project prop changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProject = { ...project, projectName, projectDescription, link };
    onSubmit(updatedProject);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{project ? 'Update Project' : 'Add Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              id="projectName"
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDescription">Project Description</label>
            <textarea
              id="projectDescription"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Project Link</label>
            <input
              id="link"
              type="url"
              placeholder="Project Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit">{project ? 'Update' : 'Add'} Project</button>
          </div>

          <div className="form-group">
            <button type="button" onClick={closeModal} className="close-modal-button">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
