import type { Image } from '@/types';

export const name = 'Omar Lopesino';

// One placeholder until there is a real photo: the profile shows up on the blog, at the foot of
// every post and on the about-me page, and all three should change together.
export const avatar: Image = {
    src: '/200x200.jpg',
    alt: 'Omar Lopesino',
    width: 200,
    height: 200,
};

// The footer links to these, the about-me page links to LinkedIn, and structured data claims them
// as the same person's profiles, so they are worth having in one place.
export const social = {
    github: 'https://github.com/omarlopesino',
    linkedin: 'https://www.linkedin.com/in/omar-mohamad-el-hassan-lopesino-ba639462/',
    email: 'omarmoper@gmail.com',
};
