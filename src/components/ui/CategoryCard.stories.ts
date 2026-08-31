import CategoryCard from './CategoryCard.astro';

export default {
    title: 'Components/CategoryCard',
    component: CategoryCard,
    args: {
        name: 'Test',
        description: 'Posts about test topics.',
        image: { src: '/960x540.jpg', alt: 'Image alt sample', width: 960, height: 540 },
        href: '#test',
        count: 3,
    },
};

export const Default = {};
