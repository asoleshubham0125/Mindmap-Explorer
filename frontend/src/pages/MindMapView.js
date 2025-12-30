import { useEffect, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import mindmapData from "../data/mindmap.json";
import "../styles/MindMapView.css";

const LEVEL_Y_GAP = 180;
const NODE_X_GAP = 20;

export default function MindMapView() {
  const nodePositionsRef = useRef([]);
  const containerRef = useRef(null);

  const [rootNode, setRootNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [selectedId, setSelectedId] = useState(null);
  const [collapsed, setCollapsed] = useState(new Set());

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("mindmap");
    setRootNode(saved ? JSON.parse(saved) : mindmapData);
  }, []);

  /* ---------------- SIZE CALC ---------------- */
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (!offsetWidth || !offsetHeight) return;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    };

    updateSize();
    const raf = requestAnimationFrame(updateSize);
    window.addEventListener("resize", updateSize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
    };
  }, [isSidebarOpen]);

  /* ---------------- PAN ---------------- */
  const onMouseDown = (e) => {
    isPanning.current = true;
    panStart.current = {
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    };
  };

  const onMouseMove = (e) => {
    if (!isPanning.current) return;
    setTranslate({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    });
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  /* ---------------- ZOOM ---------------- */
  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(2, Math.max(0.6, s - e.deltaY * 0.001)));
  };

  const fitView = () => {
    if (!containerRef.current || nodePositionsRef.current.length === 0) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const xs = nodePositionsRef.current.map((p) => (p.x / 100) * width);
    const ys = nodePositionsRef.current.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const contentWidth = maxX - minX + 320; // node padding
    const contentHeight = maxY - minY + 200;

    const scaleX = width / contentWidth;
    const scaleY = height / contentHeight;

    const newScale = Math.min(scaleX, scaleY, 1);

    const centerX = minX + contentWidth / 2;
    const centerY = minY + contentHeight / 2;

    setScale(newScale);
    setTranslate({
      x: width / 2 - centerX * newScale,
      y: height / 2 - centerY * newScale,
    });
  };

  /* ---------------- HELPERS ---------------- */
  const toggleCollapse = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNodeClick = (node) => {
    setSelectedId(node.id);
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  const getCurvePath = (from, to) => {
    const fromX = (from.x / 100) * dimensions.width;
    const toX = (to.x / 100) * dimensions.width;
    const controlY = (from.y + to.y) / 2;

    return `
      M ${fromX},${from.y}
      C ${fromX},${controlY}
        ${toX},${controlY}
        ${toX},${to.y}
    `;
  };

  /* ---------------- UPDATE NODE ---------------- */
  const updateNodeById = (node, id, updates) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (!node.children) return node;

    return {
      ...node,
      children: node.children.map((child) =>
        updateNodeById(child, id, updates)
      ),
    };
  };

  const handleUpdateNode = (id, updates) => {
    setRootNode((prev) => updateNodeById(prev, id, updates));
  };

  /* ---------------- ADD CHILD NODE ---------------- */
  const addChildNodeById = (node, parentId, newChild) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newChild],
      };
    }

    if (!node.children) return node;

    return {
      ...node,
      children: node.children.map((child) =>
        addChildNodeById(child, parentId, newChild)
      ),
    };
  };

  const handleAddChildNode = (parentId, childData) => {
    const newNode = {
      id: `node-${Date.now()}`,
      title: childData.title,
      description: childData.description,
      done: false,
      color: "blue",
      children: [],
    };

    setRootNode((prev) => addChildNodeById(prev, parentId, newNode));
  };

  const deleteNodeById = (node, targetId) => {
    if (!node.children) return node;

    return {
      ...node,
      children: node.children
        .filter((child) => child.id !== targetId)
        .map((child) => deleteNodeById(child, targetId)),
    };
  };

  const handleDeleteNode = (id) => {
    // prevent deleting root
    if (rootNode.id === id) return;

    setRootNode((prev) => deleteNodeById(prev, id));
    setSelectedNode(null);
    setSelectedId(null);
    setIsSidebarOpen(false);
  };

  /* ---------------- PERSIST ---------------- */
  useEffect(() => {
    if (rootNode) {
      localStorage.setItem("mindmap", JSON.stringify(rootNode));
    }
  }, [rootNode]);

  const getSubtreeWidth = (node) => {
    if (!node.children || node.children.length === 0) {
      return NODE_X_GAP;
    }

    return node.children.map(getSubtreeWidth).reduce((a, b) => a + b, 0);
  };

  /* ---------------- RECURSIVE RENDER ---------------- */
  const renderChildren = (node, depth, parentPos) => {
    if (!node.children || collapsed.has(node.id)) return null;

    const totalWidth = getSubtreeWidth(node);
    let currentX = parentPos.x - totalWidth / 2;

    return node.children.map((child) => {
      const childWidth = getSubtreeWidth(child);
      const x = currentX + childWidth / 2;
      const y = 120 + (depth + 1) * LEVEL_Y_GAP;

      // ✅ ADD THIS LINE (EXACT SPOT)
      nodePositionsRef.current.push({ x, y });

      currentX += childWidth;

      const pos = { x, y };

      return (
        <div key={child.id}>
          {/* CONNECTION */}
          {dimensions.width > 0 && (
            <svg className="connections">
              <path
                d={getCurvePath(parentPos, pos)}
                className={`link ${selectedId === child.id ? "selected" : ""}`}
              />
            </svg>
          )}

          {/* NODE */}
          <div
            className={`node ${selectedId === child.id ? "selected" : ""}`}
            style={{ top: y, left: `${x}%` }}
            data-tooltip={`Title: ${child.title}
Description: ${child.description || "No description"}
Status: ${child.done ? "Completed" : "Pending"}`}
            onClick={() => handleNodeClick(child)}
            onDoubleClick={() => toggleCollapse(child.id)}
          >
            <div className={`icon ${child.color || "blue"}`} />
            <div>
              <h4>{child.title}</h4>
              <p>{child.done ? "Completed" : "Pending"}</p>
            </div>
          </div>

          {/* RECURSIVE */}
          {renderChildren(child, depth + 1, pos)}
        </div>
      );
    });
  };

  if (!rootNode) return null;

  const rootPos = { x: 50, y: 120 };
  nodePositionsRef.current = [];

  /* ---------------- RENDER ---------------- */
  return (
    <div className="mindmap-layout">
      <div className="mindmap-canvas-wrapper">
        <div
          className="minimap-root"
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
        >
          <div className="grid-bg" />
          <div
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "0 0",
              width: "100%",
              height: "100%",
            }}
          >
            {/* ROOT NODE */}
            <div
              className={`node ${selectedId === rootNode.id ? "selected" : ""}`}
              style={{ top: rootPos.y, left: `${rootPos.x}%` }}
              data-tooltip={`Title: ${rootNode.title}
Description: ${rootNode.description || "Root node"}
Phase: ${rootNode.phase || "-"}
Progress: ${rootNode.progress ?? 0}%`}
              onClick={() => handleNodeClick(rootNode)}
              onDoubleClick={() => toggleCollapse(rootNode.id)}
            >
              {(() => {
                nodePositionsRef.current.push({
                  x: rootPos.x,
                  y: rootPos.y,
                });
                return null;
              })()}
              <div className="icon blue" />
              <div>
                <h4>{rootNode.title}</h4>
                <p>Root Node</p>
              </div>
            </div>

            {renderChildren(rootNode, 0, rootPos)}
          </div>

          {/* CONTROLS */}
          <div className="zoom-controls">
            <button onClick={() => setScale((s) => Math.min(2, s + 0.1))}>
              +
            </button>
            <button onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}>
              −
            </button>
            <button onClick={fitView}>⤢</button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <SideBar
          node={selectedNode}
          subTasks={selectedNode?.children || []}
          onClose={() => setIsSidebarOpen(false)}
          onUpdateNode={handleUpdateNode}
          onAddChildNode={handleAddChildNode}
          onDeleteNode={handleDeleteNode}
        />
      )}
    </div>
  );
}
