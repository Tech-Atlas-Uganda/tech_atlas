import { Resend } from 'resend';
import { ENV } from './env';

// Initialize Resend
const resend = new Resend(ENV.resendApiKey);

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export const emailService = {
  // Send a generic email
  send: async (template: EmailTemplate) => {
    if (!ENV.resendApiKey) {
      console.warn('Resend API key not configured. Email will not be sent.');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await resend.emails.send({
        from: template.from || 'Tech Atlas Uganda <noreply@techatlas.ug>',
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  },

  // Welcome email for new users
  sendWelcomeEmail: async (to: string, name: string) => {
    return await emailService.send({
      to,
      subject: 'Welcome to Tech Atlas Uganda! 🇺🇬',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Tech Atlas Uganda!</h1>
          <p>Hi ${name},</p>
          <p>Welcome to Uganda's premier tech ecosystem platform! We're excited to have you join our community.</p>
          
          <h2>What you can do on Tech Atlas:</h2>
          <ul>
            <li>🏢 Discover tech hubs and startups across Uganda</li>
            <li>💼 Find jobs and gig opportunities</li>
            <li>📚 Access learning resources and career guidance</li>
            <li>🎉 Stay updated on tech events and opportunities</li>
            <li>🤝 Connect with fellow techies in our community forum</li>
          </ul>
          
          <p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Explore Tech Atlas
            </a>
          </p>
          
          <p>Happy networking!</p>
          <p>The Tech Atlas Uganda Team</p>
        </div>
      `,
      text: `Welcome to Tech Atlas Uganda! Hi ${name}, welcome to Uganda's premier tech ecosystem platform. Explore hubs, find opportunities, and connect with the community at ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
    });
  },

  // Content approval notification
  sendContentApprovalEmail: async (to: string, contentType: string, title: string, approved: boolean) => {
    const status = approved ? 'approved' : 'rejected';
    const emoji = approved ? '✅' : '❌';
    
    return await emailService.send({
      to,
      subject: `Your ${contentType} submission has been ${status} ${emoji}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: ${approved ? '#16a34a' : '#dc2626'};">Submission ${status.charAt(0).toUpperCase() + status.slice(1)} ${emoji}</h1>
          <p>Your ${contentType} submission "${title}" has been ${status}.</p>
          ${approved 
            ? '<p>It is now live on Tech Atlas Uganda and visible to the community!</p>' 
            : '<p>Please review our community guidelines and feel free to resubmit with any necessary changes.</p>'
          }
          <p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View on Tech Atlas
            </a>
          </p>
        </div>
      `
    });
  },

  // Event reminder email
  sendEventReminderEmail: async (to: string, eventTitle: string, eventDate: string, eventUrl?: string) => {
    return await emailService.send({
      to,
      subject: `Reminder: ${eventTitle} is coming up! 📅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Event Reminder 📅</h1>
          <p>Don't forget about this upcoming tech event:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; color: #1f2937;">${eventTitle}</h2>
            <p style="margin: 0; color: #6b7280;">📅 ${eventDate}</p>
          </div>
          
          ${eventUrl ? `
            <p>
              <a href="${eventUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Event Details
              </a>
            </p>
          ` : ''}
          
          <p>See you there!</p>
          <p>Tech Atlas Uganda</p>
        </div>
      `
    });
  }
};