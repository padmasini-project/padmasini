import React, { useState } from 'react';
import './ManageAccount.css';

const defaultSubjects = {
  jee: ['Physics', 'Chemistry', 'Maths'],
  neet: ['Physics', 'Chemistry', 'Zoology', 'Botany'],
};

const getStandardsForCard = (cardId) => {
  switch (cardId) {
    case 'class1-5':
      return ['1', '2', '3', '4', '5'];
    case 'class6-12':
      return ['6', '7', '8', '9', '10', '11', '12'];
    case 'jee':
    case 'neet':
      return ['11', '12'];
    default:
      return [];
  }
};

const getCardsForMode = (mode) => {
  if (mode === 'academics') {
    return [
      { value: 'kindergarten', label: 'Kindergarten' },
      { value: 'class1-5', label: 'Class 1 - 5' },
      { value: 'class6-12', label: 'Class 6 - 12' },
    ];
  } else if (mode === 'professional') {
    return [
      { value: 'jee', label: 'JEE' },
      { value: 'neet', label: 'NEET' },
    ];
  }
  return [];
};

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    newSubject: '',
    access: {
      mode: '',
      cardId: '',
      subjects: [],
      standard: '',
    },
  });

  const handleCardChange = (e) => {
    const cardId = e.target.value;
    const defaultSubjs = defaultSubjects[cardId] || [];
    setFormData((prev) => ({
      ...prev,
      access: {
        ...prev.access,
        cardId,
        standard: '',
        subjects: defaultSubjs,
      },
    }));
  };

  const handleSubjectChange = (subject) => {
    const current = formData.access.subjects;
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];

    setFormData({
      ...formData,
      access: {
        ...formData.access,
        subjects: updated,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userToSave = { ...formData };
    delete userToSave.newSubject;

    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = userToSave;
      setUsers(updated);
      setEditIndex(null);
    } else {
      setUsers([...users, userToSave]);
    }

    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      newSubject: '',
      access: {
        mode: '',
        cardId: '',
        subjects: [],
        standard: '',
      },
    });
  };


  const handleDelete = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...users[index], newSubject: '' });
  };


  const subjectOptions = {
    academics: ['Math', 'English', 'Science'],
    professional: ['Aptitude', 'Reasoning'],
    jee: defaultSubjects.jee,
    neet: defaultSubjects.neet,
  };

  return (
    <div className="manage-container">
      <h2>Manage Users</h2>

      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <label>Role:</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === 'user' && (
          <div className="restrictions">
            <label>Mode:</label>
            <select
              value={formData.access.mode}
              onChange={(e) => {
                const mode = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  access: {
                    ...prev.access,
                    mode,
                    cardId: '',
                    standard: '',
                    subjects: [],
                  },
                }));
              }}
            >
              <option value="">-- Select --</option>
              <option value="academics">Academics</option>
              <option value="professional">Professional</option>
            </select>

            <label>Card:</label>
            <select
              value={formData.access.cardId}
              onChange={handleCardChange}
              disabled={!formData.access.mode}
            >
              <option value="">-- Select --</option>
              {getCardsForMode(formData.access.mode).map((card) => (
                <option key={card.value} value={card.value}>
                  {card.label}
                </option>
              ))}
            </select>

            {formData.access.cardId !== 'kindergarten' &&
              getStandardsForCard(formData.access.cardId).length > 0 && (
                <>
                  <label>Standard:</label>
                  <select
                    value={formData.access.standard}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        access: { ...formData.access, standard: e.target.value },
                      })
                    }
                  >
                    <option value="">-- Select Standard --</option>
                    {getStandardsForCard(formData.access.cardId).map((std) => (
                      <option key={std} value={std}>
                        {std}
                      </option>
                    ))}
                  </select>
                </>
              )}

            <label>Subjects:</label>
            <div className="subject-options">
{(subjectOptions[formData.access.cardId] || []).length > 0 ? (
  (subjectOptions[formData.access.cardId] || []).map((subject) => (
    <label key={subject}>
      <input
        type="checkbox"
        checked={formData.access.subjects.includes(subject)}
        onChange={() => handleSubjectChange(subject)}
      />
      {subject}
    </label>
  ))
) : (
  <>
    <div className="custom-subject-input">
      <input
        type="text"
        placeholder="Enter subject"
        value={formData.newSubject}
        onChange={(e) =>
          setFormData({ ...formData, newSubject: e.target.value })
        }
      />
      <button
        type="button"
        onClick={() => {
          const newSubj = formData.newSubject.trim();
          if (
            newSubj &&
            !formData.access.subjects.includes(newSubj)
          ) {
            setFormData((prev) => ({
              ...prev,
              newSubject: '',
              access: {
                ...prev.access,
                subjects: [...prev.access.subjects, newSubj],
              },
            }));
          }
        }}
      >
        Add
      </button>
    </div>
    <ul className="subject-list">
      {formData.access.subjects.map((subject) => (
        <li key={subject}>
          {subject}
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                access: {
                  ...prev.access,
                  subjects: prev.access.subjects.filter((s) => s !== subject),
                },
              }));
            }}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  </>
)}
            </div>
          </div>
        )}

        <button type="submit">{editIndex !== null ? 'Update User' : 'Create User'}</button>
      </form>

      <div className="user-list">
        <h3>Existing Users</h3>
        <ul>
          {users.map((u, idx) => (
            <li key={idx}>
              <strong>{u.name}</strong> ({u.email}) - {u.role}
              {u.role === 'user' && (
                <div className="access-summary">
                  Access: {u.access.mode}, {u.access.cardId},{' '}
                  {u.access.subjects.join(', ')}, Std {u.access.standard}
                </div>
              )}
              <button onClick={() => handleEdit(idx)}>Edit</button>
              <button onClick={() => handleDelete(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageAccount;
