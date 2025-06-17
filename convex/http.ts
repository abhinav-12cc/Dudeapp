import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("Webhook received at:", new Date().toISOString());

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    console.log("Svix headers:", {
      "svix-id": svix_id ? "present" : "missing",
      "svix-signature": svix_signature ? "present" : "missing",
      "svix-timestamp": svix_timestamp ? "present" : "missing",
    });

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.error("Missing svix headers");
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    try {
      const payload = await request.json();
      console.log("Received payload with type:", payload.type);

      const body = JSON.stringify(payload);
      const wh = new Webhook(webhookSecret);

      try {
        const evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;

        console.log("Webhook verified successfully");
        const eventType = evt.type;
        console.log("Processing event type:", eventType);

        if (eventType === "user.created") {
          console.log(
            "Processing user.created event with data:",
            JSON.stringify(evt.data, null, 2)
          );
          const { id, email_addresses, first_name, last_name, image_url } =
            evt.data;

          if (!email_addresses || !email_addresses.length) {
            console.error("Error: email_addresses is missing or empty");
            return new Response(
              "Webhook processed but email_addresses is missing",
              { status: 200 }
            );
          }

          const email = email_addresses[0].email_address;
          const name = `${first_name || ""} ${last_name || ""}`.trim();

          console.log("Attempting to sync user with:", {
            clerkId: id,
            email,
            name,
          });

          try {
            await ctx.runMutation(api.users.syncUser, {
              clerkId: id,
              email,
              name,
              image: image_url,
            });
            console.log("User successfully synced to database");
          } catch (error) {
            console.error("Error creating user:", error);
            return new Response("Error creating user", { status: 500 });
          }
        } else {
          console.log("Event type not handled:", eventType);
        }

        return new Response("Webhook processed successfully", { status: 200 });
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook signature", {
          status: 400,
        });
      }
    } catch (err) {
      console.error("Error parsing webhook payload:", err);
      return new Response("Error parsing webhook payload", { status: 400 });
    }
  }),
});

export default http;
