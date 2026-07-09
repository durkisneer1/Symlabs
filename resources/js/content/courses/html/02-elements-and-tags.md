---
number: 2
slug: elements-and-tags
title: Elements and Tags
summary: The core vocabulary of HTML; tags, elements, attributes, and nesting.
duration: TBA
---

## The HTML Structure

Think of HTML like writing a formatted Word document, but instead of top-down, it's tree-like.
For example, paragraphs don't necessarily _have_ italic text, but is instead a branch of the paragraph &mdash; a child of it.

Let's expose you to some real HTML for the first time.
Examine how the italic (`<i>`) text is "under", or a **child of**, the paragraph (`<p>`):

```html
<p>
  My paragraph consists of
  <i>italic text!</i>
  Not this part, though.
</p>
```

This code renders on the page as:

"My paragraph consists of _italic text!_ Not this part, though."

Notice how the version of the tags with a forward slash (`/`) in them end, or **close**, the text's formatting.

<QuickCheck
  title="HTML Structure"
  prompt="In the example, how would you describe the italic text compared to the paragraph?"
  choices="It is nested inside the paragraph|It deletes the paragraph|It is the parent of the paragraph|It is unrelated to the paragraph"
  explanation="The italic text is inside the paragraph element, so it is nested within it and can be described as a child of it."
/>

## Elements vs. Tags

Everything you will ever write in HTML and that HTML consists of are called elements, and elements all consist of two tags, sometimes one (covered in the next chapter).

<Image id="element-anatomy" />

### Tags

When referring to tags, they are the individual character sets enclosed in a greater-than symbol (`<`) and a less-than symbol (`>`).
The most common tags, excluding HTML essentials, you'll see in the wild are:

- `<p>` for a paragraph
- `<i>` for italic formatting
- `<b>` for bold formatting
- `<h1>` through `<h6>` for headings
- `<a>` for links/references

### Elements

An element on the other hand is the entire piece of an opening tag, content, and a closing tag.
Think of tags as the pieces that make up a car; the car as a whole is the element.
You **should not** use them interchangeably.

#### Nesting Elements

Referring back to the example code in [The HTML Structure](#the-html-structure), you would say that there is an _italic text element_ **nested** in the _paragraph element_. You may also say the italic text element is a **child of** the paragraph element.

<Activity id="make-the-nested-text-bold" />

<QuickCheck
  title="Elements vs. Tags"
  prompt="What is the difference between a tag and an element?"
  choices="A tag is one markup piece, while an element is the whole structure|A tag is always visible text, while an element is always hidden|A tag is only used for links, while an element is only used for images|A tag and an element are exactly the same thing"
  explanation="A tag is a piece like `<p>` or `</p>`. An element is the whole thing: opening tag, content, and usually a closing tag."
/>

## Element Relationships

Since there seems to be "children" elements, does that imply "parents"?
What about grandparents, grandchildren, and siblings?
Yes to them all!

In the same example code block from [The HTML Structure](#the-html-structure), you can also say the paragraph element is a **parent of** the italic text element.
Let's extend the last example with another paragraph consisting of bold _and_ italicized text:

```html
<p>
  My paragraph consists of
  <i>italic text!</i>
  Not this part, though.
</p>
<p>
  Bill Nye absolutely
  <i><b>runs circles around</b></i>
  Neil deGrasse Tyson!
</p>
```

Some relationships that can be pointed out, that we haven't already, are:

- The first paragraph is a _sibling_ of the second paragraph.
- The second paragraph's italic text is a _child_ of it.
- The bold text is a _child_ of its _parent_ italic text.
- The bold text is a _grandchild_ of its _grandparent_ paragraph element.

<QuickCheck
  title="Element Relationships"
  prompt="If two paragraph elements sit next to each other at the same level, what relationship do they have?"
  choices="They are siblings|They are both closing tags|One must be a grandchild of the other|They stop being elements"
  explanation="Sibling elements share the same level in the structure, like two paragraph elements next to each other."
/>

## The Document Object Model

Probably the most common term in {frontend|The user-facing content of a website.} web dev is the {DOM|Document Object Model}.
It might sound intimidating at first, but the good news is you just learned it!

Within HTML documents, elements are **objects**, sometimes consisting of attributes (covered in chapter 4).
The model is that nested/neighbored tree-like structure we've been talking about.

<QuickCheck
  title="The DOM"
  prompt="What does the DOM describe in this chapter?"
  choices="The tree-like structure of HTML elements|The password for a webpage|The color palette of a website|The speed of an internet connection"
  explanation="The DOM is a model of the document as objects arranged in a tree-like structure."
/>

<Activity id="elements-and-tags-recap" />
