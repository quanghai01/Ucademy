import createUser from "@/app/lib/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

  switch (msg.type) {
    case "user.created": {
      const data = msg.data;
      const user = await createUser({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatar: data.image_url,
        username: data.username ?? undefined, //
      });

      return NextResponse.json({
        message: "Ok",
        user,
      });
    }

    case "user.updated": {
      console.log("User updated:", msg.data);
      break;
    }

    default:
      console.log("Unhandled event:", msg.type);
  }

  // Rest

  return new Response("OK", { status: 200 });
}
