import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  stack: string;
  github_url: string;
  image_url: string;
  category: string;
  status: string;
  published: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  tags: string;
  published: number;
  created_at: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: number;
  created_at: string;
}
