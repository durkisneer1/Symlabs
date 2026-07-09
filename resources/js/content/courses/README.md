# Course Authoring

Each chapter is a Markdown file in a course folder such as `html/` or `css/`.
Prefix filenames with a number so the course order is obvious, for example
`02-document-structure.md`.

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
Small quick checks can be written directly in the chapter with `<QuickCheck />`;
put the correct answer first in `choices`, and it will be shuffled when shown.
`Quick Check:` is automatically added to the title.

````md
## Section Title

Write the lesson prose here. Inline code like `href` is supported. Use
`{term|definition}` for inline definitions such as
`{HTTP|Hypertext Transfer Protocol}`.

```html
<p>Example markup</p>
```

<QuickCheck
  title="Tags"
  prompt="In `<p>Hello</p>`, what is `Hello`?"
  choices="Text content|A tag|An attribute|A file path"
  explanation="The `<p>` and `</p>` pieces are tags. The word between them is the text content of the paragraph element."
/>

<Activity id="chapter-recap" />

<Image id="element-anatomy" />
````

Add new HTML activity IDs to `htmlActivities`, and add reusable HTML image IDs
to `htmlImages`. Use `darkSrc` when the image needs a dark-mode variant:

```ts
'blank-vscode-project': {
  title: 'Blank VS Code Project',
  src: '/images/courses/html/ch3/blank-vsc.png',
  darkSrc: '/images/courses/html/ch3/blank-vsc-dark.png',
  alt: 'A blank VS Code window with the project folder open.',
}
```

CSS chapters use `cssActivities` and `cssImages`.
