// AdminHome.jsx
import React, { useState } from 'react';
import { FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

const academicCards = [
  { id: 'kindergarten', subtitle: 'Kindergarten', title: 'Bright Beginnings' },
  { id: 'class1-5', subtitle: 'Class 1 - 5', title: 'Practice Zone' },
  { id: 'class6-12', subtitle: 'Class 6 - 12', title: 'Board Exam Kit' },
];

const professionalCards = [
  { id: 'jee', subtitle: 'JEE Exam', title: 'JEE Prep Material' },
  { id: 'neet', subtitle: 'NEET Exam', title: 'NEET Prep Material' },
];

const AdminHome = () => {
  const [subjectsByCard, setSubjectsByCard] = useState({});
  const [current, setCurrent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [mode, setMode] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState('');

  const navigate = useNavigate();

  const currentCardId = selectedCard?.id || null;
  const currentSubjects = currentCardId ? subjectsByCard[currentCardId] || [] : [];

  const handleAdd = () => {
    if (!current.trim() || currentCardId === null) return;
    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = Array.isArray(copy[currentCardId]) ? [...copy[currentCardId]] : [];
      arr.push(current.trim());
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleUpdate = () => {
    if (currentCardId === null || selectedIndex === null || !current.trim()) return;

    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[currentCardId] || [])];
      arr[selectedIndex] = current.trim();
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleDelete = () => {
    if (currentCardId === null || selectedIndex === null) return;

    setSubjectsByCard((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[currentCardId] || [])];
      arr.splice(selectedIndex, 1);
      copy[currentCardId] = arr;
      return copy;
    });
    setCurrent('');
    setSelectedIndex(null);
  };

  const handleSelectSubject = (idx, navigateToPage = false) => {
    setSelectedIndex(idx);
    setCurrent(currentSubjects[idx] || '');
    if (navigateToPage) {
      navigate('/adminright', {
        state: {
          cardId: currentCardId,
          subject: currentSubjects[idx],
        },
      });
    }
  };

  const handleCancelAll = () => {
    setSelectedIndex(null);
    setCurrent('');
    setMode(null);
    setSelectedCard(null);
    setSelectedStandard('');
  };

  const handleCancelSelection = () => {
    setSelectedIndex(null);
    setCurrent('');
  };

  const handleCardClick = (card) => {
    if (!subjectsByCard[card.id]) {
      let defaults = [];
      if (card.id === 'jee') {
        defaults = ['Physics', 'Chemistry', 'Maths'];
      } else if (card.id === 'neet') {
        defaults = ['Physics', 'Chemistry', 'Zoology', 'Botany'];
      }
      setSubjectsByCard((prev) => ({
        ...prev,
        [card.id]: defaults,
      }));
    }

    setSelectedIndex(null);
    setCurrent('');
    setSelectedStandard('');
    setSelectedCard(card);
  };

  return (
    <div className="container">
      <button className="dis" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <aside className={`sidebar ${menuOpen ? '' : 'hidden'}`}>
        <h2 className="sub">Subjects</h2>
        <ul>
          {selectedCard === null ? (
            <li className="empty">Select a card to see its subjects</li>
          ) : currentSubjects.length === 0 ? (
            <li className="empty">No subjects in this category</li>
          ) : (
            currentSubjects.map((subj, idx) => (
              <li
                key={idx}
                className={selectedIndex === idx ? 'active' : ''}
                onClick={() => handleSelectSubject(idx, true)}
              >
                <FiBook className="icon" />
                <span>{subj}</span>
              </li>
            ))
          )}
        </ul>
      </aside>

      <section className="main">
        <div className="header">
          {mode === null ? (
            <div className="mode-switch-container">
              <button className="mode-button uniform" onClick={() => setMode('academics')}>
                Academics
              </button>
              <button className="mode-button uniform" onClick={() => setMode('professional')}>
                Professional Training
              </button>
            </div>
          ) : (
            <>
              {(selectedCard?.id === 'jee' || selectedCard?.id === 'neet') ? (
                <div className="form">
                  <div className="selected-info">
                    <strong>Selected:</strong>&nbsp;
                    <span className="italic-text">
                      {selectedCard.title} ({selectedCard.subtitle})
                    </span>
                  </div>

                  <div className="standard-select">
                    <label>Select Standard:</label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="11">Standard 11</option>
                      <option value="12">Standard 12</option>
                    </select>
                  </div>

                  <div className="card-cancel-wrapper">
                    <button
                      className="card-cancel-button"
                      onClick={() => setSelectedCard(null)}
                    >
                      Back
                    </button>
                    <button className="card-cancel-button" onClick={handleCancelAll}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="subs">Subjects</h3>

                  <div className="summary-box">
                    {selectedCard === null ? (
                      <span>Select a card above to manage its subjects</span>
                    ) : currentSubjects.length === 0 ? (
                      <span>No subjects available in this card</span>
                    ) : (
                      <select
                        className="summary-dropdown"
                        value={selectedIndex ?? ''}
                        onChange={(e) => handleSelectSubject(Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Select a subject
                        </option>
                        {currentSubjects.map((subj, idx) => (
                          <option key={idx} value={idx}>
                            {subj}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedCard === null ? (
                    <div className="cards-wrapper">
                      <div className="cards-container">
                        {(mode === 'academics' ? academicCards : professionalCards).map((cardObj) => (
                          <div
                            key={cardObj.id}
                            className="card"
                            onClick={() => handleCardClick(cardObj)}
                          >
                            <div className="card-subtitle">{cardObj.subtitle}</div>
                            <div className="card-title">{cardObj.title}</div>
                            <button className="card-button">Select</button>
                          </div>
                        ))}
                      </div>
                      <div className="card-cancel-wrapper">
                        <button className="card-cancel-button" onClick={handleCancelAll}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="form">
                      <div className="selected-info">
                        <strong>Selected Card:</strong>&nbsp;
                        <span className="italic-text">
                          {selectedCard.title} ({selectedCard.subtitle})
                        </span>
                      </div>

                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                      />

                      <div className="buttons">
                        <button onClick={handleAdd}>Add New</button>
                        <button onClick={handleUpdate} disabled={selectedIndex === null}>
                          Update
                        </button>
                        <button onClick={handleDelete} disabled={selectedIndex === null}>
                          Delete
                        </button>
                        <button onClick={handleCancelSelection}>Cancel</button>
                      </div>

                      <div className="card-cancel-wrapper">
                        <button
                          className="card-cancel-button"
                          onClick={() => setSelectedCard(null)}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
