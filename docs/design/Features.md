# Features

This document details at high level how to solve any feature of the requirements that is not
explained by the self design.

## Search

### External

The templates of the content will contain enough metatags to be found.

Before publishing an article, lighthouse tests will be ran on created and updated pages. This
should reduce drastically any regression. By having a site with good scores, and one of that
scores is SEO, that will guarantee page can be easily found.

A basic sitemap will be done with: https://docs.astro.build/en/guides/integrations-guide/sitemap/

Finally, in this AI age, a llm.txt file will be added to try guide AI to the content.

### Internal

Will be done with astro-pagefind.

With the data-pagefind-filter tags we will index content and tags.


So, in content:
- Tags must be wrapped with attribute 'data-pagefind-filter="Tags"'. 
- Summary must be wrapped with 'data-pagefind-filter="Body"'.
- Title must be wrapped with 'data-pagefind-filter="Title"'

Example:

`
```html
...
<title>Blog post title</title>
...
<body>
	<h1 data-pagefind-filter="Title">Blog post title</h1>
	<div> <span data-pagefind-filter="Tags">Tag</span></div>
    <p data-pagefind-filter="Summary">SUmmary</p>
    <p>...</p>
</body>
```


## Facets

Facets allow to group content by specific attributes: year, tags, etc.

The facet must show the first N groups , and add an 'View more' link. The view more link
must go to a page with all the values of the facets in a grid. The grid will be different per type:
- Per year we will group by decade 
- Per tag we will group first letter, so tags are sorted alphabetically.

It will be done using astro API and reading its custom metadata.

These facets implies the existence of these routes:

- /posts/year/2022


## Multilingual

Follow instructions from [astro i18n docs](https://docs.astro.build/es/guides/internationalization/)

## Posts

Posts will be done with the usual posts system. The urls will be created based on the markdown frontmatter properties.

After any posts, there will be share links, and an invitation to issue about my own post in github.

## Feed

Follow this recipe

## Engage

TBD
