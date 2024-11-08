import { useState, useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { auth, database } from "../../firebase/firebase";

const MyWorkouts = () => {
  const currentUser = auth.currentUser;
  const [searchTerm, setSearchTerm] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [activeTimers, setActiveTimers] = useState({});
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (currentUser) {
      const myWorkoutsRef = ref(database, `users/${userId}/myWorkouts`);
      get(myWorkoutsRef).then((snapshot) => {
        const data = snapshot.val();
        const myWorkoutsArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
        setWorkouts(myWorkoutsArray);
        setFilteredWorkouts(myWorkoutsArray);
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

  const startTimer = (workoutId, duration) => {
    setActiveTimers((prev) => ({
      ...prev,
      [workoutId]: duration * 60,
    }));
  };

  const removeWorkout = (workoutId) => {
    console.log(workoutId);
    if (currentUser) {
      const workoutRef = ref(
        database,
        `users/${userId}/myWorkouts/${workoutId}`
      );
      console.log("current user id :" + currentUser.uid);
      console.log("workout id :" + workoutId);
      console.log(
        "Attempting to remove from Firebase at:",
        workoutRef.toString()
      );

      remove(workoutRef)
        .then(() => {
          console.log("Workout removed successfully from Firebase");

          setFilteredWorkouts((prev) => {
            const newFilteredWorkouts = prev.filter(
              (workout) => workout.id !== workoutId
            );
            console.log(
              "Filtered Workouts after removal:",
              newFilteredWorkouts
            );
            return newFilteredWorkouts;
          });

          setWorkouts((prev) => {
            const newWorkouts = prev.filter(
              (workout) => workout.id !== workoutId
            );
            console.log("Workouts after removal:", newWorkouts);
            return newWorkouts;
          });
        })
        .catch((error) => {
          console.error("Error removing workout from Firebase:", error);
        });
    } else {
      console.error("User not authenticated");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveTimers((prev) => {
        const newTimers = { ...prev };
        let allTimersFinished = true;

        Object.keys(newTimers).forEach((id) => {
          if (newTimers[id] > 0) {
            newTimers[id] -= 1;
            allTimersFinished = false;
          }
        });

        if (allTimersFinished) {
          clearInterval(intervalId);
        }

        return newTimers;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeTimers]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Workout Plan</h2>
      <input
        aria-label="search-workouts"
        type="text"
        placeholder="Search by workout name or difficulty level"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout) => (
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
              {activeTimers[workout.id] !== undefined && (
                <p className="text-green-600 mb-3">
                  Timer: {Math.floor(activeTimers[workout.id] / 60)}:
                  {("0" + (activeTimers[workout.id] % 60)).slice(-2)}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    startTimer(workout.id, workout.exerciseDuration)
                  }
                  className="inline-flex items-center justify-center rounded-full border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-opacity-90"
                >
                  Start Timer
                </button>
                <button
                  onClick={() => removeWorkout(workout.id)}
                  className="inline-flex items-center justify-center rounded-full border border-red-800 py-2 px-4 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white"
                >
                  Remove Workout
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-red-600">
            No workouts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyWorkouts;
