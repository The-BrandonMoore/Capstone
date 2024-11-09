import { User } from './user.class';

export class Request {
  id: number;
  userId: number;
  user: User | null;
  requestNumber: string;
  description: string;
  justification: string;
  dateNeeded: Date;
  deliveryMode: string;
  status: string;
  total: number;
  submittedDate: Date;
  reasonForRejection: string;

  constructor(
    id: number = 0,
    userId: number = 0,
    user: User | null = null,
    requestNumber: string = '',
    description: string = '',
    justification: string = '',
    dateNeeded: Date = new Date(),
    deliveryMode: string = '',
    status: string = '',
    total: number = 0,
    submittedDate: Date = new Date(),
    reasonForRejection: string = ''
  ) {
    this.id = id;
    this.userId = userId;
    this.user = user ?? new User();
    this.requestNumber = requestNumber;
    this.description = description;
    this.justification = justification;
    this.dateNeeded = dateNeeded;
    this.deliveryMode = deliveryMode;
    this.status = status;
    this.total = total;
    this.submittedDate = submittedDate;
    this.reasonForRejection = reasonForRejection;
  }
}
