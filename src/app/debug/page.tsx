"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { user } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleManualSync = async () => {
    if (!user) {
      setStatus("No user logged in");
      return;
    }

    setIsLoading(true);
    try {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const name = `${firstName} ${lastName}`.trim();

      await syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: name,
        image: user.imageUrl,
      });

      setStatus("User synced successfully!");
    } catch (error) {
      console.error("Error syncing user:", error);
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Tools</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Manual User Sync</h2>

        {user ? (
          <div className="mb-4">
            <p>
              <span className="font-medium">User ID:</span> {user.id}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {user.primaryEmailAddress?.emailAddress}
            </p>
            <p>
              <span className="font-medium">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </p>
          </div>
        ) : (
          <p className="mb-4 text-red-500">No user logged in</p>
        )}

        <button
          onClick={handleManualSync}
          disabled={isLoading || !user}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Syncing..." : "Manually Sync User"}
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded ${status.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
