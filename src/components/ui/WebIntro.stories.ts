import ProfilePicture from "./ProfilePicture.astro";
import WebIntro from "./WebIntro.astro";


export default {
  title: 'Components/WebIntro',
  component: WebIntro,
  args: {
    text: 'I am Omar Lopesino, senior backend developer focused on Drupal.',
    link: {
      text: 'About me',
      href: '#',
    },
    image: {
        alt: 'Placeholder',
        src: '/200x200.jpg',
        width: 200,
        height: 200,
    }
  },
};

export const Default = {};
