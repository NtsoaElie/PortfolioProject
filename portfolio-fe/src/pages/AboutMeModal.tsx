import React, { useState, useEffect } from 'react';
import './Modal.css'; // reuse your modal styles

interface AboutMeData {
  intro_text: string;
  journey_text: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (data: AboutMeData) => void;
  initialValues?: AboutMeData;
}

const AboutMeModal: React.FC<ModalProps> = ({ isOpen, closeModal, onSubmit, initialValues }) => {
  const [introText, setIntroText] = useState('');
  const [journeyText, setJourneyText] = useState('');

  useEffect(() => {
    if (initialValues) {
      setIntroText(initialValues.intro_text || '');
      setJourneyText(initialValues.journey_text || '');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ intro_text: introText, journey_text: journeyText });
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit About Me</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="introText">Introduction Text</label>
            <textarea
              id="introText"
              placeholder="Introduction Text"
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="journeyText">Journey Text</label>
            <textarea
              id="journeyText"
              placeholder="Journey Text"
              value={journeyText}
              onChange={(e) => setJourneyText(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit">Save</button>
          </div>

          <div className="form-group">
            <button type="button" onClick={closeModal} className="close-modal-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutMeModal;
