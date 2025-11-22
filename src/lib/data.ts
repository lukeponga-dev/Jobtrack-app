import type {Application} from './types';
import {PlaceHolderImages} from './placeholder-images';

const findImage = (id: string) =>
  PlaceHolderImages.find(img => img.id === id)?.imageUrl;

export const applications: Application[] = [
  {
    id: '1',
    company: 'Innovate Inc.',
    position: 'Senior Frontend Developer',
    status: 'interview',
    dateApplied: '2024-07-15',
    companyLogo: findImage('logo-google'),
    jobUrl: 'https://example.com/job/1',
  },
  {
    id: '2',
    company: 'Tech Solutions Ltd.',
    position: 'Full Stack Engineer',
    status: 'applied',
    dateApplied: '2024-07-20',
    companyLogo: findImage('logo-meta'),
  },
  {
    id: '3',
    company: 'Creative Minds LLC',
    position: 'UX/UI Designer',
    status: 'rejected',
    dateApplied: '2024-07-10',
    companyLogo: findImage('logo-apple'),
    jobUrl: 'https://example.com/job/3',
  },
  {
    id: '4',
    company: 'Data Analytics Co.',
    position: 'Data Scientist',
    status: 'offer',
    dateApplied: '2024-06-25',
    companyLogo: findImage('logo-amazon'),
    jobUrl: 'https://example.com/job/4',
  },
  {
    id: '5',
    company: 'Future Systems',
    position: 'Backend Developer',
    status: 'applied',
    dateApplied: '2024-07-22',
    companyLogo: findImage('logo-microsoft'),
  },
  {
    id: '6',
    company: 'Web Weavers',
    position: 'React Native Developer',
    status: 'applied',
    dateApplied: '2024-07-18',
    companyLogo: findImage('logo-netflix'),
    jobUrl: 'https://example.com/job/6',
  },
  {
    id: '7',
    company: 'Innovate Inc.',
    position: 'Product Manager',
    status: 'interview',
    dateApplied: '2024-07-05',
    companyLogo: findImage('logo-google'),
  },
];
