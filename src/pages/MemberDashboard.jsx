import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Clock, LogOut, LayoutDashboard } from "lucide-react";
import Loading from "../components/Loading";

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const submitForReview = async (taskId) => {
    try {
      await axios.patch(
        `https://nammateammanagement-backend.onrender.com/tasks/${taskId}/status`,
        { status: "Review" },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      fetchTasks();
    } catch (err) {
      alert("Failed to submit for review");
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
            NammaTeam Member
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-indigo-600 font-medium tracking-wider uppercase">
              Team Member
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

      <main className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">My Worklist</h2>
          <p className="text-gray-500">
            You have {tasks.filter((t) => t.status === "Pending").length}{" "}
            pending tasks
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Loading />
          ) : tasks.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-100 text-center">
              <LayoutDashboard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">
                Relax! No tasks assigned to you right now.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex justify-between items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                  <p className="text-gray-500 text-sm max-w-xl">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-orange-500" />{" "}
                      Due: {task.due_date || "No deadline"}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  {task.status === "Pending" && (
                    <button
                      onClick={() => submitForReview(task.id)}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center text-sm font-bold active:scale-95"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Finish & Submit
                    </button>
                  )}
                  {task.status === "Review" && (
                    <div className="text-yellow-600 flex items-center text-sm font-bold bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                      <Clock className="h-4 w-4 mr-2 animate-pulse" /> Under
                      Review
                    </div>
                  )}
                  {task.status === "Approved" && (
                    <div className="text-green-600 flex items-center text-sm font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                      <CheckCircle className="h-4 w-4 mr-2" /> Completed
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
