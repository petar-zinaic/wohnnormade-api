import { Request, Response, NextFunction } from "express";
import { contactReporterSchema, replyToThreadSchema } from './schemas/communicationSchemas';
import { InvalidRequestException } from '@utility/exceptions';

export function validateContactReporterInput(req: Request, res: Response, next: NextFunction) {
  const { error } = contactReporterSchema.validate(req.body);

  if(error) throw new InvalidRequestException(error.details[0].message);

  next();
}

export function validateReplyToThreadInput(req: Request, res: Response, next: NextFunction) {
  const { error } = replyToThreadSchema.validate(req.body);

  if(error) throw new InvalidRequestException(error.details[0].message);

  next();
}
