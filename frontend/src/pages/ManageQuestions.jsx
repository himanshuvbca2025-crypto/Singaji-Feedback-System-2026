import { useState } from "react";
import Modal from "../components/Modal.jsx";
import "./ManageQuestions.css";

function ManageQuestions() {
  const [questions, setQuestions] = useState([
    {
      id: "1",
      number: 1,
      text: "How effectively does the faculty cover the course syllabus on schedule?",
      category: "Teaching",
      status: "Active",
    },
    {
      id: "2",
      number: 2,
      text: "Does the faculty communicate concepts clearly and encourage student queries?",
      category: "Communication",
      status: "Active",
    },
    {
      id: "3",
      number: 3,
      text: "How well does the faculty demonstrate in-depth knowledge of the subject matter?",
      category: "Subject Knowledge",
      status: "Active",
    },
    {
      id: "4",
      number: 4,
      text: "Is classroom decorum and discipline maintained during lectures?",
      category: "Classroom Management",
      status: "Active",
    },
    {
      id: "5",
      number: 5,
      text: "Overall rating for the faculty member's teaching quality.",
      category: "Overall Experience",
      status: "Active",
    },
  ]);

  const categories = [
    "Teaching",
    "Communication",
    "Subject Knowledge",
    "Classroom Management",
    "Overall Experience",
  ];

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    category: "Teaching",
    status: "Active",
  });

  const [editingQuestion, setEditingQuestion] = useState(null);

  // Add question handler
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.text.trim()) return;

    const created = {
      id: Date.now().toString(),
      number: questions.length + 1,
      ...newQuestion,
    };

    setQuestions([...questions, created]);
    setNewQuestion({ text: "", category: "Teaching", status: "Active" });
    setIsAddModalOpen(false);
  };

  // Edit question handler
  const handleOpenEdit = (q) => {
    setEditingQuestion({ ...q });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.text.trim()) return;

    setQuestions(
      questions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q))
    );
    setIsEditModalOpen(false);
    setEditingQuestion(null);
  };

  // Delete question handler
  const handleOpenDelete = (q) => {
    setEditingQuestion(q);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!editingQuestion) return;
    const updated = questions.filter((q) => q.id !== editingQuestion.id);
    // Re-number
    const renumbered = updated.map((q, idx) => ({ ...q, number: idx + 1 }));
    setQuestions(renumbered);
    setIsDeleteModalOpen(false);
    setEditingQuestion(null);
  };

  return (
    <div className="manage-questions-page">
      <div className="questions-header">
        <div>
          <h1>Manage Feedback Questions</h1>
          <p>Create, update, or reorganize questions included in student feedback forms.</p>
        </div>

        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          + Add Question
        </button>
      </div>

      <div className="questions-list">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="q-number-badge">Q{q.number}</div>

              <div className="q-content">
                <h3>{q.text}</h3>
                <div className="q-meta">
                  <span className="q-category-tag">{q.category}</span>
                  <span
                    className={`q-status-tag ${
                      q.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              </div>

              <div className="q-actions">
                <button className="btn-edit" onClick={() => handleOpenEdit(q)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleOpenDelete(q)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-box">No feedback questions available. Add a question to get started.</div>
        )}
      </div>

      {/* ADD QUESTION MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Feedback Question"
      >
        <form onSubmit={handleAddQuestion} className="question-modal-form">
          <div className="modal-form-group">
            <label>Question Text</label>

            <textarea
              rows="3"
              placeholder="Type evaluation question here..."
              value={newQuestion.text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, text: e.target.value })
              }
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Category</label>
            <select
              value={newQuestion.category}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label>Status</label>
            <select
              value={newQuestion.status}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Question
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT QUESTION MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Question"
      >
        {editingQuestion && (
          <form onSubmit={handleSaveEdit} className="question-modal-form">
            <div className="modal-form-group">
              <label>Question Text</label>
              <textarea
                rows="3"
                value={editingQuestion.text}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    text: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="modal-form-group">
              <label>Category</label>
              <select
                value={editingQuestion.category}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-form-group">
              <label>Status</label>
              <select
                value={editingQuestion.status}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Question"
      >
        <div className="confirm-delete-body">
          <span className="confirm-icon">🗑️</span>
          <p>
            Are you sure you want to delete Question {editingQuestion?.number}?
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default ManageQuestions;
