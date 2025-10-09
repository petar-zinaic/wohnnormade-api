import { Resend } from 'resend';
import envConfig from '@config/environment';

export default class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.email.resendApiKey);
  }

  async sendInitialContact({
    sender,
    recipient,
    tenant,
    message,
    threadId
  }: {
    sender: { name?: string; surname?: string; email: string };
    recipient: { name?: string; surname?: string; email: string };
    tenant: { name: string; surname: string };
    message: string;
    threadId: string;
  }) {
    const senderName = `${sender.name || ''} ${sender.surname || ''}`.trim() || 'Anonymous Landlord';
    const recipientName = `${recipient.name || ''} ${recipient.surname || ''}`.trim() || 'Landlord';
    
    const emailContent = {
      from: envConfig.email.fromEmail,
      to: [recipient.email],
      subject: `Contact Request Regarding Tenant: ${tenant.name} ${tenant.surname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            A landlord wants to contact you
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${senderName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${sender.email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Regarding tenant:</strong> ${tenant.name} ${tenant.surname}</p>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${envConfig.email.clientUrl}/communications/thread/${threadId}" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reply to this message
            </a>
          </div>
          
          <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>This message was sent through WohnNormade. Please do not reply directly to this email.</p>
            <p>If you have any issues, please contact our support team.</p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.resend.emails.send(emailContent);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendReply({
    sender,
    recipient,
    tenant,
    message,
    threadId,
    originalMessage
  }: {
    sender: { name?: string; surname?: string; email: string };
    recipient: { name?: string; surname?: string; email: string };
    tenant: { name: string; surname: string };
    message: string;
    threadId: string;
    originalMessage?: string;
  }) {
    const senderName = `${sender.name || ''} ${sender.surname || ''}`.trim() || 'Anonymous Landlord';
    const recipientName = `${recipient.name || ''} ${recipient.surname || ''}`.trim() || 'Landlord';
    
    const emailContent = {
      from: envConfig.email.fromEmail,
      to: [recipient.email],
      subject: `Re: Contact Request Regarding Tenant: ${tenant.name} ${tenant.surname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Reply to your message
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${senderName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${sender.email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Regarding tenant:</strong> ${tenant.name} ${tenant.surname}</p>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Reply:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          ${originalMessage ? `
          <div style="background-color: #f8f9fa; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Previous message:</h4>
            <p style="line-height: 1.6; color: #555; margin: 0;">${originalMessage.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${envConfig.email.clientUrl}/communications/thread/${threadId}" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Continue conversation
            </a>
          </div>
          
          <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>This message was sent through WohnNormade. Please do not reply directly to this email.</p>
            <p>If you have any issues, please contact our support team.</p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.resend.emails.send(emailContent);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }
}
