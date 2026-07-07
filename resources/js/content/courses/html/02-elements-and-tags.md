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

Notice how the version of the tags with a forward slash (`/`) in them end, or **close**, the text's formatting. Let's talk about that.

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

Referring back to the code block in [The HTML Structure](#the-html-structure), you would say that there is an _italic text element_ is **nested** in the _paragraph element_. You may also say the italic text element is a **child of** the paragraph element.

## Element Relationships

Since there seems to be "children" elements, does that imply "parents"?
What about grandparents, grandchildren, and siblings?
Yes to them all!

In the example code block, you can also say the paragraph element is a **parent of** the italic text element.
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

- The first paragraph is a sibling of the second paragraph.
- The second paragraph's italic text is a child of it.
- The bold text is a child of its parent italic text.
- The bold text is a grandchild of its grandparent paragraph element.

## The Document Object Model

Probably the most common term in {frontend|The user-facing content of a website.} web dev is the {DOM|Document Object Model}.
It might sound intimidating at first, but the good news is you just learned it!

Within HTML documents, elements are **objects**, sometimes consisting of attributes (covered in chapter 4), and the model is that nested/neighbored tree-like structure we've been talking about.
