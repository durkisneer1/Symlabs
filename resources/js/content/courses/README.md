# HTML Course Authoring

Each chapter is a Markdown file in this folder. Prefix filenames with a number
so the course order is obvious, for example `02-document-structure.md`.

Start every chapter with frontmatter:

```md
---
number: 2
slug: document-structure
title: Document Structure
summary: Learn the parts every complete HTML document needs.
duration: 30 min
---
```

Use `##` headings for sections. Paragraphs become lesson text, fenced code
blocks become examples, and activity/media placeholders bind to typed
definitions in `resources/js/data/html-activities.ts`.

````md
## Section Title

Write the lesson prose here. Inline code like `href` is supported.

```html
<p>Example markup</p>
```

<Activity id="qc-tags" />

<Image id="element-anatomy" />
````

Add new activity IDs to `htmlActivities`, and add reusable image IDs to
`htmlImages`.
