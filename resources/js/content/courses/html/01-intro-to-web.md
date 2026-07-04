---
number: 1
slug: intro-to-web
title: Introduction to Web Dev
summary: A quick tour of the web, URLs, domains, and how browsers reach pages.
duration: TBA
---

## History of the Internet

- Tim Burners-Lee
- Pre-{URL|Uniform Resource Locator} Addresses ({UUCP|Unix-to-Unix Copy}, CompuServe, Gopher)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How Web Data Travels

When you visit a website, your browser does not shout "I WANT THE PAGE" into the internet and hope they actually get it.
It sends a carefully formatted request, that request gets chopped into smaller pieces, those pieces travel across the internet, and the response comes back with enough instructions for your browser to rebuild the page.
It's less like teleportation and more like mailing a LEGO set with numbered bags.

### HTTP/HTTPS

The first thing your browser needs to figure out is what it is actually asking for.
That job belongs to {HTTP|Hypertext Transfer Protocol}, the set of rules browsers and servers use to request and send web resources.
When the resource is a _hypertext_ document, like {HTML|HyperText Markup Language}, it can include hyperlinks to other resources the user can easily access.

Because this request may include client data traveling between browsers and servers, it REALLY needs to be secure.
This is the reason for {HTTPS|Hypertext Transfer Protocol Secure}, the modern approach where HTTP data is encrypted using a cryptographic protocol called {TLS|Transport Layer Security}.
Only the client and server know how to decrypt HTTPS data, which keeps nosy middlemen from casually reading the mail.

### TCP vs UDP

After the browser knows what it wants to ask for, the next question is how carefully the data should be delivered.
For most webpages, the answer is {TCP|Transmission Control Protocol}, which acts like a very fussy librarian.
TCP establishes a connection, tracks data, resends missing/corrupt data, and presents data to the receiver _in order_.
Think of ordering every page of a book; if page 12 is missing, you wait for page 12 before continuing.

Not every app wants to wait for page 12.
Like... how is it fair that your Netflix movie might buffer, but your live multiplayer video game still manages to show you the newest player position immediately?
That's where {UDP|User Datagram Protocol} comes into play.

For UDP, think of a live sports radio announcer.
If one sentence cuts out, you don't ask them to repeat it because the next play is already happening.
Data is sent unordered and not even guaranteed to arrive.
However, you often get _newer data quicker_!
That's how video games "cheat" fast connection; they care more about the freshest useful update than perfectly replaying old data.

### IP Addresses

Once the data has a delivery style, it still needs a destination.
The internet must follow a specified set of rules to route data to and from devices across the planet.
This set of rules is referred to as {IP|Internet Protocol}.
It defines the address format, provides forwarding instructions, and helps packets find their next stop.

Every device with a network interface has at least one IP address, which works like a mailing address for the internet's postal service.
IP addresses can be private, temporary, or shared across devices through {NAT|Network Address Translation}, like a router or firewall.

### IPv4 and IPv6

{IPv4|Internet Protocol version 4} is the oldest of the two, but still widely used.
It is the most common home address format, utilizing a 32-bit address, and typically displayed as four numbers separated by periods, like `192.168.1.1` and `127.0.0.1`.

{IPv6|Internet Protocol version 6} is newer and essentially exists as a means to solve IPv4 address exhaustion, along other improvements.
Instead of only 32 bits, this format uses 128 bits.
To put that in perspective, the largest 128-bit integer is **79 octillion times larger** than the largest 32-bit integer!

### Network Hardware

Finally, packets need something physical to travel across.
Wi-Fi, Ethernet, cellular networks, and fiber optic cables are different ways to move the actual signals from one device to another.
A single webpage request might start over Wi-Fi, leave your house through a cable, travel across fiber, hop between routers, and eventually reach a server that could be in your same city or across the Pacific Ocean.

In the end, each piece only worries about its own job, HTTP cares about the request, TCP or UDP cares about the delivery behavior, and IP cares about where the packets should go.
Network hardware cares about turning all of that into signals that can actually move.

Put them together, and your browser gets to pretend the internet is one clean, magical entity.

## Domain Names

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Top-Level Domains

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### The Domain Name System (DNS)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## URLs

The internet has a seemingly endless amount of destinations to visit, each with their own unique addresses that act as references to resources.
There is a mechanism set in place for locating and retrieving these resources, called a {URL|Uniform Resource Locator}.

You've seen URLs before, like at the top of your browser pages or sharing webpage links with friends.
For example, this page you're currently on has the URL: _https://symlabs.net/courses/html/intro-to-web_.

So, then what's the "Uniform" part of URL mean?
As mentioned in [History of the Internet](#history-of-the-internet), there were many ways to get somewhere on the internet, and Tim Burners-Lee wasn't having it.
Upon the creation of the web came the URL along with it; a standard and consistent format for linking documents within the World Wide Web.

A URL is formatted as follows:

<Image id="url-anatomy" />

## What is HTML?

{HTML|HyperText Markup Language} is a _markup_ programming _language_ that is composed of _text_ and *hyper*link references.
This language is the skeleton of every single web page created since 1991 and is widely considered a necessary language to learn in the modern software development scene.
Even if you don't want web dev to be your career, the markup structure can useful in other formats like {XML|Extensible Markup Language}, LaTeX, and {SVG|Scalable Vector Graphics}.
Some game dev software like Tiled export in markup structure; {TMX|Tiled Map XML} and {TSX|Tiled Tileset XML}.
