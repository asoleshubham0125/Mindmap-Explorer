# Mind Map Viewer

## Technologies Used

- **React (Functional Components)** – For building a modular, component-based UI.
- **JavaScript (ES6+)** – Used for clean, modern syntax and better maintainability.
- **CSS (Custom Styling)** – Handles layout, transitions, zooming, panning, and visual hierarchy.
- **JSON** – Acts as the structured data source for the mind map.

---

## Libraries Used (and Rationale)

- **React Hooks**
  - `useState` – Manages application state (selected node, collapsed nodes, zoom, pan, sidebar visibility).
  - `useEffect` – Handles data initialization and layout recalculations.
  - `useRef` – Used for DOM references and efficient pan/drag handling.

No external visualization libraries (e.g., D3, React Flow) were used to maintain:

- Full control over layout and interactions
- Lightweight bundle size
- Easier customization and debugging

---

## Architecture & Approach

The application follows a **component-driven and state-centric architecture**:
