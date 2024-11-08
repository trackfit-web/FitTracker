import { useState, useEffect } from "react";
import { ref, onValue, set, push } from "firebase/database";
import { database } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";

const SearchWorkouts = () => {
  const currentUser = auth.currentUser;
  const [searchTerm, setSearchTerm] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [myWorkoutPlan, setMyWorkoutPlan] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const workoutsRef = ref(database, "workouts");
    onValue(workoutsRef, (snapshot) => {
      const data = snapshot.val();
      const workoutsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setWorkouts(workoutsArray);
      setFilteredWorkouts(workoutsArray);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const myWorkoutsRef = ref(database, `myWorkouts/${currentUser.uid}`);
      onValue(myWorkoutsRef, (snapshot) => {
        const data = snapshot.val();
        const myWorkoutsArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
        setMyWorkoutPlan(myWorkoutsArray);
      });
    }
  }, [currentUser]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = workouts.filter(
      (workout) =>
        workout.workoutName.toLowerCase().includes(value.toLowerCase()) ||
        workout.difficultyLevel.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredWorkouts(filtered);
  };

  const addToWorkoutPlan = (workout) => {
    if (currentUser) {
      const workoutExists = myWorkoutPlan.some(
        (myWorkout) => myWorkout.id === workout.id
      );

      if (workoutExists) {
        setStatusMessage("Workout already in your plan!");
        setTimeout(() => setStatusMessage(""), 3000);
        return;
      }

      const myWorkoutsRef = ref(
        database,
        `users/${currentUser.uid}/myWorkouts`
      );
      const newWorkoutRef = push(myWorkoutsRef);
      set(newWorkoutRef, workout);

      setMyWorkoutPlan((prev) => [...prev, workout]);
      setStatusMessage("Workout added to your plan!");

      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search Workouts</h2>
      <input
        aria-label="search"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name or difficulty"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      {statusMessage && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="p-4 border border-gray-200 rounded-md shadow-sm"
          >
            <img
              src={workout.imageUrl}
              alt={workout.workoutName}
              className="h-32 w-full object-cover mb-4 rounded-md"
            />
            <h3 className="text-lg font-semibold">{workout.workoutName}</h3>
            <p className="text-red-600">
              Difficulty Level: {workout.difficultyLevel}
            </p>
            <p className="text-red-600 mb-3">
              Duration: {workout.exerciseDuration} minutes
            </p>
            <button
              onClick={() => addToWorkoutPlan(workout)}
              className="px-4 py-2 bg-red-800 text-white rounded-md"
            >
              Add to My Workouts
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchWorkouts;
