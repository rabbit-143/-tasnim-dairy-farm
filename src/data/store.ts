// Central data store for Tasnim Dairy Farm
// In production this would connect to PHP/MySQL backend

import React from 'react';
import { FaHome, FaUsers, FaBullseye, FaChartLine, FaStar } from 'react-icons/fa';
import { GiMilkCarton } from 'react-icons/gi';

export interface Founder {
  id: number;
  name: string;
  role: string;
  responsibilities: string[];
  image: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  seoTitle: string;
  metaDescription: string;
  featured: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: 'Farm Images' | 'Cattle Images' | 'Production Images' | 'Events';
  image: string;
  date: string;
}

export interface CareerPost {
  id: number;
  title: string;
  department: string;
  vacancy: number;
  deadline: string;
  requirements: string[];
  applyEmail: string;
  active: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface GrowthJourney {
  id: number;
  milestone: string;
  year: string;
  title: string;
  description: string;
  image: string | null;
  stat_value: string;
  stat_label: string;
  color: string;
  side: 'left' | 'right';
  sort_order: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  mapEmbed: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  youtube: string;
  linkedin: string;
  aboutContent: string;
  vision: string;
  mission: string[];
  visitors: number;
}

export interface GrowthStat {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ComponentType<{ size?: number }>;
}

// Default data
export const defaultSettings: SiteSettings = {
  siteName: 'Tasnim Dairy Farm',
  tagline: 'Pure Milk, Pure Promise',
  phone: '+880 1700-000000',
  email: 'info@tasnimdairyfarm.com',
  address: 'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902139408672!2d90.39919931498205!3d23.750945884591076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1614930164854!5m2!1sen!2sbd',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: 'https://wa.me/8801700000000',
  youtube: 'https://youtube.com',
  linkedin: 'https://linkedin.com',
  aboutContent: 'Tasnim Dairy Farm was established on 14 February 2026 by four passionate founders with a vision to produce pure, safe, and high-quality milk while contributing to food security and sustainable agriculture. The farm began with a daily milk production of 30 liters and 10 dedicated employees. Today, Tasnim Dairy Farm produces 100 liters daily with 125 employees, continuing to grow with modern dairy management, quality control, and a strong commitment to excellence.',
  vision: 'To become one of the most trusted dairy farms in Bangladesh and establish a globally recognized dairy supply network delivering pure milk to international markets.',
  mission: [
    'Produce healthy and pure milk',
    'Maintain the highest farm hygiene standards',
    'Ensure animal welfare and ethical treatment',
    'Create meaningful employment opportunities',
    'Support sustainable agricultural practices',
    'Expand production capacity steadily',
    'Reach global dairy markets',
  ],
  visitors: 10482,
};

export const defaultFounders: Founder[] = [
  {
    id: 1,
    name: 'Mobasshera Sultana',
    role: 'CEO & Founder',
    responsibilities: ['Strategic Leadership', 'Farm Management', 'Growth Planning'],
    image: '/images/ceo-founder.jpg',
  },
  {
    id: 2,
    name: 'Johirul Islam',
    role: 'Co-Founder',
    responsibilities: ['Operations', 'Expansion Planning', 'Resource Management'],
    image: null,
  },
  {
    id: 3,
    name: 'Rakibul Hasan Rahat',
    role: 'Founder & Marketing Lead',
    responsibilities: ['Branding', 'Marketing', 'Public Relations'],
    image: null,
  },
  {
    id: 4,
    name: 'Anjhum Akter',
    role: 'Founder & Marketing Lead',
    responsibilities: ['Digital Marketing', 'Communication', 'Brand Awareness'],
    image: null,
  },
];

export const defaultBlogs: BlogPost[] = [
  {
    id: 1,
    title: 'The Journey to Pure Milk: Our Story from 30 to 100 Liters Daily',
    category: 'Farm Story',
    excerpt: 'Discover how Tasnim Dairy Farm grew from a small operation to a thriving enterprise committed to quality and sustainability.',
    content: 'Full blog content here...',
    date: '2026-03-15',
    image: '/images/farm-overview.jpg',
    seoTitle: 'Tasnim Dairy Farm Growth Story | Pure Milk Bangladesh',
    metaDescription: 'Learn how Tasnim Dairy Farm grew from 30 to 100 liters daily production.',
    featured: true,
  },
  {
    id: 2,
    title: 'Modern Cattle Management: How We Ensure Animal Welfare',
    category: 'Animal Care',
    excerpt: 'At Tasnim Dairy Farm, every cow receives exceptional care through our scientifically designed cattle management protocols.',
    content: 'Full blog content here...',
    date: '2026-04-02',
    image: '/images/gallery-cattle.jpg',
    seoTitle: 'Cattle Management & Animal Welfare | Tasnim Dairy Farm',
    metaDescription: 'Learn about our animal welfare practices and cattle management at Tasnim Dairy Farm.',
    featured: false,
  },
  {
    id: 3,
    title: 'Hygienic Milk Collection: Our Quality Control Process',
    category: 'Quality',
    excerpt: 'Quality is at the heart of everything we do. Our strict hygiene protocols ensure every drop of milk meets international standards.',
    content: 'Full blog content here...',
    date: '2026-04-20',
    image: '/images/milk-production.jpg',
    seoTitle: 'Milk Quality Control | Tasnim Dairy Farm Bangladesh',
    metaDescription: 'Discover our strict quality control processes for pure milk production.',
    featured: false,
  },
];

export const defaultGallery: GalleryItem[] = [
  { id: 1, title: 'Farm Overview', category: 'Farm Images', image: '/images/farm-overview.jpg', date: '2026-02-14' },
  { id: 2, title: 'Our Cattle', category: 'Cattle Images', image: '/images/gallery-cattle.jpg', date: '2026-02-20' },
  { id: 3, title: 'Milk Production', category: 'Production Images', image: '/images/milk-production.jpg', date: '2026-03-01' },
  { id: 4, title: 'Farm Landscape', category: 'Farm Images', image: '/images/farm-landscape.jpg', date: '2026-03-10' },
];

export const defaultCareers: CareerPost[] = [
  {
    id: 1,
    title: 'Dairy Farm Supervisor',
    department: 'Operations',
    vacancy: 2,
    deadline: '2026-07-31',
    requirements: ['3+ years dairy farm experience', 'Knowledge of cattle management', 'Leadership skills', 'Diploma in Agriculture preferred'],
    applyEmail: 'careers@tasnimdairyfarm.com',
    active: true,
  },
  {
    id: 2,
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    vacancy: 1,
    deadline: '2026-07-15',
    requirements: ['2+ years digital marketing experience', 'Social media management', 'Content creation skills', 'Bachelor\'s degree in Marketing'],
    applyEmail: 'careers@tasnimdairyfarm.com',
    active: true,
  },
  {
    id: 3,
    title: 'Veterinary Officer',
    department: 'Animal Health',
    vacancy: 1,
    deadline: '2026-08-15',
    requirements: ['DVM degree required', 'Experience with dairy cattle', 'Knowledge of disease prevention', 'Valid veterinary license'],
    applyEmail: 'careers@tasnimdairyfarm.com',
    active: true,
  },
];

export const defaultGrowthStats = [
  { label: 'Farm Established', value: '2026', icon: FaHome },
  { label: 'Initial Production', value: '30', suffix: 'L/day', icon: GiMilkCarton },
  { label: 'Current Production', value: '100', suffix: 'L/day', icon: FaChartLine },
  { label: 'Target Production', value: '1,000', suffix: 'L/day', icon: FaBullseye },
  { label: 'Initial Employees', value: '10', icon: FaUsers },
  { label: 'Current Employees', value: '125', icon: FaUsers },
  { label: 'Founders', value: '4', icon: FaStar },
];

export const defaultGrowthJourney: GrowthJourney[] = [
  {
    id: 1,
    milestone: '2026',
    year: '2026',
    title: 'The Beginning',
    description: 'Four passionate founders established Tasnim Dairy Farm with a bold vision. Started with 30 liters daily production and 10 dedicated employees. The foundation of a great dairy empire was laid.',
    image: null,
    stat_value: '30 L/Day',
    stat_label: 'Daily Production',
    color: '#0F5D2F',
    side: 'left',
    sort_order: 1,
  },
  {
    id: 2,
    milestone: 'Present',
    year: 'Present',
    title: 'Rapid Growth',
    description: 'Within months of founding, production tripled to 100 liters daily. The workforce grew to 125 employees. Modern dairy management systems implemented. Quality control protocols established.',
    image: null,
    stat_value: '100 L/Day',
    stat_label: 'Current Production',
    color: '#D4AF37',
    side: 'right',
    sort_order: 2,
  },
  {
    id: 3,
    milestone: '2028',
    year: '2028',
    title: 'Target Milestone',
    description: 'Target production of 1,000 liters daily and 30,000 liters monthly. Expansion of farm facilities, modernization of production systems, and significant workforce growth planned.',
    image: null,
    stat_value: '1,000 L/Day',
    stat_label: 'Target Production',
    color: '#0F5D2F',
    side: 'left',
    sort_order: 3,
  },
  {
    id: 4,
    milestone: 'Future',
    year: 'Future',
    title: 'Global Expansion',
    description: 'Establishment of a worldwide dairy supply network. International market penetration with certified pure milk. Recognition as one of Bangladesh\'s leading dairy brands globally.',
    image: null,
    stat_value: 'Global',
    stat_label: 'Market Reach',
    color: '#D4AF37',
    side: 'right',
    sort_order: 4,
  },
];
