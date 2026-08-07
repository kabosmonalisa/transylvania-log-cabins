# Booking experience — Lizu's spec (captured)

## Booking page (`book.html`) — compare stays + calendars in parallel

Replace the current "pick one stay + request form" with a **stacked list of all five stays**, one section each.

Each stay section:
- **Left:** a **carousel** of that stay's main images.
- **Right:** a **calendar** showing that stay's **availability**.
- A **"More details"** link → the stay's singular page.

**Why (two decision dimensions):** a guest decides on BOTH the stay and the dates, and needs them side by side:
1. *"I'm free on these dates — which cabins are available?"* (dates-first)
2. *"I loved this cabin / want a different one this year — when is it free?"* (cabin-first, e.g. returning guests)

Seeing the stay's images and its live calendar together, for every stay, supports both paths in one view.

## Stay page (singular) — richer, Airbnb-style

- Carries its **own calendar** too.
- Full listing-style detail like Airbnb's listing page: the space, sleeping arrangement, **amenities**, house rules, check-in/out, location area, reviews.
- **Content source:** pull the **factual** info (amenities, capacity, sleeping setup, house rules, check-in times) from the real Airbnb listings — but write the prose/descriptions in the brand voice (do NOT copy Airbnb's marketing copy verbatim).

## Honest build notes
- **Live availability** (real dates, real bookings) comes from the third-party reservation engine (Lodgify / Hospitable / Smoobu). We build the branded **carousel + calendar layout** now with a styled placeholder calendar; the engine's per-listing calendar embed drops into each slot once the hosts sign up.
- Pulling Airbnb facts needs a browser session connected to Rares & Gabie's listings (room IDs are in `content/listings.json`).
