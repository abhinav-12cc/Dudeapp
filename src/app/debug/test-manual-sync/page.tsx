"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function TestManualSync() {
  const { user } = useUser();
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSimulateWebhook = async () => {
    if (!user) {
      setResult("You must be logged in to test this feature");
      return;
    }

    setLoading(true);
    setResult("Simulating webhook...");

    try {
      // Create a payload similar to what Clerk would send
      const payload = {
        type: "user.created",
        data: {
          id: user.id,
          email_addresses: [
            { email_address: user.primaryEmailAddress?.emailAddress || "" },
          ],
          first_name: user.firstName || "",
          last_name: user.lastName || "",
          image_url: user.imageUrl,
        },
      };

      // Send it to our webhook endpoint
      const response = await fetch("/api/clerk-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": "test-id-" + Date.now(),
          "svix-timestamp": new Date().toISOString(),
          "svix-signature": "skip-verification", // This won't pass verification but we'll modify our endpoint to handle it
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Webhook Simulation</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

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
          onClick={handleSimulateWebhook}
          disabled={loading || !user}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Simulating..." : "Simulate Webhook"}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded border overflow-auto">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Webhook Debug Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Make sure you are logged in with Clerk</li>
          <li>Click the "Simulate Webhook" button above</li>
          <li>Check your terminal for detailed webhook logs</li>
          <li>
            After simulation, check the user list at{" "}
            <a
              href="/debug/delete-user"
              className="text-blue-600 hover:underline"
            >
              /debug/delete-user
            </a>
          </li>
          <li>If the user appears in the list, the webhook is working</li>
          <li>
            If the user doesn't appear, there's an issue with the Convex
            integration
          </li>
        </ol>
      </div>
    </div>
  );
}
