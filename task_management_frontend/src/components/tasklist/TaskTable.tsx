import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";

const TaskTable: React.FC<{
  onEdit: (task: any) => void;
  tasks: any[];
  selectedTasks: Set<string>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Set<string>>>;
}> = ({ onEdit, tasks, selectedTasks, setSelectedTasks }) => {

  const formatDate = (dateTime: string) =>
    new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
    });

  const calculateTotalTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end.getTime() - start.getTime();
    return (diffInMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
  };

  const handleCheckboxChange = (taskId: string) => {
    const newSelectedTasks = new Set(selectedTasks);
    if (newSelectedTasks.has(taskId)) {
      newSelectedTasks.delete(taskId); // Deselect task
    } else {
      newSelectedTasks.add(taskId); // Select task
    }
    setSelectedTasks(newSelectedTasks);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="p-2 text-center">Select</TableHead>
          <TableHead className="p-2">Task ID</TableHead>
          <TableHead className="p-2">Title</TableHead>
          <TableHead className="p-2 text-center">Priority</TableHead>
          <TableHead className="p-2 text-center">Status</TableHead>
          <TableHead className="p-2 text-center">Start Time</TableHead>
          <TableHead className="p-2 text-center">End Time</TableHead>
          <TableHead className="p-2 text-center">Total Time (hrs)</TableHead>
          <TableHead className="p-2 text-center">Edit</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task?.id} className="hover:bg-gray-100">
            <TableCell className="p-2 text-center">
              <Checkbox
                checked={selectedTasks.has(task?.id)}
                onClick={() => handleCheckboxChange(task?.id)}
              />
            </TableCell>
            <TableCell className="p-2 text-center">{task.id}</TableCell>
            <TableCell className="p-2">{task?.title}</TableCell>
            <TableCell className="p-2 text-center">{task?.priority}</TableCell>
            <TableCell
              className={`p-2 text-center ${
                task?.status === "Finished"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {task?.status}
            </TableCell>
            <TableCell className="p-2 text-center">
              {formatDate(task?.start_time)}
            </TableCell>
            <TableCell className="p-2 text-center">
              {formatDate(task?.end_time)}
            </TableCell>
            <TableCell className="p-2 text-center">
              {calculateTotalTime(task?.start_time, task?.end_time)}
            </TableCell>
            <TableCell className="p-2 text-center">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;