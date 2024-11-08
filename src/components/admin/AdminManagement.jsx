import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const adminsRef = ref(db, "admins");

    onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedAdmins = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAdmins(loadedAdmins);
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  // Add new admin
  const addAdmin = async () => {
    if (newAdmin.name && newAdmin.email && newAdmin.role) {
      setLoading(true);
      setError("");
      const auth = getAuth();
      const db = getDatabase();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          newAdmin.email,
          newAdmin.email
        );
        const userId = userCredential.user.uid;

        const adminsRef = ref(db, `admins/${userId}`);
        await set(adminsRef, {
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        });

        setNewAdmin({ name: "", email: "", role: "Admin" });
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setError(
            "The email address is already in use. Please use a different email."
          );
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAdmin = async (id) => {
    const auth = getAuth();
    const db = getDatabase();

    try {
      await remove(ref(db, `admins/${id}`));

      const user = auth.currentUser;
      if (user && user.uid === id) {
        await deleteUser(user);
      }
    } catch (error) {
      console.error("Error deleting admin: ", error.message);
    }
  };

  return (
    <div className="admin-management">
      <h2 className="text-lg font-semibold mb-4">Manage Admins</h2>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="bg-white">
              <td className="border px-4 py-2">{admin.id}</td>
              <td className="border px-4 py-2">{admin.name}</td>
              <td className="border px-4 py-2">{admin.email}</td>
              <td className="border px-4 py-2">{admin.role}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-800 text-white px-3 py-1 rounded"
                  onClick={() => deleteAdmin(admin.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <h3 className="font-medium mb-2">Add New Admin</h3>
        <input
          aria-label="name"
          type="text"
          name="name"
          placeholder="Name"
          value={newAdmin.name}
          onChange={handleInputChange}
          className="border px-3 py-2 mr-2"
        />
        <input
          aria-label="email"
          type="email"
          name="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={handleInputChange}
          className="border px-3 py-2 mr-2"
        />
        <button
          className=" text-white px-4 py-2 rounded"
          style={{ backgroundColor: "#214e97" }}
          onClick={addAdmin}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </div>
    </div>
  );
}

export default AdminManagement;
