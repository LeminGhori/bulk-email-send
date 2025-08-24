import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { useremail, password, emailList, subject, content } = body;

    if (!useremail || !password || !emailList || !subject || !content) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: useremail,
        pass: password,
      },
    });

    for (const email of emailList) {
      await transporter.sendMail({
        from: useremail,
        to: email,
        subject,
        html: content,
      });
    }

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to send emails", error: error.message }),
      { status: 500 }
    );
  }
}
