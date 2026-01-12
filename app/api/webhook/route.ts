import createUser from "@/app/lib/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret = process.env.WEBHOOK_SECRET!;

export async function POST(req: Request) {
  if (!webhookSecret) {
    return new Response("WEBHOOK_SECRET is not set", { status: 500 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = JSON.stringify(await req.json());
  const svix = new Webhook(webhookSecret);

  let msg: WebhookEvent;

  try {
    msg = svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK_VERIFY_ERROR]", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (msg.type) {
    case "user.created": {
      const data = msg.data;

      const user = await createUser({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatar: data.image_url,
        username: data.username ?? undefined,
      });
      console.log("🚀 route.ts:48 - user:", user, data);
      console.log("[WEBHOOK RECEIVED]", msg.type, JSON.stringify(msg.data));

      return NextResponse.json({
        message: "User created",
        user, // gộp vào object
      });
    }

    case "user.updated": {
      console.log("User updated:", msg.data);
      return NextResponse.json({ message: "User updated" });
    }

    default:
      console.log("Unhandled event:", msg.type);
      return NextResponse.json({ message: "Event ignored" });
  }
}
