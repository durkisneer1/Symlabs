---
number: 2
slug: elements-and-tags
title: Elements and Tags
summary: Start with the core vocabulary of HTML: tags, elements, attributes, nesting, and text content.
duration: 25 min
---

## HTML Describes Meaning

HTML is the language browsers use to understand the structure and meaning of a web page.

It does not decide the visual design by itself. A paragraph, heading, link, and image all communicate what a piece of content is, then CSS can decide how that content looks.

## Tags Create Elements

A tag is the markup written between angle brackets. Most elements use an opening tag, content, and a closing tag.

The full element includes the tags and everything between them.

```html
<p>This is a paragraph element.</p>
```

<Image id="element-anatomy" />

<Activity id="make-markup-change-the-box" />

## Attributes Add Detail

Attributes live inside an opening tag. They provide extra information about an element.

For example, a link needs an href attribute so the browser knows where the link should go.

```html
<a href="/courses/html">Study HTML</a>
```

## Nesting Builds Structure

HTML elements can contain other elements. This is called nesting.

Good nesting makes the page easier for browsers, assistive technology, search engines, and future developers to understand.

```html
<article>
  <h2>Course Update</h2>
  <p>Chapter one is ready.</p>
</article>
```

<Activity id="tiny-local-project" />

<Activity id="tiny-layout-challenge" />

<Activity id="qc-tags" />

<Activity id="chapter-rehash" />
