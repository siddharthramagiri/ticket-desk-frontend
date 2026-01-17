import { getStatusIcon } from "@/styles";
import { Status } from "@/types";

const StatusIcon = ({ status, className } : { status: Status, className?: string }) => {
  const Icon = getStatusIcon(status);
  
  return <Icon className={className}/>
} 

export default StatusIcon;