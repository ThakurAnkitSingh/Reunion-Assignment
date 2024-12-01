import { useEffect, useState } from "react";
import TaskTable from "./TaskTable";
import TaskForm from "./TaskForm";
import { Button } from "../ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent } from "../ui/select";
import axios from "axios";
import { toast } from "react-toastify";

const TaskList: React.FC = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [tasks, setTasks] = useState<any>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Filter and sorting states
  const [sortBy, setSortBy] = useState("start_time ASC");
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tasks from server with filters and sorting
    const fetchTasks = async () => {
      const response = await axios.get("http://localhost:5000/api/tasks/", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          sortBy,
          priority: priorityFilter,
          status: statusFilter,
        },
      });
      setTasks(response.data);
    };
    fetchTasks();
  }, [isTaskFormOpen, sortBy, priorityFilter, statusFilter]);

  const openAddTaskForm = () => {
    setEditTask(null); // Ensure it's a fresh task
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: any) => {
    setEditTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmit = async (task: any) => {
    let url = "http://localhost:5000/api/tasks";
    if (task?.id) {
      url += `/${task.id}`;
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
      await axios.delete("http://localhost:5000/api/tasks/delete", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { ids: selectedTaskIds }, // Send selected IDs to the backend
      });

      // Remove deleted tasks from the local state
      toast.success("Tasks deleted");
      setTasks((prevTasks: any) =>
        prevTasks.filter((task: any) => !selectedTaskIds.includes(task.id))
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
      setPriorityFilter(value as number | null);
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Task List</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <Button
            onClick={openAddTaskForm}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Add Task
          </Button>
          <Button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete Selected
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex space-x-4">
          <Select
            value={sortBy}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <SelectTrigger className="p-2 border rounded">
              <span>Sort By</span>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="start_time ASC">Start Time: ASC</SelectItem>
              <SelectItem value="start_time DESC">Start Time: DESC</SelectItem>
              <SelectItem value="end_time ASC">End Time: ASC</SelectItem>
              <SelectItem value="end_time DESC">End Time: DESC</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter ?? undefined} // Ensure value is `undefined` for null
            onValueChange={(value) => handleFilterChange("priority", value)}
          >
            <SelectTrigger className="p-2 border rounded">
              <span>Priority</span>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={undefined}>All</SelectItem> {/* Placeholder */}
              {[1, 2, 3, 4, 5].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter ?? undefined} // Ensure value is `undefined` for null
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="p-2 border rounded">
              <span>Status</span>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={undefined}>All</SelectItem> {/* Placeholder */}
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleRemoveFilters}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Remove Filters
          </Button>
        </div>
      </div>

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
    </div>
  );
};

export default TaskList;