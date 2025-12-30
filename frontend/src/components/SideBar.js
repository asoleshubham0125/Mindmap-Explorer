import { useEffect, useState } from "react";
import "../styles/sidebar.css";

export default function SideBar({
  node,
  subTasks = [],
  onClose,
  onUpdateNode,
  onAddChildNode,
  onDeleteNode,
}) {
  const [localSubTasks, setLocalSubTasks] = useState([]);

  // mode: "view" | "edit" | "add"
  const [mode, setMode] = useState("view");

  const [form, setForm] = useState({
    title: "",
    description: "",
    phase: "",
    progress: 0,
  });

  const [childForm, setChildForm] = useState({
    title: "",
    description: "",
  });

  /* Sync subtasks */
  useEffect(() => {
    setLocalSubTasks(subTasks || []);
  }, [subTasks]);

  /* Sync form when node changes */
  useEffect(() => {
    if (node) {
      setForm({
        title: node.title || "",
        description: node.description || "",
        phase: node.phase || "",
        progress: node.progress || 0,
      });
      setChildForm({ title: "", description: "" });
      setMode("view");
    }
  }, [node]);

  /* Edit handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    onUpdateNode(node.id, form);
    setMode("view");
  };

  /* Add child handlers */
  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setChildForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChild = () => {
    if (!childForm.title.trim()) return;
    onAddChildNode(node.id, childForm);
    setChildForm({ title: "", description: "" });
    setMode("view");
  };

  /* Delete */
  const handleDelete = () => {
    if (!node) return;
    const ok = window.confirm(
      `Are you sure you want to delete "${node.title}"?\nThis will delete all its child nodes.`
    );
    if (!ok) return;
    onDeleteNode(node.id);
    onClose();
  };

  /* EXPORT JSON */
  const handleExport = () => {
    if (!node) return;

    const dataStr = JSON.stringify(node, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${node.title || "node"}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <aside className="sidebar-root">
      {/* HEADER */}
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <div className="header-icon">
            <span className="material-symbols-outlined">code</span>
          </div>
          <div>
            <h2>{node?.title}</h2>
            <p>Selected Node</p>
          </div>
        </div>

        <button className="sidebar-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="sidebar-scroll">
        <div className="main-card">
          <div className="main-card-header">
            <div>
              <div className="meta-row">
                <span className="phase-badge">{node?.phase}</span>
                <span className="muted">Updated just now</span>
              </div>
              <h1>{node?.title}</h1>
            </div>
          </div>

          {/* VIEW */}
          {mode === "view" && (
            <p className="description">{node?.description}</p>
          )}

          {/* EDIT / ADD (same UI) */}
          {(mode === "edit" || mode === "add") && (
            <div className="add-child-card">
              <div className="add-child-group">
                <label className="add-child-label">
                  <span className="material-symbols-outlined">title</span>
                  Node Title
                </label>
                <input
                  name="title"
                  placeholder="e.g. User Authentication Flow"
                  value={mode === "edit" ? form.title : childForm.title}
                  onChange={mode === "edit" ? handleChange : handleChildChange}
                  className="add-child-input"
                />
              </div>

              <div className="add-child-group">
                <label className="add-child-label">
                  <span className="material-symbols-outlined">description</span>
                  Description <span className="optional">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Briefly describe the purpose of this node..."
                  value={
                    mode === "edit" ? form.description : childForm.description
                  }
                  onChange={mode === "edit" ? handleChange : handleChildChange}
                  className="add-child-textarea"
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBTASKS */}
        <section className="section">
          <span className="section-title">SUB-TASKS</span>
          {localSubTasks.map((task) => (
            <label key={task.id} className={`task ${task.done ? "done" : ""}`}>
              <input type="checkbox" checked={task.done} readOnly />
              <span className="task-text">{task.title}</span>
            </label>
          ))}
        </section>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        {mode === "view" && (
          <>
            <button className="primary-btn" onClick={() => setMode("edit")}>
              <span className="material-symbols-outlined">edit</span>
              Edit Node
            </button>

            <button className="icon-btn" onClick={() => setMode("add")}>
              <span className="material-symbols-outlined">add</span>
            </button>

            <button className="icon-btn" onClick={handleExport}>
              <span className="material-symbols-outlined">download</span>
            </button>

            <button
              className="danger-btn"
              onClick={handleDelete}
              disabled={node?.isRoot}
              title={
                node?.isRoot ? "Root node cannot be deleted" : "Delete node"
              }
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </>
        )}

        {mode === "edit" && (
          <button className="primary-btn" onClick={handleSave}>
            <span className="material-symbols-outlined">save</span>
            Save
          </button>
        )}

        {mode === "add" && (
          <button className="primary-btn" onClick={handleAddChild}>
            <span className="material-symbols-outlined">add</span>
            Add Child
          </button>
        )}
      </div>
    </aside>
  );
}
