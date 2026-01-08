import { RequestStatus } from '@/store/purchaseStore';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig = {
  PENDENTE: {
    label: 'Pendente',
    className: 'status-badge status-pending',
    icon: Clock,
  },
  APROVADO: {
    label: 'Aprovado',
    className: 'status-badge status-approved',
    icon: CheckCircle2,
  },
  REPROVADO: {
    label: 'Reprovado',
    className: 'status-badge status-rejected',
    icon: XCircle,
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
