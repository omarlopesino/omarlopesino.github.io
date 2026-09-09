import type { Image } from '@/types';

export const name = 'Omar Lopesino';
// Legal name, used only where it helps search engines tie this site to the same person
// across profiles that display it in full (e.g. LinkedIn).
export const fullName = 'Omar Mohamad El Hassan Lopesino';
export const jobTitle: Record<string, string> = {
    en: 'Senior Backend Developer',
    es: 'Desarrollador Backend Senior',
};
export const worksFor = 'Metadrop';

// The profile shows up on the blog, at the foot of every post and on the about-me page, and all
// three should change together.
export const avatar: Image = {
    src: '/400x400/omarlopesino.avif',
    alt: 'Omar Lopesino',
    width: 400,
    height: 400,
};

// The footer links to these, and structured data claims them as the same person's profiles, so
// they are worth having in one place.
export const social = {
    github: 'https://github.com/omarlopesino',
    linkedin: 'https://www.linkedin.com/in/omar-mohamad-el-hassan-lopesino-ba639462/',
    drupal: 'https://www.drupal.org/u/omarlopesino',
    email: 'omarmoper@gmail.com',
};
