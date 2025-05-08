import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stepBy = (fractionDigits: number) => +`0.${'0'.repeat(fractionDigits - 1)}1`;
