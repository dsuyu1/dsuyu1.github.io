---
layout: default
title: Home
permalink: /
description: >-
  Damian Villarreal — computer science student with an interest in
  cybersecurity, cloud, and artificial intelligence.
---

<div class="wrap">
  <div class="intro-row">
    <div class="intro-copy">
      <h1>I&rsquo;m a computer science student with an interest in cybersecurity, cloud, and artificial intelligence.</h1>
      <div class="hero-actions">
        <a class="button" href="{{ '/blog/' | relative_url }}">Read the blog</a>
        <a class="button button-ghost" href="{{ '/about/' | relative_url }}">About me</a>
      </div>
    </div>
    <div class="intro-image">
      <img src="{{ '/assets/helvetica-standard.svg' | relative_url }}"
           alt="Helvetica Standard logo" width="320" height="320">
    </div>
  </div>

  <h2 class="section-title">Recent posts</h2>
  {%- if site.posts.size > 0 -%}
    <ul class="post-list">
      {%- for post in site.posts limit: 5 -%}
        <li>
          <a href="{{ post.url | relative_url }}">
            <span class="post-list-title">{{ post.title }}</span>
            <span class="post-list-date">{{ post.date | date: "%b %-d, %Y" }}</span>
          </a>
        </li>
      {%- endfor -%}
    </ul>
    {%- if site.posts.size > 5 -%}
      <p class="home-more"><a href="{{ '/blog/' | relative_url }}">All posts &rarr;</a></p>
    {%- endif -%}
  {%- else -%}
    <p class="post-list-empty">No posts yet.</p>
  {%- endif -%}
</div>
