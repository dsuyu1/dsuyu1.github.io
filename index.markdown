---
layout: page
permalink: /
---

<div class="intro-row">
  <div class="intro-copy">
    <h3>I’m Damian, a computer science student with a growing interest in cybersecurity, cloud, and artificial intelligence.</h3>
    <p><a class="hero-link" href="/blog/">Read the blog</a></p>
  </div>
  <div class="intro-image">
    <img src="{{ '/assets/helvetica%20standard.svg' | relative_url }}" alt="Helvetica Standard logo" />
  </div>
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
