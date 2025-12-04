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
  companyName: string;
  position: string;
  status: ApplicationStatus;
  applicationDate: string;
  companyLogoUrl?: string;
  jobUrl?: string;
  notes?: string;
  attachments?: Attachment[];
  userId: string;
  jobDescription?: string;
};
