import { useEffect, useState } from "react";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import { Button } from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Task } from "@/types/task";
import api from "@/helper/api";

const TaskList: React.FC = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Filter and sorting states
  const [sortBy, setSortBy] = useState("start_time ASC");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tasks from server with filters and sorting
    const fetchTasks = async () => {
      const response = await axios.get(`${api}/tasks/`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          sortBy,
          priority: priorityFilter,
          status: statusFilter,
        },
      });
      setTasks(response?.data);
    };
    fetchTasks();
  }, [isTaskFormOpen, sortBy, priorityFilter, statusFilter]);

  const openAddTaskForm = () => {
    setEditTask(undefined);
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmit = async (task: Task) => {
    let url = `${api}/tasks`;
    if (task?.id) {
      url += `/${task?.id}`;
    }
    await axios.post(url, task, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Task submitted");
    setIsTaskFormOpen(false);
  };

  const handleDeleteSelected = async () => {
    const selectedTaskIds = Array.from(selectedTasks);
    if (selectedTaskIds?.length === 0) {
      toast.info("No tasks selected for deletion");
      return;
    }

    try {
      await axios.delete(`${api}/tasks/delete`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { ids: selectedTaskIds },
      });

      // Remove deleted tasks from the local state
      toast.success("Tasks deleted");
      setTasks((prevTasks: Task[]) =>
        prevTasks.filter((task: Task) => task?.id && !selectedTaskIds.includes(task?.id))
      );
      setSelectedTasks(new Set()); // Reset the selected tasks
    } catch (error) {
      console.error("Error deleting tasks", error);
      toast.error("Failed to delete selected tasks");
    }
  };

  const handleFilterChange = (
    filterType: "sort" | "priority" | "status",
    value: string | number | null
  ) => {
    if (filterType === "sort") {
      setSortBy(value as string);
    } else if (filterType === "priority") {
      setPriorityFilter(value as string | null);
    } else if (filterType === "status") {
      setStatusFilter(value as string | null);
    }
  };

  const handleRemoveFilters = () => {
    setSortBy("start_time ASC");
    setPriorityFilter(null);
    setStatusFilter(null);
  };

  return (
    <Box p={2}>
      <h1 className="text-2xl font-semibold mb-4">Task List</h1>

      {/* Actions Section */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Button
            onClick={openAddTaskForm}
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
          >
            Add Task
          </Button>
          <Button
            onClick={handleDeleteSelected}
            variant="contained"
            color="secondary"
          >
            Delete Selected
          </Button>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e: SelectChangeEvent) =>
                    handleFilterChange("sort", e.target.value)
                  }
                >
                  <MenuItem value="start_time ASC">Start Time: ASC</MenuItem>
                  <MenuItem value="start_time DESC">Start Time: DESC</MenuItem>
                  <MenuItem value="end_time ASC">End Time: ASC</MenuItem>
                  <MenuItem value="end_time DESC">End Time: DESC</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter ?? ""}
                  onChange={(e: SelectChangeEvent) =>
                    handleFilterChange("priority", e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {[1, 2, 3, 4, 5].map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter ?? ""}
                  onChange={(e: SelectChangeEvent) =>
                    handleFilterChange("status", e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={handleRemoveFilters}
                variant="outlined"
                color="inherit"
                fullWidth
              >
                Remove Filters
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TaskTable
        onEdit={openEditTaskForm}
        tasks={tasks}
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
      />

      {isTaskFormOpen && (
        <TaskForm
          mode={editTask ? "Edit" : "Add"}
          task={editTask}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
};

export default TaskList;