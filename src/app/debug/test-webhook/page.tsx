"use client";

import { useState } from "react";

export default function TestWebhook() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [testMethod, setTestMethod] = useState("direct");

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      setTestResult("Please enter a webhook URL");
      return;
    }

    setLoading(true);
    setTestResult("Testing webhook connection...");

    try {
      if (testMethod === "direct") {
        // Direct browser fetch (may fail due to CORS)
        try {
          const response = await fetch(webhookUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const text = await response.text();
          setTestResult(`Response status: ${response.status}, Body: ${text}`);
        } catch (error) {
          setTestResult(
            `Browser fetch failed (likely CORS issue): ${error instanceof Error ? error.message : String(error)}\n\nTry using the Terminal command below instead.`
          );
        }
      } else {
        // Show curl command to test from terminal
        setTestResult(`Run this command in your terminal to test without CORS issues:
        
curl -X GET ${webhookUrl}

If you want to test with POST (which is what Clerk uses):

curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"type":"test"}'
        `);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Webhook Connection Test</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-ngrok-url/clerk-webhook"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Test Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="direct"
                checked={testMethod === "direct"}
                onChange={() => setTestMethod("direct")}
                className="mr-2"
              />
              Browser Request (May fail due to CORS)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="curl"
                checked={testMethod === "curl"}
                onChange={() => setTestMethod("curl")}
                className="mr-2"
              />
              Show curl Command
            </label>
          </div>
        </div>

        <button
          onClick={handleTestWebhook}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test Webhook Connection"}
        </button>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded border">
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {testResult}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Common Webhook Issues</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Webhook URL must be publicly accessible (ngrok provides this)</li>
          <li>Make sure your Convex server is running (npx convex dev)</li>
          <li>Path should be exactly /clerk-webhook (check for typos)</li>
          <li>Secrets must match exactly (case-sensitive)</li>
          <li>
            Browser CORS issues may block webhook requests (use curl instead)
          </li>
          <li>
            Ngrok URLs expire - check if your ngrok is still running with the
            same URL
          </li>
          <li>Webhook endpoints often only accept POST requests, not GET</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Debug Checklist</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Verify ngrok is running and note the current URL</li>
          <li>
            Update the webhook URL in Clerk dashboard if ngrok URL changed
          </li>
          <li>
            Make sure your Convex server is running with{" "}
            <code>npx convex dev</code>
          </li>
          <li>
            Check Convex logs with <code>npx convex logs</code> to see webhook
            attempts
          </li>
          <li>Try registering a new user to trigger a webhook event</li>
          <li>If all else fails, use the manual sync page at /debug</li>
        </ol>
      </div>
    </div>
  );
}
