import { useEffect, useState } from "react";
import { ref, set, remove, onValue } from "firebase/database";
import { auth, database } from "../../firebase/firebase";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackId, setFeedbackId] = useState(null);
  const [rating, setRating] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (userId) {
      const feedbacksRef = ref(database, `users/${userId}/feedbacks`);
      onValue(feedbacksRef, (snapshot) => {
        const data = snapshot.val();
        const feedbackArray = data ? Object.values(data) : [];
        setFeedbacks(feedbackArray);
      });
    }
  }, [userId]);

  const addFeedback = () => {
    const newFeedback = {
      feedbackId: Date.now(),
      feedbackText,
      rating: parseInt(rating),
      dateSubmitted: new Date().toLocaleDateString(),
    };

    if (userId) {
      const feedbacksRef = ref(
        database,
        `users/${userId}/feedbacks/${newFeedback.feedbackId}`
      );
      set(feedbacksRef, newFeedback);
    }

    resetForm();
  };

  const updateFeedback = (id) => {
    const updatedFeedback = {
      feedbackId: id,
      feedbackText,
      rating: parseInt(rating),
      dateSubmitted: new Date().toLocaleDateString(),
    };

    if (userId) {
      const feedbacksRef = ref(database, `users/${userId}/feedbacks/${id}`);
      set(feedbacksRef, updatedFeedback);
    }

    resetForm();
  };

  const removeFeedback = (id) => {
    if (userId) {
      const feedbacksRef = ref(database, `users/${userId}/feedbacks/${id}`);
      remove(feedbacksRef);
    }
  };

  const resetForm = () => {
    setFeedbackId(null);
    setFeedbackText("");
    setRating("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
      <div className="mb-6">
        <textarea
          aria-label="feedback"
          placeholder="Your Feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <select
          aria-label="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        >
          <option value="">Select Rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Very Poor</option>
        </select>
        <button
          onClick={feedbackId ? () => updateFeedback(feedbackId) : addFeedback}
          className="inline-flex items-center justify-center rounded-full border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-opacity-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {feedbackId ? "Update Feedback" : "Add Feedback"}
        </button>
      </div>
      <div>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div
              key={feedback.feedbackId}
              className="p-4 border border-gray-200 rounded-md shadow-sm mb-4"
            >
              <p className="text-red-600">{feedback.feedbackText}</p>
              <p className="text-red-600">Rating: {feedback.rating} / 5</p>
              <p className="text-red-600">
                Date Submitted: {feedback.dateSubmitted}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setFeedbackId(feedback.feedbackId);
                    setFeedbackText(feedback.feedbackText);
                    setRating(feedback.rating);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-yellow-900 py-2 px-4 text-center font-medium text-yellow-900 hover:bg-yellow-900 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 4h4a2 2 0 012 2v4m-6-6L4 16l-2 2 2-2m2 2l14-14"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => removeFeedback(feedback.feedbackId)}
                  className="inline-flex items-center justify-center rounded-full border border-red-800 py-2 px-4 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-red-600">No feedback given yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
