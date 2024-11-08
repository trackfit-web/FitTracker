import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState("");

  useEffect(() => {
    const feedbacksRef = ref(database, "users");

    // Fetch feedbacks from all users
    onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      const allFeedbacks = [];

      if (data) {
        Object.keys(data).forEach((userId) => {
          const userFeedbacks = data[userId].feedbacks;
          if (userFeedbacks) {
            Object.values(userFeedbacks).forEach((feedback) => {
              allFeedbacks.push({
                ...feedback,
              });
            });
          }
        });
      }

      setFeedbacks(allFeedbacks);
    });
  }, []);

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    filterRating ? feedback.rating === parseInt(filterRating) : true
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Feedback</h2>
      <div className="mb-4">
        <label htmlFor="ratingFilter" className="mr-2">
          Filter by Rating:
        </label>
        <select
          id="ratingFilter"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">All</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback.feedbackId}
            className="p-4 border border-gray-200 rounded-md shadow-sm"
          >
            <h3 className="text-lg font-semibold">{feedback.feedbackText}</h3>
            <p className="text-red-500">
              Date Submitted: {feedback.dateSubmitted}
            </p>
            <p className="text-red-600 mb-2">Rating: {feedback.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackManagement;
