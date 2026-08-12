import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, useToast } from "../Toast";
import Cookies from "js-cookie";


const API_BASE = "https://leaddesk-h4p6.onrender.com";

// STATUS CONFIG
const STATUS_CYCLE = { New: "Contacted", Contacted: "Closed", Closed: "New" };

const STATUS_STYLES = {
  New: "badge-new",
  Contacted: "badge-contacted",
  Closed: "badge-closed",
};

const STATUS_ICONS = {
  New: "🔵",
  Contacted: "🟡",
  Closed: "🟢",
};

const BUDGET_LABELS = {
  "under-1k": "< $1K",
  "1k-5k": "$1K – $5K",
  "5k-10k": "$5K – $10K",
  "10k-25k": "$10K – $25K",
  "25k-plus": "$25K+",
};

// STAT CARD
const StatCard = ({ label, value, color, icon }) => (
  <div className="glass rounded-xl p-4 sm:p-5 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-xl sm:text-2xl font-syne font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 font-inter">{label}</div>
    </div>
  </div>
);

// ADMIN PANEL
const AdminPanel = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [total, setTotal] = useState(0);
  const searchTimeout = useRef(null);

  // FETCH LEADS
  const fetchLeads = async (search, statusFilter) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }
      if (statusFilter) {
        params.status = statusFilter;
      }
      const res = await axios.get(
        `${API_BASE}/api/leads`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setLeads(res.data.leads);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        Cookies.remove("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchLeads(search, statusFilter);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, statusFilter]);

  // STATUS TOGGLE
  const handleStatusToggle = async (lead) => {
    const nextStatus = STATUS_CYCLE[lead.status];
    setUpdatingId(lead._id);
    const token = Cookies.get("token")
    try {
      const res = await axios.put(
        `${API_BASE}/api/leads/${lead._id}`,
        {
          nextStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === lead._id ? { ...l, status: nextStatus } : l
          )
        );
        addToast(`Status updated to "${nextStatus}"`, "success");
      }
    } catch {
      addToast("Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // DELETE LEAD
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = Cookies.get("token")
      const res = await axios.delete(`${API_BASE}/api/leads/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setLeads((prev) => prev.filter((l) => l._id !== id));
      setTotal((t) => t - 1);
      addToast("Lead deleted successfully.", "success");
    } catch {
      addToast("Failed to delete lead.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // STATS
  const allLeads = leads;
  const statsNew = allLeads.filter((l) => l.status === "New").length;
  const statsContacted = allLeads.filter((l) => l.status === "Contacted").length;
  const statsClosed = allLeads.filter((l) => l.status === "Closed").length;

  // FORMAT DATE
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0f2c] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-dark border-b border-white/5 px-4 sm:px-6 lg:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-white font-syne font-bold text-lg hidden xs:block">
              Lead<span className="text-blue-400">Desk</span>
            </span>
          </div>

          {/* Center title */}
          <h1 className="font-syne font-bold text-white text-base sm:text-lg">
            Admin Dashboard
          </h1>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-5">
            <span className="hidden md:flex items-center gap-1.5 text-white text-sm font-inter font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {admin?.username || admin?.email}
            </span>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="flex items-center gradient-btn hover:text-white cursor-pointer gap-1.5 text-white text-sm font-inter px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block text-white">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 relative z-10">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
          <StatCard label="Total Leads" value={total} icon="📊" color="bg-blue-500/10" />
          <StatCard label="New" value={statsNew} icon="🔵" color="bg-blue-500/10" />
          <StatCard label="Contacted" value={statsContacted} icon="🟡" color="bg-amber-500/10" />
          <StatCard label="Closed" value={statsClosed} icon="🟢" color="bg-emerald-500/10" />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-evenly sm:items-center gap-3 mb-5 ">
          {/* Search */}
          <div className="relative flex-2 w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="admin-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10 w-full"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            id="admin-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-34 input-field cursor-pointer flex-1"
            style={{ appearance: "none" }}
          >
            <option value="" className="bg-[#0a0f2c]">All Statuses</option>
            <option value="New" className="bg-[#0a0f2c]">New</option>
            <option value="Contacted" className="bg-[#0a0f2c]">Contacted</option>
            <option value="Closed" className="bg-[#0a0f2c]">Closed</option>
          </select>

          {/* Refresh */}
          <button
            onClick={() => fetchLeads(setSearch(''), setStatusFilter(''))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm font-inter transition-all"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:block">Refresh</span>
          </button>
        </div>

        {/* Result count */}
        <p className="text-slate-500 font-inter text-xs mb-3">
          Showing <span className="text-slate-300 font-medium">{leads.length}</span> of <span className="text-slate-300 font-medium">{total}</span> leads
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="ml-2 text-blue-400 hover:text-blue-300 underline">
              Clear filters
            </button>
          )}
        </p>

        {/* TABLE / CARDS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-slate-400 font-inter text-sm">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-syne font-bold text-white text-lg mb-2">No leads found</h3>
            <p className="text-slate-400 font-inter text-sm">
              {search || statusFilter
                ? "Try adjusting your search or filters."
                : "No leads submitted yet. Share your landing page!"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block glass rounded-2xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Budget</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Message</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3.5 text-slate-300 font-inter font-medium text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => (
                      <tr
                        key={lead._id}
                        className={`border-b border-white/5 hover:bg-white/3 transition-colors ${idx % 2 === 0 ? "" : "bg-white/[0.015]"}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-syne font-bold flex-shrink-0">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-inter font-medium text-sm">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-slate-300 font-inter text-sm">{lead.email}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-slate-300 font-inter text-sm">{BUDGET_LABELS[lead.budget] || lead.budget}</span>
                        </td>
                        <td className="px-5 py-4 max-w-[200px]">
                          <span className="text-slate-400 font-inter text-sm line-clamp-1 truncate block" title={lead.message}>
                            {lead.message}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-slate-400 font-inter text-xs">{formatDate(lead.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            id={`status-btn-${lead._id}`}
                            onClick={() => handleStatusToggle(lead)}
                            disabled={updatingId === lead._id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ${STATUS_STYLES[lead.status]} ${updatingId === lead._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={`Click to change to ${STATUS_CYCLE[lead.status]}`}
                          >
                            {updatingId === lead._id ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <span>{STATUS_ICONS[lead.status]}</span>
                            )}
                            {lead.status}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            id={`delete-btn-${lead._id}`}
                            onClick={() => handleDelete(lead._id)}
                            disabled={deletingId === lead._id}
                            className="text-slate-500 cursor-pointer flex justify-center items-center w-full hover:text-rose-400 transition-colors disabled:opacity-50"
                            title="Delete lead"
                          >
                            {deletingId === lead._id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {leads.map((lead) => (
                <div key={lead._id} className="glass rounded-xl border border-white/5 overflow-hidden">
                  {/* Card Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-syne font-bold flex-shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-inter font-semibold text-sm truncate">{lead.name}</p>
                        <p className="text-slate-500 font-inter text-xs truncate">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        id={`mobile-status-btn-${lead._id}`}
                        onClick={(e) => { e.stopPropagation(); handleStatusToggle(lead); }}
                        disabled={updatingId === lead._id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-inter font-semibold ${STATUS_STYLES[lead.status]} ${updatingId === lead._id ? "opacity-50" : ""}`}
                      >
                        {STATUS_ICONS[lead.status]} {lead.status}
                      </button>
                      <svg
                        className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === lead._id ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === lead._id && (
                    <div className="px-4 pb-4 border-t border-white/5 pt-3 flex flex-col gap-2.5">
                      <div>
                        <span className="text-slate-500 text-xs font-inter uppercase tracking-wider">Budget</span>
                        <p className="text-slate-300 font-inter text-sm mt-0.5">{BUDGET_LABELS[lead.budget] || lead.budget}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs font-inter uppercase tracking-wider">Message</span>
                        <p className="text-slate-300 font-inter text-sm mt-0.5 leading-relaxed">{lead.message}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs font-inter uppercase tracking-wider">Submitted</span>
                        <p className="text-slate-300 font-inter text-sm mt-0.5">{formatDate(lead.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleStatusToggle(lead)}
                          disabled={updatingId === lead._id}
                          className="flex-1 py-2 rounded-lg border border-blue-500/30 text-blue-400 font-inter text-xs font-medium hover:bg-blue-500/10 transition-colors"
                        >
                          → {STATUS_CYCLE[lead.status]}
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          disabled={deletingId === lead._id}
                          className="px-3 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer Credit */}
      <footer className="border-t border-white/5 py-4 text-center">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400/50 hover:text-blue-400 font-inter text-sm font-medium transition-colors"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default AdminPanel;
