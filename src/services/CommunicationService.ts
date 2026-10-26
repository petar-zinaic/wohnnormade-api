import { randomUUID } from "crypto";
import BaseService from "./BaseService";
import CommunicationRepository from "@repository/database/CommunicationRepository";
import EmailService from "./EmailService";
import {
  ContactReporterInput,
  ReplyToThreadInput,
} from "@requestType/CommunicationTypes";
import {
  CommunicationResponse,
  ThreadResponse,
  ContactReporterResponse,
} from "@responseType/CommunicationTypes";
import {
  ForbiddenException,
  InvalidRequestException,
  NotFoundException,
} from "@exceptions";

export default class CommunicationService extends BaseService<CommunicationRepository> {
  private emailService: EmailService;

  constructor() {
    super(new CommunicationRepository());
    this.emailService = new EmailService();
  }

  async contactReporter(
    data: ContactReporterInput,
    senderId: number
  ): Promise<ContactReporterResponse> {
    // Check if sender is trying to contact themselves
    if (senderId === data.recipientId) {
      throw new InvalidRequestException("Cannot contact yourself.");
    }

    // Validate that the sender is a registered user
    const sender = await this._repository.getUserById(senderId);
    if (!sender) {
      throw new NotFoundException("Sender");
    }

    // Validate that the tenant exists and get tenant info
    const tenant = await this._repository.getTenantById(data.tenantId);
    if (!tenant) {
      throw new NotFoundException("Tenant");
    }

    // Only the landlord who reported the tenant can be contacted about them
    if (data.recipientId !== tenant.createdById) {
      throw new InvalidRequestException("Recipient must be the tenant's reporter.");
    }

    // Validate that the recipient exists
    const recipient = await this._repository.getUserById(data.recipientId);
    if (!recipient) {
      throw new NotFoundException("Recipient");
    }

    // Generate unique thread ID
    const threadId = randomUUID();

    // Create the initial communication record
    const communication = await this._repository.createInitialCommunication({
      ...data,
      senderId,
      threadId,
    });

    // Send email notification
    try {
      await this.emailService.sendInitialContact({
        sender: {
          name: sender.name || undefined,
          surname: sender.surname || undefined,
          email: sender.email,
        },
        recipient: {
          name: recipient.name || undefined,
          surname: recipient.surname || undefined,
          email: recipient.email,
        },
        tenant: {
          name: tenant.name,
          surname: tenant.surname,
        },
        message: data.message,
        threadId,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't throw error here - the communication was saved successfully
      // Email failure shouldn't prevent the communication from being created
    }

    return {
      threadId,
      message: communication,
    };
  }

  async replyToThread(
    data: ReplyToThreadInput,
    senderId: number
  ): Promise<CommunicationResponse> {
    // Validate that the sender is a registered user
    const sender = await this._repository.getUserById(senderId);
    if (!sender) {
      throw new NotFoundException("Sender");
    }

    // Check if user has access to this thread
    const hasAccess = await this._repository.checkThreadAccess(
      data.threadId,
      senderId
    );
    if (!hasAccess) {
      throw new ForbiddenException("Access denied to this thread.");
    }

    // Get thread info for email
    const thread = await this._repository.getThreadByThreadId(data.threadId);
    if (!thread) {
      throw new NotFoundException("Thread");
    }

    // Create the reply
    const communication = await this._repository.createReply({
      ...data,
      senderId,
    });

    // Send email notification
    try {
      // Get the original message for context
      const originalMessage = thread.communications.find(
        (c) => c.isInitialMessage
      )?.message;

      await this.emailService.sendReply({
        sender: {
          name: sender.name || undefined,
          surname: sender.surname || undefined,
          email: sender.email,
        },
        recipient: {
          name: communication.recipient.name,
          surname: communication.recipient.surname,
          email: communication.recipient.email,
        },
        tenant: {
          name: thread.tenant.name,
          surname: thread.tenant.surname,
        },
        message: data.message,
        threadId: data.threadId,
        originalMessage,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't throw error here - the communication was saved successfully
    }

    return communication;
  }

  async getThread(threadId: string, userId: number): Promise<ThreadResponse> {
    // Check if user has access to this thread
    const hasAccess = await this._repository.checkThreadAccess(
      threadId,
      userId
    );
    if (!hasAccess) {
      throw new ForbiddenException("Access denied to this thread.");
    }

    const thread = await this._repository.getThreadByThreadId(threadId);
    if (!thread) {
      throw new NotFoundException("Thread");
    }

    return thread;
  }

  async getUserConversations(userId: number): Promise<ThreadResponse[]> {
    return await this._repository.getUserConversations(userId);
  }
}
