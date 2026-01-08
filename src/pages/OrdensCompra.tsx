import { usePurchaseStore } from '@/store/purchaseStore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ClipboardList, 
  FileText, 
  Calendar, 
  User, 
  Package, 
  CheckCircle2,
  PenTool,
  FileDown
} from 'lucide-react';

const OrdensCompra = () => {
  const { requests } = usePurchaseStore();
  const approvedRequests = requests.filter((r) => r.status === 'APROVADO');

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ordens de Compra</h1>
            <p className="text-muted-foreground">
              {approvedRequests.length} {approvedRequests.length === 1 ? 'ordem aprovada' : 'ordens aprovadas'}
            </p>
          </div>
        </div>
      </div>

      {approvedRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma ordem de compra</h3>
          <p className="text-muted-foreground mb-4">
            Aprove uma solicitação para gerar uma ordem de compra.
          </p>
          <Link to="/aprovar">
            <Button>Ver Solicitações</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedRequests.map((request) => (
            <Card key={request.id} className="animate-slide-up hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{request.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{request.solicitante}</span>
                </div>
                
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{request.produto}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quantidade: {request.quantidade}
                  </p>
                </div>

                {request.signature ? (
                  <div className="flex items-center gap-2 text-sm text-success bg-success/10 rounded-lg p-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assinado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-2">
                    <PenTool className="w-4 h-4" />
                    <span>Aguardando assinatura</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                <Link to={`/ordem/${request.id}`} className="w-full">
                  <Button 
                    variant={request.signature ? 'default' : 'outline'} 
                    className="w-full gap-2"
                  >
                    {request.signature ? (
                      <>
                        <FileDown className="w-4 h-4" />
                        Visualizar / PDF
                      </>
                    ) : (
                      <>
                        <PenTool className="w-4 h-4" />
                        Assinar Ordem
                      </>
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdensCompra;
