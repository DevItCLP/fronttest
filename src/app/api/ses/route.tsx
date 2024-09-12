import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { NextResponse } from "next/server";
import { generateHtmlTemplate } from "@/app/components/template/templateEmail";

const sesClient = new SESClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESSKEY_SES as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_SES as string,
  },
});

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { toAddress, subject, template } = await req.json();

    const params = {
      Source: process.env.NEXT_PUBLIC_SES_SENDER_EMAIL as string,
      Destination: {
        ToAddresses: toAddress,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: template,
            Charset: "UTF-8",
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);

      const response = await sesClient.send(command);

      return NextResponse.json({
        success: true,
        message: `Successful email: ${response.MessageId}`,
      });
    } catch (error) {
      return NextResponse.json({
        success: error,
        message: "Fail to send mail",
      });
    }
  } else {
    console.error("This is no methos post");
  }
}
