import { useEffect, useState } from "react";
import "../styles/sidebar.css";

export default function SideBar({ node, subTasks = [], onClose }) {
  const [localSubTasks, setLocalSubTasks] = useState([]);

  useEffect(() => {
    setLocalSubTasks(subTasks || []);
  }, [subTasks]);

  const toggleTask = (id) => {
    setLocalSubTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
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
        <button
          className="sidebar-close-btn"
          aria-label="Close details panel"
          title="Close"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="sidebar-scroll">
        {/* MAIN CARD */}
        <div className="main-card">
          <div className="main-card-header">
            <div>
              <div className="meta-row">
                <span className="phase-badge">{node?.phase}</span>
                <span className="muted">Updated 2h ago</span>
              </div>
              <h1>{node?.title}</h1>
            </div>

            <div className="progress-ring">
              <svg viewBox="0 0 36 36">
                <path
                  className="ring-bg"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="ring-fg"
                  strokeDasharray={`${node?.progress ?? 0},100`}
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span>{node?.progress ?? 0}%</span>
            </div>
          </div>

          <p className="description">{node?.description}</p>

          <div className="tag-row">
            {node?.tags?.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>

        {/* ASSIGNEES */}
        <section className="section">
          <div className="section-header">
            <span>ASSIGNEES</span>
            <a
              href="#"
              className="link-action"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--accent)",
              }}
            >
              Manage
            </a>
          </div>

          <div className="assignee-card">
            <div className="avatars">
              <img src="https://i.pravatar.cc/32?img=1" alt="Assignee 1" />
              <img src="https://i.pravatar.cc/32?img=2" alt="Assignee 2" />
              <img src="https://i.pravatar.cc/32?img=3" alt="Assignee 3" />
              <div className="avatar-more">+2</div>
            </div>

            <a href="#" className="add-avatar-link" aria-label="Add assignee">
              <span className="material-symbols-outlined">add</span>
            </a>
          </div>
        </section>

        {/* SUB TASKS */}
        <section className="section">
          <span className="section-title">SUB-TASKS</span>

          {localSubTasks.map((task) => (
            <label key={task.id} className={`task ${task.done ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />

              <span className="custom-checkbox">
                <span className="material-symbols-outlined">check</span>
              </span>

              <span className="task-text">{task.title}</span>

              <span className={`dot ${task.color}`} />
            </label>
          ))}
        </section>

        {/* ATTACHMENTS */}
        <section className="section">
          <span className="section-title">ATTACHMENTS</span>

          <div className="attachment-card">
            <div className="file-icon">
              <span className="material-symbols-outlined">description</span>
            </div>

            <div className="file-info">
              <strong>Architecture_Diagram_v2.pdf</strong>
              <span>2.4 MB · Uploaded yesterday</span>
            </div>

            <a
              href="#"
              className="download-btn"
              aria-label="Download attachment"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="primary-btn">
          <span className="material-symbols-outlined">edit</span>
          Edit Node
        </button>
        <button className="icon-btn">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
    </aside>
  );
}
