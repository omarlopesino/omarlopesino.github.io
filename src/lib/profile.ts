import type { Image } from '@/types';

export const name = 'Omar Lopesino';

// The profile shows up on the blog, at the foot of every post and on the about-me page, and all
// three should change together.
export const avatar: Image = {
    src: '/omarlopesino.jpg',
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
