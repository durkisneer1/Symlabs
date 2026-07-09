---
number: 1
slug: intro-to-web
title: Introduction to Web Dev
summary: A quick tour of the web, URLs, domains, and how browsers reach pages.
duration: TBA
---

## History of the Internet

Before the web looked like the neat browser tabs we use today, the internet was more like a collection of separate neighborhoods.
Different systems had different ways to find information, and they did not always speak the same language.
Some people reached files through {UUCP|Unix-to-Unix Copy}, browsed menus with Gopher, or used online services like CompuServe.
These were useful, but they each felt like buildings with their own front door, map, and set of instructions.

In 1989, **Tim Berners-Lee** proposed a friendlier way to connect documents together while working at CERN.
At the time, CERN had scientists from all over the world working on different computers, projects, and documents.
The original idea was not "let's invent social media and online shopping," but more like, "what if researchers could share and connect information without needing to know exactly where every document lived?"
That practical little idea eventually grew into the World Wide Web, a system of linked documents and resources accessed through the internet.

<QuickCheck
  title="Internet History"
  prompt="What was Tim Berners-Lee originally trying to make easier?"
  choices="Sharing and connecting documents between researchers|Designing video game graphics|Making every computer use the same password|Replacing scientists with search engines"
  explanation="At CERN, the early web idea was about helping researchers connect information across different computers, projects, and documents."
/>

## How Web Data Travels

Let's follow one simple example: you type `https://symlabs.net/courses/html/intro-to-web` into your browser and press Enter.
Your browser does not just pray to the ancient internet gods for a page and hope it actually gets one.
It sends a carefully formatted request, that request gets chopped into smaller pieces, those pieces travel across the internet, and the response comes back with enough instructions for your browser to rebuild the page.
It's less like teleportation and more like mailing a LEGO set with numbered bags.

You **do not** need to memorize every protocol name in this section.
For now, the goal is to notice that loading a webpage is really a bunch of smaller jobs working together.

### HTTP/HTTPS: Asking for the Page

The first thing your browser needs to figure out is what it is actually asking for.
In our example, it is asking for the intro web chapter from `symlabs.net`.
That job belongs to {HTTP|Hypertext Transfer Protocol}, the set of rules browsers and servers use to request and send web resources.
When the resource is a _hypertext_ document, like {HTML|HyperText Markup Language}, it can include hyperlinks to other resources the user can easily access.

Because this request may include client data traveling between browsers and servers, it REALLY needs to be secure.
This is the reason for {HTTPS|Hypertext Transfer Protocol Secure}, the modern approach where HTTP data is encrypted using a cryptographic protocol called {TLS|Transport Layer Security}.
Only the client and server know how to decrypt HTTPS data, which keeps nosy middlemen from casually reading the mail.

### TCP vs UDP: Choosing a Delivery Style

After the browser knows what it wants to ask for, the next question is how carefully the data should be delivered.
For most webpages, the answer is {TCP|Transmission Control Protocol}, which acts like a very strict librarian.
TCP establishes a connection, tracks data, resends missing/corrupt data, and presents data to the receiver _in order_.
Think of ordering every page of a book; if page 12 is missing, you wait for page 12 before continuing.

Though, not every situation calls for "waiting for page 12".
How is it fair that your Netflix movie might buffer, but your live multiplayer video game still manages to show you the newest player position immediately?
That's where {UDP|User Datagram Protocol} comes into play.

For UDP, think of a live sports radio announcer.
If one sentence cuts out, you don't ask them to repeat it because the next play is already happening.
Data is sent unordered and not even guaranteed to arrive.
However, you often get _newer data quicker_!
That's how video games "cheat" fast connection; they care more about the freshest useful update than perfectly replaying old data.

### IP Addresses: Finding the Destination

Once the data has a delivery style, it still needs a destination.
The internet must follow a specified set of rules to route data to and from devices across the planet.
This set of rules is referred to as {IP|Internet Protocol}.
It defines the address format, provides forwarding instructions, and helps packets find their next stop.

In our example, your browser eventually needs to contact the machine that can serve `symlabs.net`.
Every device with a network interface has at least one IP address, which works like a mailing address for the internet's postal service.
IP addresses can be private, temporary, or shared across devices through {NAT|Network Address Translation}, like a router or firewall.

#### IPv4 and IPv6: Two Address Formats

{IPv4|Internet Protocol version 4} is the oldest of the two, but still widely used.
It is the most common home address format, utilizing a 32-bit address, and typically displayed as four numbers separated by periods, like `192.168.1.1` and `127.0.0.1`.

{IPv6|Internet Protocol version 6} is newer and essentially exists as a means to solve IPv4 address exhaustion, along other improvements.
Instead of only 32 bits, this format uses 128 bits.
To put that in perspective, the largest 128-bit integer is **79 octillion times larger** than the largest 32-bit integer!

### Network Hardware: Moving the Signals

Finally, packets need something physical to travel across.
Wi-Fi, Ethernet, cellular networks, and fiber optic cables are some different ways to move the actual signals from one device to another.
A single request for our intro web chapter might start over Wi-Fi, leave your house through a cable, travel across fiber, hop between routers, and eventually reach a server that could be in your same city or across the Pacific Ocean.

In the end, each piece only worries about its own job, HTTP cares about the request, TCP or UDP cares about the delivery behavior, and IP cares about where the packets should go.
Network hardware cares about turning all of that into signals that can actually move.

Put them together, and your browser gets to pretend the internet is one clean, magical entity!

Before we move on, I'd like to let you know that this "magical entity" you've just learned is called **TCP/IP**. It's a very much real framework for organizing the communication protocols used in the Internet and other computer networking.

<QuickCheck
  title="Web Data"
  prompt="What does IP help with when data travels across the internet?"
  choices="Finding where packets should go next|Choosing the color of a website|Writing HTML automatically|Making every request private by itself"
  explanation="IP stands for Internet Protocol. It helps data packets move toward the right destination, kind of like addressing and routing mail."
/>

## Domain Names

A domain name is the human-friendly name of a website, like `symlabs.net`, `wikipedia.org`, or `youtube.com`.
Computers are very comfortable using IP addresses, but humans are usually not thrilled about memorizing strings of numbers just to visit a page.
Domain names exist so we can use readable names instead.

Think of a domain name like the name of a store.
The actual building still has a physical address, but most people would rather say "the bakery on Main Street" than recite its exact coordinates.
On the web, the domain name gives people something easy to remember, type, share, and recognize.

### Top-Level Domains

A {TLD|Top-Level Domain} is the ending of a domain name, for example:

- `.net` in `symlabs.net`
- `.org` in `wikipedia.org`
- `.com` in `google.com`

Some TLDs started with specific meanings.
For example, `.com` was commonly used for commercial sites, `.org` for organizations, and `.edu` for educational institutions.
There are also country-code TLDs like `.uk`, `.ca`, and `.jp`.
Today, many TLDs are more flexible than their original categories, but they still help organize domain names and give visitors a small hint about the site.

### The Domain Name System

The {DNS|Domain Name System} is the system that connects domain names to the addresses computers actually use.
When you type a domain name into your browser, DNS helps find the matching IP address for the server that hosts the website.
It is often compared to a phonebook, but for the internet: you provide a name, and DNS helps look up where that name points.

In advanced cases, DNS can also help connect a domain to other services.
For example, a site owner might use DNS records to prove they own a domain in Google Search Console, point the domain toward a web host, set up professional email, or connect search tools like Algolia.
You do not need to memorize all of those record types yet, but it helps to know that DNS is one of the main places where a domain gets connected to the rest of a website's tools.

<QuickCheck
  title="Domains"
  prompt="Why do domain names exist?"
  choices="They give humans readable names instead of only IP addresses|They remove the need for servers|They are the same thing as passwords|They make websites load without the internet"
  explanation="Computers can work with IP addresses, but domain names are easier for people to remember, type, share, and recognize."
/>

## URLs

The internet has a seemingly endless amount of destinations to visit, each with their own unique addresses that act as references to resources.
There is a mechanism set in place for locating and retrieving these resources, called a {URL|Uniform Resource Locator}.

You've seen URLs before, like at the top of your browser pages or sharing webpage links with friends.
For example, this page you're currently on has the URL: _https://symlabs.net/courses/html/intro-to-web_.

So, then what's the "Uniform" part of URL mean?
As mentioned in [History of the Internet](#history-of-the-internet), there were many ways to get somewhere on the internet, and Tim Berners-Lee wasn't having it.
Upon the creation of the web came the URL along with it; a standard and consistent format for linking documents within the World Wide Web.

A URL is formatted as follows:

<Image id="url-anatomy" />

<QuickCheck
  title="URLs"
  prompt="What is a URL used for?"
  choices="Locating and retrieving a specific resource|Turning Wi-Fi into fiber optic cable|Encrypting every file on your computer|Naming a programming language"
  explanation="A URL is a Uniform Resource Locator. It gives the browser a structured address for something it can request, like a webpage or image."
/>

## What is HTML?

{HTML|HyperText Markup Language} is a _markup_ programming _language_ that is composed of _text_ and *hyper*link references.
This language is the skeleton of every single web page created since 1991 and is widely considered a necessary language to learn in the modern software development scene.
Even if you don't want web dev to be your career, the markup structure can be useful in other formats like {XML|Extensible Markup Language}, LaTeX, and {SVG|Scalable Vector Graphics}.
Some game dev software like Tiled export in markup structure: {TMX|Tiled Map XML} and {TSX|Tiled Tileset XML}.

<QuickCheck
  title="HTML"
  prompt="What is HTML mainly used for?"
  choices="Structuring the content of webpages|Sending physical cables across the ocean|Registering domain names|Replacing every image with plain text"
  explanation="HTML is the markup language browsers use to understand the structure and content of a webpage."
/>

<Activity id="intro-to-web-recap" />
