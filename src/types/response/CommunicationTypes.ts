export interface CommunicationResponse {
  id: number;
  threadId: string;
  senderId: number;
  recipientId: number;
  tenantId: number;
  subject?: string;
  message: string;
  isInitialMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: number;
    name?: string;
    surname?: string;
    email: string;
  };
  recipient: {
    id: number;
    name?: string;
    surname?: string;
    email: string;
  };
  tenant: {
    id: number;
    name: string;
    surname: string;
  };
}

export interface ThreadResponse {
  threadId: string;
  tenant: {
    id: number;
    name: string;
    surname: string;
  };
  communications: CommunicationResponse[];
}

export interface ContactReporterResponse {
  threadId: string;
  message: CommunicationResponse;
}
