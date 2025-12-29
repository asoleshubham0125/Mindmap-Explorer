# Frontend Development Internship – Assignment

## Objective

The goal of this assignment is to evaluate your ability to:

- Build **complex, interactive user interfaces**
- Work with **data-driven visualizations**
- Design a **clean and intuitive UX**
- Structure frontend code in a **scalable and maintainable way**

You are required to build an **interactive mindmap UI**, functionally similar to the one demonstrated in the provided reference HTML file.

---

## Problem Statement

Design and implement a **seamless, interactive Mindmap UI** that closely resembles the behavior and experience of the mindmap present in the shared HTML file.

The UI should visualize hierarchical data as a mindmap and allow rich user interaction such as hovering, clicking, editing, and exploration.

html file link: https://drive.google.com/file/d/1z60ctzdJOBPPGwtbeyW6zNYfoI48KbsJ/view?usp=sharing 
---

## Functional Requirements

### 1. Mindmap Visualization
- Display a **graph / mindmap** structure with nodes and connections
- Support **hierarchical relationships** (parent → child)
- Layout should be clear, readable, and visually appealing

---

### 2. Interactive Features (Mandatory)

Your implementation should support interactions similar to the reference HTML:

- **Hover interactions**
  - Show contextual information (summary, metadata, etc.)
- **Click interactions**
  - Select a node
  - Highlight related nodes / edges
- **Expand / Collapse**
  - Expand or collapse branches of the mindmap
- **Drill Down / Drill Up**
  - Navigate deeper into the hierarchy or back up
- **Pan & Zoom**
  - Smooth zooming and panning for large graphs
- **Fit to View / Reset View**

> The UI does not need to be pixel-perfect, but **functional parity and UX clarity are expected**.

---

### 3. Data Display

The UI must display data in **two places**:

1. **On hover**
   - Short summary or quick info
2. **In a side panel / summary section**
   - Detailed description of the selected node
   - Any additional metadata you choose to display (inputs, outputs, notes, etc.)

---

## Key Capability (Very Important)

### Data-Driven Rendering

The mindmap **must NOT be hardcoded**.

- The entire visualization should be generated from a **structured data file**, such as:
  - JSON (preferred)
  - YAML
  - Any similar structured format

👉 **Changing only the data file should update the visual mindmap**, without modifying UI logic.

### Example Expectations
- Adding a node in the JSON → new node appears in UI
- Updating text in JSON → updated text appears on hover / sidebar
- Changing hierarchy → structure updates automatically

---

## Technical Expectations

- You are free to choose:
  - Frameworks (React, Vue, Vanilla JS, etc.)
  - Visualization libraries (D3, Cytoscape, custom SVG/Canvas, etc.)
  - Styling approach (CSS, Tailwind, CSS-in-JS, etc.)
- Code should be:
  - Readable
  - Modular
  - Easy to extend

> Backend is **not required**. This is a frontend-focused assignment.

---

## Submission Requirements

Your submission **must include all of the following**:

### 1. Solution Description (Mandatory)
A short document or README explaining:
- Technologies used
- Libraries used (and why)
- Overall architecture / approach
- How data flows from the JSON (or other format) to the UI

---

### 2. Screenshots (Mandatory)
Provide screenshots showing:
- The full mindmap view
- Hover interactions
- Node selection & summary panel
- Expanded and collapsed states

---

### 3. Demo Video (Mandatory)
A short screen-recorded video demonstrating:
- Navigation (pan, zoom, fit view)
- Hover behavior
- Expand / collapse functionality
- Drill down / drill up
- How data updates reflect visually

> Voice narration is optional, but interactions must be clearly visible.

---

## Evaluation Criteria

You will be evaluated on:

- **Correctness**
  - All required features implemented
- **Data-driven design**
  - Clean separation of data and UI
- **UI / UX quality**
  - Clarity, smooth interactions, usability
- **Code quality**
  - Structure, readability, maintainability
- **Problem-solving approach**
  - Thoughtful handling of interactions and state

---

## Bonus (Optional – Nice to Have)

These are **not required**, but will be appreciated:

- Dark / Light mode
- Inline editing of nodes
- Context menus (right-click actions)
- Export / download functionality
- Animations that improve clarity (not distractions)

---

## Submission Format

- GitHub repository **or**
- Zip file containing:
  - Source code
  - Data file(s)
  - README
  - Screenshots
  - Video link (Drive / YouTube / Loom, etc.)

---

## Important Notes

- Focus on **clarity and correctness**, not over-engineering
- Keep assumptions documented
- If something is intentionally skipped, explain why

---

We are looking forward to seeing **how you think, structure UI, and work with data-driven visuals**.

Good luck 🚀
