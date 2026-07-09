import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { USERS_API, QUIZ_API, ADMIN_RESULTS_API, BASE_URL } from "../../config/api.config";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Result {
  _id: string;
  userId: { name: string; email: string } | null;
  quizId: { title: string } | null;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface DashboardStats {
  users: number;
  quizzes: number;
  submissions: number;
  totalTests: number;
  avgScore: number;
}

interface ChartData {
  date: string;
  tests: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ users: 0, quizzes: 0, submissions: 0, totalTests: 0, avgScore: 0 });
  const [recentActivity, setRecentActivity] = useState<Result[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, quizzesRes, resultsRes, submissionsRes] = await Promise.all([
          axios.get(USERS_API, { withCredentials: true }),
          axios.get(QUIZ_API, { withCredentials: true }),
          axios.get(ADMIN_RESULTS_API, { withCredentials: true }),
          axios.get(`${BASE_URL}/admin/submissions`, { withCredentials: true })
        ]);

        const results: Result[] = resultsRes.data;

        // Calculate Stats
        const totalTests = results.length;
        const avgScore = totalTests > 0
          ? results.reduce((acc, curr) => acc + curr.score, 0) / totalTests
          : 0;

        // Prepare Chart Data (Last 30 days)
        const last30Days = [...Array(30)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const activityMap = results.reduce((acc: Record<string, number>, curr) => {
          const date = curr.completedAt.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const chart = last30Days.map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tests: activityMap[date] || 0
        }));

        setStats({
          users: usersRes.data.length,
          quizzes: quizzesRes.data.length,
          submissions: submissionsRes.data.length,
          totalTests,
          avgScore: Math.round(avgScore)
        });

        setRecentActivity(results.slice(0, 5));
        setChartData(chart);

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-white animate-pulse">Loading stats...</div>;

  return (
    <div className="min-h-screen w-full flex flex-row bg-[#23272f] rounded-2xl animate-fade-in-open">
      <main className="flex-1 p-6 md:p-10 flex flex-col gap-8 animate-fade-in-open">
        <h2 className="text-xl font-extrabold text-center text-red-600 mb-8 animate-slideDown-open">Dashboard Overview</h2>
        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-open">
          <Link to="/admin/submissions">
            <KpiCard title="Submissions" value={stats.submissions} icon="edit" color="red" />
          </Link>
          <KpiCard title="Total Users" value={stats.users} icon="users" color="blue" />
          <KpiCard title="Total Quizzes" value={stats.quizzes} icon="book" color="green" />
          <KpiCard title="Tests Taken" value={stats.totalTests} icon="clipboard" color="purple" />
          <KpiCard title="Avg. Score" value={`${stats.avgScore}%`} icon="chart" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-open">
          {/* CHART SECTION */}
          <div className="lg:col-span-2 bg-[#23272f] rounded-xl p-6 border border-[#222] shadow-lg animate-fade-in-open">
            <h3 className="text-xl font-semibold text-white mb-6">Activity Trend (Last 30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Line type="monotone" dataKey="tests" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#23272f] rounded-xl p-6 border border-[#222] shadow-lg overflow-hidden animate-fade-in-open">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="pr-2">
              <table className="w-full text-white text-[0.98rem]">
                <tbody>
                  {recentActivity.map((result) => (
                    <tr key={result._id} className="border-b border-[#23272f] last:border-b-0">
                      <td>
                        <div className="font-semibold">{result.userId?.name || 'Unknown User'}</div>
                        <div className="text-[0.9em] text-[#b3b3b3]">{new Date(result.completedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-[#b3b3b3] text-[0.97em] max-w-[120px] truncate">{result.quizId?.title || 'Unknown Quiz'}</div>
                        <span className={`font-bold text-[0.95em] px-3 py-1 rounded-full ml-2 ${result.score >= 70 ? 'bg-green-200/20 text-green-400' : 'bg-red-400/20 text-red-500'}`}>{Math.round(result.score)}%</span>
                      </td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center text-[#888] italic py-6">No recent activity</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple internal generic component for KPI cards
const KpiCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} backdrop-blur-sm shadow-sm transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gray-800/50`}>
          {/* Simple SVG Icons based on string */}
          {icon === 'users' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          {icon === 'book' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          {icon === 'clipboard' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
          {icon === 'edit' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          {icon === 'chart' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;

