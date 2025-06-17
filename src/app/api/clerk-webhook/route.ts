import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  console.log("========================");
  console.log("WEBHOOK RECEIVED at:", new Date().toISOString());

  // Log just key headers for debugging without iterator issues
  const headers = {
    "content-type": req.headers.get("content-type"),
    "svix-id": req.headers.get("svix-id"),
    "svix-timestamp": req.headers.get("svix-timestamp"),
    "svix-signature": req.headers.get("svix-signature"),
  };
  console.log("Request headers:", headers);

  try {
    // Get the headers
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    // Get the body
    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    let evt: any = payload;
    let isTestRequest = false;

    // If this is coming from our test page, bypass signature verification
    if (svix_signature === "skip-verification") {
      console.log(
        "This is a test request from our debug page, skipping verification"
      );
      isTestRequest = true;
    }
    // Otherwise do normal verification
    else {
      // Verify the webhook signature
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
        return NextResponse.json(
          { error: "Server misconfigured" },
          { status: 500 }
        );
      }

      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers");
        return NextResponse.json(
          { error: "Missing svix headers" },
          { status: 400 }
        );
      }

      const body = JSON.stringify(payload);

      // Create a new Svix instance with your secret
      const wh = new Webhook(webhookSecret);

      try {
        // Verify the payload with the headers
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return NextResponse.json(
          { error: "Error verifying webhook" },
          { status: 400 }
        );
      }
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log("Processing event type:", eventType);

    if (eventType === "user.created") {
      console.log(
        "Processing user.created event with data:",
        JSON.stringify(evt.data, null, 2)
      );

      try {
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;

        if (!email_addresses || !email_addresses.length) {
          console.error("Error: email_addresses is missing or empty");
          return NextResponse.json(
            { error: "Missing email address" },
            { status: 400 }
          );
        }

        const email = email_addresses[0].email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        // Call Convex mutation directly from the Next.js API route
        console.log("Calling Convex syncUser with:", {
          clerkId: id,
          email,
          name,
        });

        await convex.mutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });

        console.log(
          "User successfully synced to database via Next.js API route"
        );
      } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json(
          { error: "Error syncing user" },
          { status: 500 }
        );
      }
    }

    console.log("Webhook processed successfully");
    console.log("========================");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unhandled webhook error:", error);
    console.log("========================");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Clerk webhook endpoint is operational",
  });
}
