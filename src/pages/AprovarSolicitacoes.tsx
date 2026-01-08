import { usePurchaseStore, PurchaseRequest } from '@/store/purchaseStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { toast } from '@/hooks/use-toast';
import { 
  CheckSquare, 
  Check, 
  X, 
  User, 
  Mail, 
  Building2, 
  Package, 
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const AprovarSolicitacoes = () => {
  const { requests, approveRequest, rejectRequest } = usePurchaseStore();
  
  const pendingRequests = requests.filter((r) => r.status === 'PENDENTE');
  const processedRequests = requests.filter((r) => r.status !== 'PENDENTE');

  const handleApprove = (id: string) => {
    approveRequest(id, 'Gerente de Compras');
    toast({
      title: 'Solicitação aprovada!',
      description: 'A Ordem de Compra já pode ser gerada.',
    });
  };

  const handleReject = (id: string) => {
    rejectRequest(id);
    toast({
      title: 'Solicitação reprovada',
      description: 'O solicitante será notificado.',
      variant: 'destructive',
    });
  };

  const RequestCard = ({ request, showActions = false }: { request: PurchaseRequest; showActions?: boolean }) => (
    <Card className="animate-slide-up hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{request.id}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(request.createdAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {request.urgencia && (
              <span className="flex items-center gap-1 px-2 py-1 bg-warning/20 text-warning rounded-full text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                Urgente
              </span>
            )}
            <StatusBadge status={request.status} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Solicitante:</span>
            <span className="font-medium">{request.solicitante}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{request.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Setor:</span>
            <span className="font-medium">{request.setor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Qtd:</span>
            <span className="font-medium">{request.quantidade}x</span>
          </div>
        </div>
        
        <div className="p-3 bg-secondary rounded-lg">
          <p className="text-sm font-medium text-foreground mb-1">{request.produto}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{request.motivo}</p>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="gap-3 pt-0">
          <Button
            onClick={() => handleReject(request.id)}
            variant="outline"
            className="flex-1 gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4" />
            Reprovar
          </Button>
          <Button
            onClick={() => handleApprove(request.id)}
            className="flex-1 gap-2 bg-success hover:bg-success/90"
          >
            <Check className="w-4 h-4" />
            Aprovar
          </Button>
        </CardFooter>
      )}

      {request.status === 'APROVADO' && !request.signature && (
        <CardFooter className="pt-0">
          <Link to={`/ordem/${request.id}`} className="w-full">
            <Button variant="outline" className="w-full gap-2">
              <FileText className="w-4 h-4" />
              Gerar Ordem de Compra
            </Button>
          </Link>
        </CardFooter>
      )}

      {request.signature && (
        <CardFooter className="pt-0">
          <Link to={`/ordem/${request.id}`} className="w-full">
            <Button variant="outline" className="w-full gap-2 border-success/30 text-success">
              <Check className="w-4 h-4" />
              Ver Ordem Assinada
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aprovação de Solicitações</h1>
            <p className="text-muted-foreground">
              {pendingRequests.length} {pendingRequests.length === 1 ? 'solicitação pendente' : 'solicitações pendentes'}
            </p>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma solicitação</h3>
          <p className="text-muted-foreground mb-4">Não há solicitações de compra no momento.</p>
          <Link to="/">
            <Button>Criar Nova Solicitação</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pending rounded-full"></span>
                Aguardando Aprovação
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} showActions />
                ))}
              </div>
            </section>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Histórico</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {processedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default AprovarSolicitacoes;
