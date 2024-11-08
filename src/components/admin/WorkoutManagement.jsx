import { useState, useEffect } from "react";
import { ref, onValue, set, remove, update } from "firebase/database";
import { database } from "../../firebase/firebase";

const WorkoutManagement = () => {
  const [workouts, setWorkouts] = useState([]);
  const [editedWorkout, setEditedWorkout] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    workoutName: "",
    difficultyLevel: "Easy",
    exerciseDuration: 0,
    imageUrl: "",
  });

  useEffect(() => {
    const workoutsRef = ref(database, "workouts");
    onValue(workoutsRef, (snapshot) => {
      const data = snapshot.val();
      const workoutsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setWorkouts(workoutsArray);
    });
  }, []);

  const handleEditClick = (workout) => {
    setEditedWorkout(workout);
  };

  const handleSave = () => {
    if (editedWorkout) {
      update(ref(database, `workouts/${editedWorkout.id}`), {
        workoutName: editedWorkout.workoutName,
        difficultyLevel: editedWorkout.difficultyLevel,
        exerciseDuration: editedWorkout.exerciseDuration,
      });
      setEditedWorkout(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewWorkoutChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewWorkout = async () => {
    if (
      newWorkout.workoutName &&
      newWorkout.exerciseDuration > 0 &&
      newWorkout.imageUrl
    ) {
      const workoutId = Date.now().toString();

      const workoutWithImageUrl = {
        workoutName: newWorkout.workoutName,
        difficultyLevel: newWorkout.difficultyLevel,
        exerciseDuration: newWorkout.exerciseDuration,
        imageUrl: newWorkout.imageUrl,
      };

      set(ref(database, `workouts/${workoutId}`), workoutWithImageUrl);

      setNewWorkout({
        workoutName: "",
        difficultyLevel: "Easy",
        exerciseDuration: 0,
        imageUrl: "",
      });
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    remove(ref(database, `workouts/${workoutId}`));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Workouts</h2>

      <h3 className="text-lg font-semibold mb-2">Add New Workout</h3>
      <input
        aria-label="workout name"
        type="text"
        name="workoutName"
        value={newWorkout.workoutName}
        onChange={handleNewWorkoutChange}
        placeholder="Workout Name"
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
      />
      <select
        aria-label="difficulty level"
        name="difficultyLevel"
        value={newWorkout.difficultyLevel}
        onChange={handleNewWorkoutChange}
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <input
        aria-label="duration"
        type="number"
        name="exerciseDuration"
        value={newWorkout.exerciseDuration}
        onChange={handleNewWorkoutChange}
        placeholder="Duration (minutes)"
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
        min="1"
      />
      <input
        aria-label="image url"
        type="text"
        name="imageUrl"
        value={newWorkout.imageUrl}
        onChange={handleNewWorkoutChange}
        placeholder="Image URL"
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleAddNewWorkout}
        className="mb-4 px-4 py-2 text-white rounded-md"
        style={{ backgroundColor: "#095826" }}
      >
        Add Workout
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="p-4 border border-gray-200 rounded-md shadow-sm"
          >
            {editedWorkout && editedWorkout.id === workout.id ? (
              <div>
                <input
                  type="text"
                  name="workoutName"
                  value={editedWorkout.workoutName}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                />
                <select
                  name="difficultyLevel"
                  value={editedWorkout.difficultyLevel}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <input
                  type="number"
                  name="exerciseDuration"
                  value={editedWorkout.exerciseDuration}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  min="1"
                />
                <button onClick={handleSave} className="mt-2 text-blue-600">
                  Save
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={workout.imageUrl}
                  alt={workout.workoutName}
                  className="h-50 w-full object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold">{workout.workoutName}</h3>
                <p className="text-red-600">
                  Difficulty Level: {workout.difficultyLevel}
                </p>
                <p className="text-red-600 mb-3">
                  Duration: {workout.exerciseDuration} minutes
                </p>
                <button
                  onClick={() => handleEditClick(workout)}
                  style={{ color: "#274891" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  className="ml-2"
                  style={{ color: "#791b1b" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutManagement;
