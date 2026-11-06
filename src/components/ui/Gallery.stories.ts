import Gallery from "./Gallery.astro";

export default {
  title: 'Components/Gallery',
  component: Gallery,
  args: {
    id: 'story-gallery',
    previousLabel: 'Previous image',
    nextLabel: 'Next image',
    images: [
      { src: '/960x540/beginning.avif', alt: 'A path at dawn', width: 960, height: 540 },
      { src: '/960x540/recursion.avif', alt: 'A spiral staircase seen from above', width: 960, height: 540 },
      { src: '/960x540.jpg', alt: 'A placeholder landscape', width: 960, height: 540 },
    ],
  },
};

export const Default = {};

export const WithCaptions = {
  args: {
    id: 'story-gallery-captions',
    images: [
      { src: '/960x540/beginning.avif', alt: 'A path at dawn', width: 960, height: 540, caption: 'Where it all began.' },
      { src: '/960x540/recursion.avif', alt: 'A spiral staircase seen from above', width: 960, height: 540, caption: 'Recursion, in stone.' },
    ],
  },
};

// One image: no arrows or indicators, since there is nowhere to go.
export const SingleImage = {
  args: {
    id: 'story-gallery-single',
    images: [
      { src: '/960x540/beginning.avif', alt: 'A path at dawn', width: 960, height: 540 },
    ],
  },
};
