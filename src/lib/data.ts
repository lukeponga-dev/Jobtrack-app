import type {Application} from './types';
import {PlaceHolderImages} from './placeholder-images';

const findImage = (id: string) =>
  PlaceHolderImages.find(img => img.id === id)?.imageUrl;

export const applications: Application[] = [
  // This data is now fetched from firestore
];
