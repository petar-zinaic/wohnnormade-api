import { Resend } from 'resend';
import envConfig from '@config/environment';
import { escapeHtml, escapeMultilineHtml } from '@utility/helpers/htmlHelper';

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
    const tenantName = `${tenant.name} ${tenant.surname}`;

    const emailContent = {
      from: envConfig.email.fromEmail,
      to: [recipient.email],
      subject: `Contact Request Regarding Tenant: ${tenantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            A landlord wants to contact you
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${escapeHtml(senderName)}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${escapeHtml(sender.email)}</p>
            <p style="margin: 0 0 10px 0;"><strong>Regarding tenant:</strong> ${escapeHtml(tenantName)}</p>
          </div>

          <div style="background-color: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${escapeMultilineHtml(message)}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.threadUrl(threadId)}"
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

    return this.send(emailContent);
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
    const tenantName = `${tenant.name} ${tenant.surname}`;

    const emailContent = {
      from: envConfig.email.fromEmail,
      to: [recipient.email],
      subject: `Re: Contact Request Regarding Tenant: ${tenantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Reply to your message
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${escapeHtml(senderName)}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${escapeHtml(sender.email)}</p>
            <p style="margin: 0 0 10px 0;"><strong>Regarding tenant:</strong> ${escapeHtml(tenantName)}</p>
          </div>

          <div style="background-color: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Reply:</h3>
            <p style="line-height: 1.6; color: #555;">${escapeMultilineHtml(message)}</p>
          </div>

          ${originalMessage ? `
          <div style="background-color: #f8f9fa; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Previous message:</h4>
            <p style="line-height: 1.6; color: #555; margin: 0;">${escapeMultilineHtml(originalMessage)}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.threadUrl(threadId)}"
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

    return this.send(emailContent);
  }

  async sendPasswordReset({
    recipient,
    resetToken,
    expiresInMinutes
  }: {
    recipient: { name?: string; email: string };
    resetToken: string;
    expiresInMinutes: number;
  }) {
    const resetUrl = `${envConfig.email.clientUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
    const greeting = recipient.name ? `Hello ${escapeHtml(recipient.name)},` : 'Hello,';

    const emailContent = {
      from: envConfig.email.fromEmail,
      to: [recipient.email],
      subject: 'Reset your WohnNormade password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Password reset request
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">${greeting}</p>
            <p style="margin: 0 0 10px 0;">We received a request to reset your password. The link below is valid for ${expiresInMinutes} minutes and can be used once.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset password
            </a>
          </div>

          <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>If you did not request a password reset, you can ignore this email. Your password will not change.</p>
            <p>This message was sent through WohnNormade. Please do not reply directly to this email.</p>
          </div>
        </div>
      `
    };

    return this.send(emailContent);
  }

  private threadUrl(threadId: string): string {
    return `${envConfig.email.clientUrl}/communications/thread/${encodeURIComponent(threadId)}`;
  }

  private async send(emailContent: { from: string; to: string[]; subject: string; html: string }) {
    try {
      // Resend reports API failures in the result instead of throwing
      const result = await this.resend.emails.send(emailContent);
      if (result.error) {
        throw result.error;
      }
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }
}
