## Search

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

It will be done using astro API

## Sitemap
Basic sitemap with: https://docs.astro.build/en/guides/integrations-guide/sitemap/