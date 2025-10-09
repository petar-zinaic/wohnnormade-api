export interface ContactReporterInput {
  tenantId: number;
  recipientId: number;
  message: string;
}

export interface ReplyToThreadInput {
  threadId: string;
  message: string;
}

export interface GetThreadInput {
  threadId: string;
}
