import { useEffect, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import mindmapData from "../data/mindmap.json";
import "../styles/MindMapView.css";

export default function MindMapView({ theme }) {
  const containerRef = useRef(null);

  const [rootNode, setRootNode] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  /* -------- BEHAVIOR STATE -------- */
  const [selectedId, setSelectedId] = useState(null);
  const [collapsed, setCollapsed] = useState(new Set()); // ✅ KEY FIX

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setRootNode(mindmapData.root);
    setSubTasks(mindmapData.subTasks);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const { offsetWidth, offsetHeight } = containerRef.current;

      if (offsetWidth === 0 || offsetHeight === 0) return;

      setDimensions({
        width: offsetWidth,
        height: offsetHeight,
      });
    };

    // 1️⃣ First attempt
    updateSize();

    // 2️⃣ Next paint (IMPORTANT)
    const raf = requestAnimationFrame(updateSize);

    // 3️⃣ Resize listener
    window.addEventListener("resize", updateSize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
    };
  }, [isSidebarOpen]);

  /* -------- PAN -------- */
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

  /* -------- ZOOM -------- */
  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(2, Math.max(0.6, s - e.deltaY * 0.001)));
  };

  const fitView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleNodeClick = (nodeData, id) => {
    setSelectedId(id);
    setSelectedNode({ ...nodeData, subTasks });
    setIsSidebarOpen(true);
  };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!rootNode) return null;

  const rootPosition = { x: 50, y: 120 };
  const subTaskY = 320;

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

  const visibleSubTasks = collapsed.has("root") ? [] : subTasks;

  return (
    <div className={`mindmap-layout ${theme}`}>
      <div className="mindmap-canvas-wrapper">
        <div
          className="minimap-root"
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
        >
          <div
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "0 0",
              width: "100%",
              height: "100%",
            }}
          >
            <div className="grid-bg" />

            <svg className="connections" width="100%" height="100%">
              {dimensions.width > 0 &&
                visibleSubTasks.map((_, index) => {
                  const subX = 30 + index * 20;
                  return (
                    <path
                      key={index}
                      d={getCurvePath(rootPosition, {
                        x: subX,
                        y: subTaskY,
                      })}
                      className={`link ${selectedId ? "selected" : ""}`}
                    />
                  );
                })}
            </svg>

            {/* ROOT NODE (NEVER CHANGES) */}
            <div
              className={`node ${selectedId === "root" ? "selected" : ""}`}
              data-tooltip={`Title: ${rootNode.title}
              Description: ${rootNode.description || "Root node"}
              Phase: ${rootNode.phase || "-"}
              Progress: ${rootNode.progress || 0}%`}
              style={{
                top: rootPosition.y,
                left: `${rootPosition.x}%`,
              }}
              onClick={() => handleNodeClick(rootNode, "root")}
              onDoubleClick={() => toggleCollapse("root")} // collapse/expand children ONLY
            >
              <div className="icon blue" />
              <div>
                <h4>{rootNode.title}</h4>
                <p>Root Node</p>
              </div>
            </div>

            {/* SUB TASKS */}
            {visibleSubTasks.map((task, index) => {
              const subX = 30 + index * 20;
              return (
                <div
                  key={task.id}
                  className={`node ${selectedId === task.id ? "selected" : ""}`}
                  data-tooltip={task.title}
                  style={{
                    top: subTaskY,
                    left: `${subX}%`,
                  }}
                  onClick={() =>
                    handleNodeClick(
                      {
                        title: task.title,
                        description: task.done
                          ? "Task completed"
                          : "Task pending",
                      },
                      task.id
                    )
                  }
                >
                  <div className={`icon ${task.color}`} />
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.done ? "Completed" : "Pending"}</p>
                  </div>
                </div>
              );
            })}
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
          subTasks={subTasks}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
