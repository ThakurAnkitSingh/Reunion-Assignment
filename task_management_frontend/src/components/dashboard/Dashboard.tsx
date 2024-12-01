import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import axios from "axios";
import api from "@/helper/api";

interface PriorityStat {
  priority: number;
  pendingTasks: number;
  timeLapsed: string | null;
  timeRemaining: string | null;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageCompletionTime: number;
  pendingTaskSummary: {
    totalLapsedTime: number;
    totalRemainingTime: number;
  };
  priorityStats: PriorityStat[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${api}/tasks/dashboard/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response?.data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Unable to load dashboard statistics. Please try again later.");
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center">Loading...</div>;
  }

  const completedPercentage = ((stats?.completedTasks / stats?.totalTasks) * 100).toFixed(2) || "0";
  const pendingPercentage = ((stats?.pendingTasks / stats?.totalTasks) * 100).toFixed(2) || "0";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Summary Section - All cards on the same line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-500">{stats?.totalTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-500">{completedPercentage}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">{pendingPercentage}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{stats?.averageCompletionTime} hrs</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Task Summary Section - All cards on the same line */}
      <h2 className="text-lg font-semibold mb-4">Pending Task Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">{stats?.pendingTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Time Lapsed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-500">
              {stats?.pendingTaskSummary?.totalLapsedTime || 0} hrs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Time Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-500">
              {stats?.pendingTaskSummary?.totalRemainingTime || 0} hrs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section for Pending Tasks by Priority */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Pending Tasks</TableHead>
              <TableHead>Time Lapsed (hrs)</TableHead>
              <TableHead>Time to Finish (hrs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats?.priorityStats.map((priorityStat, index) => (
              <TableRow key={index}>
                <TableCell>{priorityStat?.priority}</TableCell>
                <TableCell>{priorityStat?.pendingTasks}</TableCell>
                <TableCell>{priorityStat?.timeLapsed || 0}</TableCell>
                <TableCell>{priorityStat?.timeRemaining || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
