import BaseRepository from './BaseRepository';
import { NotFoundException } from '@exceptions';
import { ContactReporterInput, ReplyToThreadInput } from '@requestType/CommunicationTypes';
import { CommunicationResponse, ThreadResponse } from '@responseType/CommunicationTypes';

export default class CommunicationRepository extends BaseRepository {
  constructor() {
    super();
  }

  async createInitialCommunication(data: ContactReporterInput & { senderId: number; threadId: string }): Promise<CommunicationResponse> {
    const communication = await this.prismaClient.landlordCommunication.create({
      data: {
        threadId: data.threadId,
        senderId: data.senderId,
        recipientId: data.recipientId,
        tenantId: data.tenantId,
        message: data.message,
        isInitialMessage: true,
        subject: `Contact Request Regarding Tenant`
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      }
    });

    return communication as CommunicationResponse;
  }

  async createReply(data: ReplyToThreadInput & { senderId: number }): Promise<CommunicationResponse> {
    // First, get the original communication to get tenant and recipient info
    const originalCommunication = await this.prismaClient.landlordCommunication.findFirst({
      where: { threadId: data.threadId },
      orderBy: { createdAt: 'asc' },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      }
    });

    if (!originalCommunication) {
      throw new NotFoundException('Thread');
    }

    // Determine recipient (if sender is the original sender, recipient is original recipient, and vice versa)
    const isOriginalSender = originalCommunication.senderId === data.senderId;
    const recipientId = isOriginalSender ? originalCommunication.recipientId : originalCommunication.senderId;

    const communication = await this.prismaClient.landlordCommunication.create({
      data: {
        threadId: data.threadId,
        senderId: data.senderId,
        recipientId: recipientId,
        tenantId: originalCommunication.tenantId,
        message: data.message,
        isInitialMessage: false,
        subject: `Re: Contact Request Regarding Tenant`
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      }
    });

    return communication as CommunicationResponse;
  }

  async getThreadByThreadId(threadId: string): Promise<ThreadResponse | null> {
    const communications = await this.prismaClient.landlordCommunication.findMany({
      where: { threadId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    if (communications.length === 0) {
      return null;
    }

    return {
      threadId,
      tenant: communications[0].tenant,
      communications: communications as CommunicationResponse[]
    };
  }

  async getUserConversations(userId: number): Promise<ThreadResponse[]> {
    // Get all threads where user is either sender or recipient
    const userCommunications = await this.prismaClient.landlordCommunication.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by threadId and get the latest message for each thread
    const threadMap = new Map<string, ThreadResponse>();
    
    for (const comm of userCommunications) {
      if (!threadMap.has(comm.threadId)) {
        threadMap.set(comm.threadId, {
          threadId: comm.threadId,
          tenant: comm.tenant,
          communications: []
        });
      }
    }

    // Get all communications for each thread
    for (const threadId of threadMap.keys()) {
      const threadCommunications = await this.prismaClient.landlordCommunication.findMany({
        where: { threadId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true
            }
          },
          recipient: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true
            }
          },
          tenant: {
            select: {
              id: true,
              name: true,
              surname: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      threadMap.get(threadId)!.communications = threadCommunications as CommunicationResponse[];
    }

    return Array.from(threadMap.values());
  }

  async checkThreadAccess(threadId: string, userId: number): Promise<boolean> {
    const communication = await this.prismaClient.landlordCommunication.findFirst({
      where: {
        threadId,
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }
    });

    return !!communication;
  }

  async getTenantById(tenantId: number) {
    return await this.prismaClient.tenant.findUnique({
      where: { id: tenantId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        }
      }
    });
  }

  async getUserById(userId: number) {
    return await this.prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true
      }
    });
  }
}
