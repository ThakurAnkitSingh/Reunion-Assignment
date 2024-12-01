import { useState } from "react";
import { Input } from "../ui/input";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "react-toastify";
import { Task } from '@/types/task';

const formatDateTime = (dateTime: string) => {
    return dateTime ? dateTime.split('T')[0] + 'T' + dateTime.split('T')[1].slice(0, 5) : '';
  };
  
  const TaskForm: React.FC<{
    mode: "Add" | "Edit";
    task?: Task;
    onClose: () => void;
    onSubmit: (task: Task) => void;
  }> = ({ mode, task, onClose, onSubmit }) => {
    const [title, setTitle] = useState(task?.title || "");
    const [priority, setPriority] = useState(task?.priority || 1);
    const [status, setStatus] = useState(task?.status || "pending");
    const [start_time, setStartTime] = useState(formatDateTime(task?.start_time || ""));
    const [end_time, setEndTime] = useState(formatDateTime(task?.end_time || ""));
  
    const handleSubmit = () => {
      if (!title.trim()) {
        toast.error("Task title is required.");
        return;
      }
      if (priority < 1 || priority > 5) {
        toast.error("Priority must be between 1 and 5.");
        return;
      }
      if (!start_time || !end_time) {
        toast.error("Start and end times are required.");
        return;
      }
      if (new Date(start_time) > new Date(end_time)) {
        toast.error("End time must be after the start time.");
        return;
      }
  
      const taskData = {
        id: task?.id, // Include ID only for editing
        title,
        priority,
        status,
        start_time,
        end_time,
      };
  
      onSubmit(taskData); // Close the form modal
      onClose(); // Close the form modal
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-[90%] max-w-md bg-white rounded-lg shadow-lg">
          <CardHeader className="p-4 text-xl font-semibold text-center border-b border-gray-200">
            {mode === "Add" ? "Add New Task" : "Edit Task"}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority (1-5)
            </label>
            <Input
              id="priority"
              type="number"
              min={1}
              max={5}
              value={priority}
              onChange={(e) => setPriority(+e.target.value)}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue defaultValue={status} placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <Input
                id="start-time"
                type="datetime-local"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <Input
                id="end-time"
                type="datetime-local"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1"
              />
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {mode === "Add" ? "Add Task" : "Update Task"}
            </Button>
            <Button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default TaskForm;  