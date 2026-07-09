---
number: 3
slug: your-first-html-doc
title: Your First HTML Document
summary: Set up a project folder, create an HTML file, and open it in your browser.
duration: TBA
---

## Working Locally

So far, we've talked about the web conceptually: as something that lives "out there" on servers.
Before a page goes online, though, it usually starts as a normal file on someone's computer.
Working locally just means you are creating and editing project files on your own machine first.

For this course, I encourage you to write HTML in {VS Code|Visual Studio Code}, a code editor made for working with project folders and text files.
You do not need to understand every button in VS Code right away.
For now, think of it like a nicer notebook for code: it helps you organize files, edit text, and notice mistakes more clearly.

You can download VS Code [here](https://code.visualstudio.com/).

## Creating a Project Folder

After opening VS Code, click on "File" in the top left and select **"Open Folder..."**

Doing this should open your system's file explorer.
In it, create a folder for your project, best placed in your system's "Documents" directory.
This folder (and future-made ones) is where your HTML files, media, and other project files will live together.
For a first project, a name like `my-first-site` works well.

Folder names that are _short_, _readable_, and _boring_ (in a good way) are easiest to work with.
It's good practice to use lowercase letters, separate words with hyphens, and avoid spaces.
This goes for both file naming and folder naming.

After the folder exists, select and open it.
You should now see VS Code with blank panels, but "my-first-site" displayed at the top of the left panel, as such:

<Image id="blank-vscode-project" />

From now on, I'll be referring to that specific left panel as the **"explorer"**.
If you accidentally clicked on any of the icon tabs further left, you can return to the explorer by clicking on the top-most one that looks like **two stacked pages**.

## Naming HTML Files

HTML files end with `.html`.
That file extension tells your computer, browser, and editor what kind of file it is.
For the first and main page of a website, the most common filename is `index.html`, exactly as written.

Think of `index.html` as the starting page for a folder &mdash; an entry point.
If you've ever programmed in another language before, you may be familiar with a `main` function.
The HTML index file is a website's main function in a sense.

A project can have more than one file named `index.html` later, as long as each one lives in its own folder.
For example, a main project folder could have its own `index.html`, and a folder named `about` could also have an `index.html` inside it.
For your first project, though, one `index.html` in the main project folder is plenty.

Your project should look something like this:

<Activity id="first-local-html-project" />

Before moving on, I'd like to move away from saying "project folder" and instead getting you accustomed to the term **"root directory"**.
Folders are _directories_, and the highest level is the _root_, where our first `index.html` file can be found.

## Writing the First Document

Copy and paste this starter HTML code to your index file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Site</title>
  </head>
  <body>
    <h1>Hello, web!</h1>
    <p>This page lives on my computer.</p>
  </body>
</html>
```

Don't worry about some of the unfamiliar tags.
The big idea is that HTML documents have a structure, and your browser reads that structure to decide what to show.
The `body` is the part that appears on the page, so the heading and paragraph are the visible content for now.

## Opening the File in a Browser

After you've saved the file, open `index.html` in your browser by double-clicking the file in your system's file explorer. You may even right-click the file in VS Code's explorer and choose to **"Open in Integrated Browser"** to view the page directly in the editor.

When the page opens, the address bar may show a file path instead of a normal `https://` URL.
All that means is the browser is reading the file directly from your computer instead of requesting it from a web server, as you learned in Chapter 1.

After you see the page, try changing the heading text, saving the file, and refreshing the browser.
That save-refresh loop is a rhythm to get used to early on before assuming something isn't working.
