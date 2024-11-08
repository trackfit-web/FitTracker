import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";

const EditProfile = () => {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    gender: "",
    role: "user",
    logo: "",
    weight: "",
    height: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setFormData(snapshot.val());
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => {
        setFormData({ ...formData, logo: fileReader.result });
      };
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return;

    try {
      await update(ref(database, `users/${userId}`), formData);
      console.log("Updated User Data:", formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-black mb-6 text-center">
        Profile
      </h2>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-black font-medium mb-1">
              Email
            </label>
            <input
              aria-label="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-black font-medium mb-1">Name</label>
            <input
              aria-label="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-1">Age</label>
            <input
              aria-label="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-black font-medium mb-1">Gender</label>
          <select
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-black font-medium mb-1">Role</label>
            <select
              aria-label="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label className="block text-black font-medium mb-1">
              Weight (kg)
            </label>
            <input
              aria-label="weight"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-1">
              Height (cm)
            </label>
            <input
              aria-label="height"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
