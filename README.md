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

```text
MindMapView (Root Container)
├── Mind Map Canvas
│   ├── Node Layout
│   ├── Edges
│   └── Interactions (Pan, Zoom, Drag)
└── Sidebar
    └── Selected Node Details
```

### Key Design Principles

- **Single Source of Truth**: The root node from JSON drives the entire tree.
- **Recursive Rendering**: Child nodes are rendered recursively, enabling unlimited depth.
- **Separation of Concerns**:
  - Data & state → MindMapView
  - Presentation → Canvas & Sidebar
  - Styling → CSS

---

## Data Flow: JSON → UI

1. **Data Source**  
   The mind map structure is defined in a JSON file with nodes and child relationships.

2. **Initialization**  
   On component mount, the root node is loaded into React state.

3. **Layout Calculation**  
   Node positions are computed based on:

   - Depth in the tree (vertical spacing)
   - Sibling order (horizontal spacing)

4. **Rendering**  
   Nodes and connections are rendered dynamically.  
   Recursive rendering ensures scalability for large trees.

5. **User Interaction**
   - Clicking a node selects it and opens the sidebar.
   - Collapsing a node hides its subtree.
   - Zoom and pan update transform state and re-render smoothly.

---

## Why This Design

- **Scalable** – Supports deep and complex mind maps
- **Performant** – Minimal dependencies and controlled re-renders
- **Maintainable** – Clear state flow and modular components
- **Extensible** – Easy to add features like search, drag-drop, or persistence
