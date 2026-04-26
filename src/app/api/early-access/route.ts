import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "SignalWeaver <onboarding@resend.dev>",
      to: ["signalweaver.studio@gmail.com"],
      subject: `Early Access Request: ${name} (${email})`,
      text: `New early access request from signalweaver.com\n\nName: ${name}\nEmail: ${email}\nMessage: ${message || "Not provided"}\n`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
