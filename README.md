# Petal Post 💌

A little static website for long-distance friends: pick digital flowers, arrange them into
a bouquet, write a cute note, and send it off as a shareable link.

- Pick a flower type (daisy, rose, tulip, sunflower, peony, lavender sprig) and a color
- Build a bouquet wrapped in paper with a ribbon
- Write a note to a friend
- "Send" generates a shareable link with the bouquet + note encoded in it — no backend, no database
- Opening the link shows a tap-to-open envelope, then reveals the bouquet and note

## Running locally

It's plain HTML/CSS/JS — no build step. Just serve the folder, e.g.:

```
npx serve .
```

or open `index.html` directly in a browser.

## Deploying

Static hosting only (GitHub Pages, Netlify, Vercel, etc.) — just publish the folder as-is.
