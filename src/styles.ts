import { Status } from "@/types";



export const PriorityStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
};




export const getStatusColor = (status: Status) => {
  const colors = {
    'OPEN': 'bg-red-100 text-red-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-purple-100 text-purple-800'
  };
  return colors[status] || colors.OPEN;
};



import {
  GoIssueOpened,
  GoGitMerge,
  GoClock,
  GoGitPullRequestClosed,
  GoDot
} from "react-icons/go"
export const getStatusIcon = (status: Status) => {
  return {
    OPEN: GoIssueOpened,
    IN_PROGRESS: GoClock,
    RESOLVED: GoGitMerge,
    CLOSED: GoGitPullRequestClosed,
  }[status] || GoDot
}