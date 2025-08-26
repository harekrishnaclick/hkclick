import { MailService } from '@sendgrid/mail';
import { randomBytes } from 'crypto';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  token: string
): Promise<boolean> {
  const verificationUrl = `${process.env.REPLIT_DOMAINS ? 'https://' + process.env.REPLIT_DOMAINS.split(',')[0] : 'http://localhost:5000'}/api/auth/verify-email?token=${token}`;
  
  try {
    await mailService.send({
      to: email,
      from: 'noreply@your-app.com', // Replace with your verified sender
      subject: 'Verify Your Email - HARE KRISHNA Game',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A5568;">Welcome to HARE KRISHNA Game!</h2>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Thank you for creating an account. To complete your registration, please click the link below to set your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #FFD700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Set Your Password
            </a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <p style="color: #718096; font-size: 14px;">
            Hare Krishna!<br>
            The HARE KRISHNA Game Team
          </p>
        </div>
      `,
      text: `
        Welcome to HARE KRISHNA Game!
        
        Hello ${username},
        
        Thank you for creating an account. To complete your registration, please visit:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create this account, please ignore this email.
        
        Hare Krishna!
        The HARE KRISHNA Game Team
      `
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}