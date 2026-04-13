import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  PlusCircle,
  CheckCircle,
  Clock,
  Users,
  LogOut,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import Loading from "../components/Loading";

const TLDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await axios.get(
        "https://nammateammanagement-backend.onrender.com/my-tasks",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      setTasks(response.data);
    } catch (err) {
      console.error("Failed to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get(
        "https://nammateammanagement-backend.onrender.com/members",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      setMembers(response.data);
    } catch (err) {
      console.error("Failed to fetch members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://nammateammanagement-backend.onrender.com/tasks",
        newTask,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      setShowTaskForm(false);
      setNewTask({ title: "", description: "", assigned_to: "", due_date: "" });
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await axios.patch(
        `https://nammateammanagement-backend.onrender.com/tasks/${taskId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      fetchTasks();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://nammateammanagement-backend.onrender.com/register",
        newMember,
      );
      setShowMemberForm(false);
      setNewMember({ name: "", email: "", password: "", role: "Member" });
      fetchMembers();
      alert("Member added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (email) => {
    if (!window.confirm(`Are you sure you want to remove ${email}?`)) return;
    try {
      await axios.delete(
        `https://nammateammanagement-backend.onrender.com/members/${email}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.svg"
            alt="NammaTeam Logo"
            className="h-10 w-10 shadow-sm rounded-lg"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NammaTeam TL
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-blue-600 font-medium tracking-wider uppercase">
              Team Leader
            </p>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Team Progress
              </h2>
              <p className="text-gray-500 text-sm">
                Managing {tasks.length} total tasks
              </p>
            </div>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> New Task
            </button>
          </div>

          {showTaskForm && (
            <form
              onSubmit={handleCreateTask}
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Task Title"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border transition-all"
                  required
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border transition-all"
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Detailed Description"
                className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border transition-all h-24"
                required
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <select
                className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border transition-all"
                required
                value={newTask.assigned_to}
                onChange={(e) =>
                  setNewTask({ ...newTask, assigned_to: e.target.value })
                }
              >
                <option value="">Assign to member...</option>
                {members.map((m) => (
                  <option key={m.email} value={m.email}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-100 transition-all"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {loadingTasks ? (
              <Loading />
            ) : tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <LayoutDashboard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-400 font-medium">
                  No tasks found. Start by assigning one!
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex justify-between items-start"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          task.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : task.status === "Review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-6 text-xs text-gray-400 font-medium uppercase tracking-tight">
                      <span className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-blue-500" />{" "}
                        {task.assigned_to}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{" "}
                        {task.due_date || "No deadline"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 pt-1">
                    {task.status === "Review" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStatus(task.id, "Approved")}
                          className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Approve Submission"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(task.id, "Pending")}
                          className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reject - Back to Pending"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Member List */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" /> Team Members
              </h2>
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                title="Add New Member"
              >
                <PlusCircle className="h-6 w-6" />
              </button>
            </div>

            {showMemberForm && (
              <form
                onSubmit={handleAddMember}
                className="mb-6 bg-blue-50/50 p-5 rounded-xl space-y-3 border border-blue-100 animate-in zoom-in-95 duration-200"
              >
                <input
                  placeholder="Member Name"
                  className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-white border"
                  required
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-white border"
                  required
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Initial Password"
                  className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-white border"
                  required
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                />
                <div className="flex space-x-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold"
                  >
                    Invite
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMemberForm(false)}
                    className="px-4 py-2 rounded-lg bg-white text-gray-500 border text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-1">
              {loadingMembers ? (
                <div className="py-4">
                  <Loading />
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.email}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-none mb-1">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {member.email !== user.email && (
                      <button
                        onClick={() => handleRemoveMember(member.email)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-600 p-2 transition-all"
                        title="Remove Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {member.email === user.email && (
                      <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        You
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TLDashboard;
