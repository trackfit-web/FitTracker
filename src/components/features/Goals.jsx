import { useEffect, useState } from "react";
import { ref, set, remove, onValue } from "firebase/database";
import { auth, database } from "../../firebase/firebase";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [goalId, setGoalId] = useState(null);
  const [status, setStatus] = useState("Pending");
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get current user UID

  useEffect(() => {
    if (userId) {
      const goalsRef = ref(database, `users/${userId}/goals`);
      onValue(goalsRef, (snapshot) => {
        const data = snapshot.val();
        const goalsArray = data ? Object.values(data) : [];
        setGoals(goalsArray);
      });
    }
  }, [userId]);

  const addGoal = () => {
    const newGoal = {
      goalId: Date.now(),
      goalType,
      goalValue,
      dateSet: new Date().toLocaleDateString(),
      status,
    };

    if (userId) {
      const goalsRef = ref(database, `users/${userId}/goals/${newGoal.goalId}`);
      set(goalsRef, newGoal);
    }

    resetForm();
  };

  const updateGoal = (id) => {
    const updatedGoal = {
      goalId: id,
      goalType,
      goalValue,
      dateSet: new Date().toLocaleDateString(),
      status,
    };

    if (userId) {
      const goalsRef = ref(database, `users/${userId}/goals/${id}`);
      set(goalsRef, updatedGoal);
    }

    resetForm();
  };

  const removeGoal = (id) => {
    if (userId) {
      const goalsRef = ref(database, `users/${userId}/goals/${id}`);
      remove(goalsRef);
    }
  };

  const resetForm = () => {
    setGoalId(null);
    setGoalType("");
    setGoalValue("");
    setStatus("Pending");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Fitness Goals</h2>
      <div className="mb-6">
        <input
          aria-label="goal type"
          type="text"
          placeholder="Goal Type"
          value={goalType}
          onChange={(e) => setGoalType(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <input
          aria-label="goal value"
          type="text"
          placeholder="Goal Value"
          value={goalValue}
          onChange={(e) => setGoalValue(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <select
          aria-label="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Achieved">Achieved</option>
          <option value="Not Achieved">Not Achieved</option>
        </select>
        <button
          onClick={goalId ? () => updateGoal(goalId) : addGoal}
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
          {goalId ? "Update Goal" : "Add Goal"}
        </button>
      </div>
      <div>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal.goalId}
              className="p-4 border border-gray-200 rounded-md shadow-sm mb-4"
            >
              <h3 className="text-lg font-semibold">{goal.goalType}</h3>
              <p className="text-red-600">Goal Value: {goal.goalValue}</p>
              <p className="text-red-600">Date Set: {goal.dateSet}</p>
              <p className="text-red-600">Status: {goal.status}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setGoalId(goal.goalId);
                    setGoalType(goal.goalType);
                    setGoalValue(goal.goalValue);
                    setStatus(goal.status);
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
                  onClick={() => removeGoal(goal.goalId)}
                  className="inline-flex items-center justify-center rounded-full border border-red-800 py-2 px-4 text-center font-medium text-red-800 hover:bg-red-500 hover:text-white"
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
          <p className="text-center text-red-600">No goals set yet.</p>
        )}
      </div>
    </div>
  );
};

export default Goals;
