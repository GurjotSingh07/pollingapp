import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [editingPoll, setEditingPoll] = useState(null);
  const [deletedOptions, setDeletedOptions] = useState([]);

  const [question, setQuestion] = useState('');
  const [point, setPoint] = useState('');
  const [point2, setPoint2] = useState('');
  const [point3, setPoint3] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:3001/register', {
        question,
        point,
        point2,
        point3,
      });
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getusers');
        setStudents(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleVote = (pollId, selectedOption) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId ? { ...poll, selectedOption } : poll
      )
    );
  };

  const handleAddOption = () => {
    setEditingPoll((prevPoll) => {
      if (!prevPoll) return null;

      return {
        ...prevPoll,
        options: [...prevPoll.options, ''],
      };
    });
  };

  const handleDeleteOption = (optionIndex) => {
    setEditingPoll((prevPoll) => {
      if (!prevPoll) return null;

      const updatedOptions = [...prevPoll.options];
      updatedOptions.splice(optionIndex, 1);

      return {
        ...prevPoll,
        options: updatedOptions,
      };
    });
  };

  const handleDeletePoll = (pollId) => {
    setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
  };

  const handleCreatePoll = () => {
    if (
      newPoll.question.trim() === '' ||
      newPoll.options.some((option) => option.trim() === '')
    ) {
      alert('Please fill in all fields before creating a new poll.');
      return;
    }

    setPolls((prevPolls) => [
      ...prevPolls,
      {
        id: prevPolls.length + 1,
        question: newPoll.question,
        options: newPoll.options.filter((option) => option.trim() !== ''),
        selectedOption: null,
      },
    ]);

    setNewPoll({ question: '', options: ['', ''] });
  };

  const handleEditPoll = (pollId) => {
    const pollToEdit = polls.find((poll) => poll.id === pollId);
    setEditingPoll(pollToEdit ? { ...pollToEdit } : null);
    setDeletedOptions([]);
  };

  const handleUpdatePoll = () => {
    if (
      !editingPoll ||
      editingPoll.question.trim() === '' ||
      editingPoll.options.some((option) => option.trim() === '')
    ) {
      alert('Please fill in all fields before updating the poll.');
      return;
    }

    const updatedOptions = editingPoll.options.filter(
      (_, index) => !deletedOptions.includes(index)
    );

    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === editingPoll.id
          ? { ...poll, question: editingPoll.question, options: updatedOptions }
          : poll
      )
    );

    setEditingPoll(null);
    setDeletedOptions([]);
  };

  const handleCloseModal = () => {
    setEditingPoll(null);
    setDeletedOptions([]);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Polling App</h1>

      <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
        <h2>Create a New Poll</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Question:
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            />
          </label>

          <label>Option 1</label>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <input
              type="text"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              style={{ flex: '1', padding: '5px' }}
            />
          </div>

          <label>Option 2</label>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <input
              type="text"
              value={point2}
              onChange={(e) => setPoint2(e.target.value)}
              style={{ flex: '1', padding: '5px' }}
            />
          </div>

          <label>Option 3</label>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <input
              type="text"
              value={point3}
              onChange={(e) => setPoint3(e.target.value)}
              style={{ flex: '1', padding: '5px' }}
            />
          </div>

          <button type="submit" style={{ background: '#2196F3', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Create Poll
          </button>
        </form>
      </div>

      {/* Existing Polls */}
      {polls.map((poll) => (
        <div key={poll.id} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
          <h2>{poll.question}</h2>
          <ul>
            {poll.options.map((option, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name={`poll${poll.id}`}
                    value={option}
                    checked={poll.selectedOption === option}
                    onChange={() => handleVote(poll.id, option)}
                    style={{ marginRight: '5px' }}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleEditPoll(poll.id)}
            style={{ background: '#FF9800', color: 'white', padding: '8px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}
          >
            Edit Poll
          </button>
          <button
            type="button"
            onClick={() => handleDeletePoll(poll.id)}
            style={{ background: '#f44336', color: 'white', padding: '8px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Delete Poll
          </button>
        </div>
      ))}

      {/* Edit Poll Modal */}
      {editingPoll && (
        <div className="modal" style={{ background: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', maxWidth: '400px', width: '100%' }}>
            <h2>Edit Poll</h2>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Question:
              <input
                type="text"
                value={editingPoll.question}
                onChange={(e) => setEditingPoll({ ...editingPoll, question: e.target.value })}
                style={{ width: '100%', padding: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Options:
              {editingPoll.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...editingPoll.options];
                      updatedOptions[index] = e.target.value;
                      setEditingPoll({ ...editingPoll, options: updatedOptions });
                    }}
                    style={{ flex: '1', padding: '5px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(index)}
                    style={{ marginLeft: '10px', padding: '5px', background: 'tomato', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                style={{ background: '#4CAF50', color: 'white', padding: '8px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Add Option
              </button>
            </label>
            <button
              type="button"
              onClick={handleUpdatePoll}
              style={{ background: '#2196F3', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}
            >
              Update Poll
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              style={{ background: '#ccc', padding: '10px 15px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px' }}>
        <h2>Results</h2>
        <ul>
          {students.map((student) => (
            <li key={student._id} style={{ marginBottom: '5px' }}>
              <h1>{student.question}</h1>
              <p>{student.point}</p>
              <p>{student.point2}</p>
              <p>{student.point3}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;