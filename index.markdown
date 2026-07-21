---
layout: page
title: Home
permalink: /
---

<div class="hero">
  <p class="eyebrow">Software, security, and notes from the web</p>
  <h1>Welcome to my website.</h1>
  <p>I’m Damian, a computer science student with a growing interest in cybersecurity, systems, and practical engineering.</p>
  <p><a class="hero-link" href="/blog/">Read the blog</a></p>
</div>

<div class="featured-posts">
  <h2>Featured posts</h2>
  <ul>
    {% for post in site.posts limit: 3 %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <span>{{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {% endfor %}
  </ul>
</div>
