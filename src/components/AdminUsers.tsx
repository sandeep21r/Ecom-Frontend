import { useEffect, useState } from "react";

interface IUser {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role: "user" | "admin";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const token = localStorage.getItem("authToken");

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://ecom-backend-9qo4.onrender.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✏️ Start editing
  const enableEdit = (id: string, currentRole: string) => {
    setEditingUser(id);
    setNewRole(currentRole);
  };

  // 🚀 Confirm + Update user role
  const submitUpdate = async (userId: string) => {
    const confirmed = window.confirm("Do you want to submit the changes?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://ecom-backend-9qo4.onrender.com/api/admin/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();
      console.log("Update response:", data);
      if (data.success) {
        alert("Updated successfully ✔️");

        // Update UI locally
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: newRole as any } : u
          )
        );

        setEditingUser(null);
      } else {
        alert("Update failed ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 md:px-12 lg:px-20">
      <h1 className="text-4xl font-semibold mb-6">Manage Users</h1>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name || "—"}</td>
                <td className="p-3">{u.email || "—"}</td>
                <td className="p-3">{u.phoneNumber || "—"}</td>

                <td className="p-3">
                  {editingUser === u._id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="font-medium">{u.role}</span>
                  )}
                </td>

                <td className="p-3">
                  {editingUser === u._id ? (
                    <button
                      onClick={() => submitUpdate(u._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => enableEdit(u._id, u.role)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
