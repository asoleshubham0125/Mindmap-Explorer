import { useEffect, useState, useRef } from "react";
import SideBar from "../components/SideBar";
import mindmapData from "../data/mindmap.json";
import "./MindMapView.css";

export default function MindMapView() {
  const containerRef = useRef(null);
  const [rootNode, setRootNode] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setRootNode(mindmapData.root);
    setSubTasks(mindmapData.subTasks);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();

    const timer = setTimeout(updateSize, 100);

    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSize);
    };
  }, [isSidebarOpen]);

  const handleNodeClick = (nodeData) => {
    setSelectedNode({
      ...nodeData,
      subTasks,
    });
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedNode(null);
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

  return (
    <div className="mindmap-layout">
      <div className="mindmap-canvas-wrapper">
        <div className="minimap-root" ref={containerRef}>
          <div className="grid-bg" />

          <svg className="connections" width="100%" height="100%">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="rgba(255,255,255,0.3)"
                />
              </marker>
            </defs>

            {dimensions.width > 0 &&
              subTasks.map((_, index) => {
                const subX = 30 + index * 20;
                return (
                  <path
                    key={index}
                    d={getCurvePath(rootPosition, { x: subX, y: subTaskY })}
                    className="link"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
          </svg>

          <div
            className="node"
            style={{
              top: rootPosition.y,
              left: `${rootPosition.x}%`,
            }}
            onClick={() => handleNodeClick(rootNode)}
          >
            <div className="icon blue" />
            <div>
              <h4>{rootNode.title}</h4>
              <p>Root Node</p>
            </div>
          </div>

          {subTasks.map((task, index) => {
            const subX = 30 + index * 20;
            return (
              <div
                key={task.id}
                className="node"
                style={{
                  top: subTaskY,
                  left: `${subX}%`,
                }}
                onClick={() =>
                  handleNodeClick({
                    title: task.title,
                    description: task.done ? "Task completed" : "Task pending",
                    phase: rootNode.phase,
                    progress: rootNode.progress,
                    tags: ["subtask"],
                  })
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
      </div>

      {isSidebarOpen && (
        <SideBar
          node={selectedNode}
          subTasks={subTasks}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
}
