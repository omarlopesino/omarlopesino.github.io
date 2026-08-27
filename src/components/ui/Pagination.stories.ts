import Pagination from "./Pagination.astro";

export default {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    currentPage: 2,
    lastPage: 5,
    prevUrl: '#',
    nextUrl: '#',
  },
};

export const MiddlePage = {};

export const FirstPage = {
  args: {
    currentPage: 1,
    prevUrl: undefined,
  },
};

export const LastPage = {
  args: {
    currentPage: 5,
    nextUrl: undefined,
  },
};

// A listing that fits on one page renders nothing at all.
export const SinglePage = {
  args: {
    currentPage: 1,
    lastPage: 1,
    prevUrl: undefined,
    nextUrl: undefined,
  },
};
