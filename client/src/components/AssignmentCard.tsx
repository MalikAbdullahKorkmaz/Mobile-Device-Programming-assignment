import { Assignment } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange?: (id: number, status: string) => void;
}

export default function AssignmentCard({ assignment, onStatusChange }: AssignmentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== "completed";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.subject}</p>
          </div>
          <div className="flex gap-2">
            {getStatusIcon(assignment.status)}
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {assignment.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getPriorityColor(assignment.priority)}>
            {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
          </Badge>
          <Badge variant="outline" className={isOverdue ? "border-red-500 text-red-500" : ""}>
            <Clock className="w-3 h-3 mr-1" />
            {format(new Date(assignment.dueDate), "MMM d, yyyy")}
          </Badge>
          {assignment.estimatedHours && (
            <Badge variant="outline">
              ~{assignment.estimatedHours}h
            </Badge>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            className={
              assignment.status === "completed"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : assignment.status === "in_progress"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : isOverdue
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }
          >
            {assignment.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        {/* Actions */}
        {assignment.status !== "completed" && onStatusChange && (
          <div className="flex gap-2 pt-2">
            {assignment.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(assignment.id, "in_progress")}
                className="flex-1"
              >
                Start
              </Button>
            )}
            {assignment.status === "in_progress" && (
              <Button
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => onStatusChange(assignment.id, "completed")}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
