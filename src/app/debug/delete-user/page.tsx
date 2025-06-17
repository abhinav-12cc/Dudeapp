"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function DeleteUser() {
  const users = useQuery(api.users.getUsers);
  const [message, setMessage] = useState<string>("");

  const handleDeleteUser = async (userId: string) => {
    try {
      setMessage(`Deleting user ${userId}...`);

      // Use fetch to call a special API route to delete the user
      const response = await fetch("/api/debug/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      const result = await response.json();

      setMessage(`User ${userId} deleted successfully!`);
      // Wait a bit before clearing the message
      setTimeout(() => {
        setMessage("");
        // Reload the page to refresh the user list
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Delete Users</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
        >
          {message}
        </div>
      )}

      {!users ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found in the database.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users in Database</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Clerk ID</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2 font-mono text-xs">{user._id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.clerkId}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <p className="text-gray-600">
          Note: Deleting users this way is for debugging purposes only. In a
          production environment, you should implement proper user management
          with appropriate safeguards.
        </p>
      </div>
    </div>
  );
}
