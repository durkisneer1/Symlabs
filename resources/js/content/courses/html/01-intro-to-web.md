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

## IP Addresses

The internet must follow a specified set of rules to route data to and from device across the planet.
This set of rules is referred to as {IP|Internet Protocol}.
It defines the home address format, provides forwarding instructions, and packet delivery.
Every device (with a network interface) has at least one IP which analogically serves as the mailing address of the internet's postal service.
IP addresses can be private, temporary, or shared across devices through {NAT|Network Address Translation}, like a router or firewall.

### IPv4 and IPv6

{IPv4|Internet Protocol version 4} is the oldest of the two, but still widely used.
It is the most common home address format, utilizing a 32-bit address, and typically displayed as four numbers seperated by periods, like `192.168.1.1` and `127.0.0.1`.

{IPv6|Internet Protocol version 6} is newer and essentially exists as a means to solve IPv4 address exhaustion, along other improvements.
Instead of only 32 bits, this format uses 128 bits.
To put that in perspective, the largest 128-bit integer is **79 octillion times larger** than the largest 32-bit integer!

### HTTP and HTTPS

{HTTP|Hypertext Transfer Protocol} is an application layer protocol where _hypertext_ documents -- like {HTML|HyperText Markup Language} -- include hyperlinks to other resources that the user can easily access.
It is essentially the transactional information and rules between a client and a server.

Because this is client data that goes to-and-from servers, it REALLY needs to be secure.
This is the reason for {HTTPS|Hypertext Transfer Protocol Secure}, the modern approach of HTTP ensures that information in transmission is encrypted using a cryptographic protocol called {TLS|Transport Layer Security}.
Only the client and source endpoint know how to decrypt HTTPS data.

### TCP vs UDP

How come your Netflix movie might buffer, but your live multiplayer videogame still tries to show you the newest player position immediately?
Well, there's actually two common ways data is sent and recieved through IP: {TCP|Transmission Control Protocol} and {UDP|User Datagram Protocol}.

Just off TCP's name, you may assume that the transmission of data is well supervised, and you'd be right! TCP establishes a connection, tracks data, resends missing/corrupt data, and presents data to the reciever _in order_. Think of ordering every page of a book; if page 12 is missing, you wait for page 12 before continuing.

As for UDP, think of a live sports radio announcer.
If one sentence cuts out, you don't ask them to repeat it because the next play is already happening.
Data is sent unordered and not even ensured for delivery.
However, you often get _newer data quicker_!
That's how videogames "cheat" fast connection; they care more about the freshest useful update than perfectly replaying old data.

## Domain Names

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

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

## Secure HTTP

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## What is HTML?

{HTML|HyperText Markup Language} is a _markup_ programming _language_ that is composed of _text_ and *hyper*link references.
This language is the skeleton of every single web page created since 1991 and is widely considered a necessary language to learn in the modern software development scene.
Even if you don't want web dev to be your career, the markup structure can useful in other formats like {XML|Extensible Markup Language}, LaTeX, and {SVG|Scalable Vector Graphics}.
Some game dev software like Tiled export in markup structure; {TMX|Tiled Map XML} and {TSX|Tiled Tileset XML}.
