export const recoveryEmailHTML = (reset_key: string): string => {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Password Recovery</h2>
        <p style="color: #555;">
          You recently requested to reset your password. Click the button below to reset it.
        </p>
        <div style="text-align: center; margin: 20px;">
          <a href="https://yourapp.com/reset-password?token=${reset_key}" 
             style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Recover Password
          </a>
        </div>
        <p style="color: #555;">
          If you did not request this password reset, please ignore this email or contact support.
        </p>
        <p style="color: #999; font-size: 12px;">
          © 2024 Knowsis. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

export const recoveryEmailText = (reset_key: string): string => {

  return `Password Recovery

    You recently requested to reset your password. Click the link below to reset it:

    https://yourapp.com/reset-password?token=${reset_key}

    If you did not request this password reset, please ignore this email or contact support.

    © 2024 Knowsis. All rights reserved.`;
};