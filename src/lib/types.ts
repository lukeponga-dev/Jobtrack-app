export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export type Note = {
  id: string;
  text: string;
  createdAt: string;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: 'resume' | 'cover-letter' | 'other';
};

export type Application = {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  companyLogo?: string;
  jobUrl?: string;
  notes?: Note[];
  attachments?: Attachment[];
};
