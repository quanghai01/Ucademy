import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";
  if (!webhookSecret) {
    throw new Error("WEBHOOK_SECRET is not set");
  }
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const sivx = new Webhook(webhookSecret);

  let msg: WebhookEvent;

  try {
    msg = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK_ERROR]", err);
    return new Response("Bad Request", { status: 400 });
  }

  const eventType = msg.type;
  switch (msg.type) {
    case "user.created":
      console.log("User created:", msg.data);
      break;

    case "user.updated":
      console.log("User updated:", msg.data);
      break;

    default:
      console.log("Unhandled event:", msg.type);
  }

  // Rest

  return new Response("OK", { status: 200 });
}
