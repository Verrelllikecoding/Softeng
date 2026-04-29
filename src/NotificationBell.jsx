import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

const typeConfig = {
  new_proposal:          { icon: "📋", color: "#1d4ed8" },
  proposal_accepted:     { icon: "🎉", color: "#15803d" },
  proposal_rejected:     { icon: "✕",  color: "#be123c" },
  deal_finalized:        { icon: "✓",  color: "#15803d" },
  delivery_submitted:    { icon: "📦", color: "#1d4ed8" },
  payment_confirmed:     { icon: "💰", color: "#15803d" },
  revision_requested:    { icon: "🔄", color: "#d97706" },
  scope_change_request:  { icon: "🔄", color: "#7c3aed" },
  scope_change_accepted: { icon: "✓",  color: "#15803d" },
  scope_change_rejected: { icon: "✕",  color: "#be123c" },
  scope_change_finalized:{ icon: "🎉", color: "#15803d" },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread count saat komponen mount
  useEffect(() => {
    if (!token) return;
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Gagal fetch unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal fetch notifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!open) {
      fetchNotifications();
    }
    setOpen(!open);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("http://localhost:3001/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Gagal mark all read:", err);
    }
  };

  const handleNotifClick = async (notif) => {
    // Mark as read
    if (!notif.is_read) {
      try {
        await fetch(`http://localhost:3001/api/notifications/${notif.id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Gagal mark read:", err);
      }
    }

    // Navigate ke link
    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  if (!token) return null;

  return (
    <div className="notif-bell-wrap" ref={dropdownRef}>
      <button className="notif-bell-btn" onClick={handleOpen} aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span className="notif-dropdown-title">Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all-btn" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-dropdown-body">
            {loading ? (
              <div className="notif-loading">
                <span className="notif-spinner" />
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => {
                const cfg = typeConfig[notif.type] || { icon: "🔔", color: "#64748b" };
                return (
                  <div
                    key={notif.id}
                    className={`notif-item ${!notif.is_read ? "notif-item--unread" : ""}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className="notif-item-icon" style={{ background: cfg.color + "18", color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className="notif-item-body">
                      <p className="notif-item-title">{notif.title}</p>
                      <p className="notif-item-msg">{notif.message}</p>
                      <span className="notif-item-time">{timeAgo(notif.created_at)}</span>
                    </div>
                    {!notif.is_read && <div className="notif-unread-dot" />}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notif-dropdown-footer">
              <span>{notifications.length} notifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
