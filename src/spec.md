# Specification

## Summary
**Goal:** Build a Food Preservation Tips app where authenticated users can CRUD their own tips and browse a read-only science methods library, with a consistent warm “kitchen notebook” aesthetic and integrated static images.

**Planned changes:**
- Backend: Add per-Principal CRUD data model and API for user tips (id, title, content, optional tags, createdAt, updatedAt) with strict access scoping.
- Backend: Add read-only science methods library API (list + get-by-id) with seeded data (at least 8 methods) including title, summary, optional steps, optional safetyNotes, and category.
- Frontend: Create navigation and screens for “My Tips” and “Science Library” with list + detail views and loading/empty/error states.
- Frontend: Add tip create/edit form with validation (title/content required) plus save and delete actions.
- Frontend: Use React Query for all fetching/mutations, including cache invalidation after tip create/update/delete and caching for the science library.
- Frontend: Apply a consistent warm kitchen notebook visual theme (earthy tones; avoid blue/purple) across components and screens.
- Frontend: Render static generated images from `frontend/public/assets/generated` and use at least a logo and one section illustration/icon in the UI (no backend image serving).

**User-visible outcome:** Users can sign in, create/edit/delete their own food preservation tips, and browse a seeded science library of preservation methods in a clean, themed UI with integrated static visuals.
