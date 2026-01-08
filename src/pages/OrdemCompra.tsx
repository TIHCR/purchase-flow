import { useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { usePurchaseStore } from '@/store/purchaseStore';
import { Button } from '@/components/ui/button';
import SignatureModal from '@/components/SignatureModal';
import StatusBadge from '@/components/StatusBadge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ArrowLeft, 
  PenTool, 
  FileDown, 
  Building2, 
  User,
  Mail,
  Package,
  Calendar,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const OrdemCompra = () => {
  const { id } = useParams<{ id: string }>();
  const { getRequestById, signRequest } = usePurchaseStore();
  const [showSignature, setShowSignature] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const request = getRequestById(id || '');

  if (!request) {
    return <Navigate to="/aprovar" replace />;
  }

  if (request.status !== 'APROVADO') {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Solicitação não aprovada</h2>
        <p className="text-muted-foreground mb-4">
          Esta solicitação precisa ser aprovada antes de gerar a Ordem de Compra.
        </p>
        <Link to="/aprovar">
          <Button>Ver Solicitações</Button>
        </Link>
      </div>
    );
  }

  const handleSignature = (signature: string) => {
    signRequest(request.id, signature);
    toast({
      title: 'Ordem de Compra assinada!',
      description: 'Agora você pode gerar o PDF.',
    });
  };

  const handleGeneratePdf = async () => {
    if (!request.signature) {
      toast({
        title: 'Assinatura necessária',
        description: 'Assine a Ordem de Compra antes de gerar o PDF.',
        variant: 'destructive',
      });
      return;
    }

    if (!documentRef.current) return;

    setIsGeneratingPdf(true);

    try {
      // Temporarily add class for PDF generation with solid colors
      documentRef.current.classList.add('pdf-mode');
      
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      // Remove class after capture
      documentRef.current.classList.remove('pdf-mode');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`ordem-compra-${request.id}.pdf`);

      toast({
        title: 'PDF gerado com sucesso!',
        description: `Arquivo: ordem-compra-${request.id}.pdf`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/aprovar">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        
        <div className="flex gap-3">
          {!request.signature ? (
            <Button onClick={() => setShowSignature(true)} className="gap-2">
              <PenTool className="w-4 h-4" />
              Assinar Ordem
            </Button>
          ) : (
            <Button 
              onClick={handleGeneratePdf} 
              className="gap-2"
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {isGeneratingPdf ? 'Gerando...' : 'Gerar PDF'}
            </Button>
          )}
        </div>
      </div>

      {/* Document */}
      <div 
        ref={documentRef}
        className="bg-white rounded-xl shadow-lg border border-border p-8 animate-slide-up print-document"
      >
        {/* Header */}
        <div className="document-header text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ORDEM DE COMPRA</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão de Compras</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium">{request.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(new Date(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Solicitante Info */}
        <div className="document-section">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Dados do Solicitante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nome:</span>
              <p className="font-medium">{request.solicitante}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{request.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Setor:</span>
              <p className="font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {request.setor}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Data da Solicitação:</span>
              <p className="font-medium">
                {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="document-section">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Dados do Produto
          </h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Produto/Material:</span>
                <p className="font-medium text-lg">{request.produto}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Quantidade:</span>
                <p className="font-medium text-lg">{request.quantidade} unidade(s)</p>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Motivo/Justificativa:</span>
              <p className="font-medium bg-secondary p-3 rounded-lg mt-1">{request.motivo}</p>
            </div>
          </div>
        </div>

        {/* Approval Info */}
        <div className="document-section">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Aprovação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Aprovado por:</span>
              <p className="font-medium">{request.approvedBy || 'Gerente de Compras'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Data de Aprovação:</span>
              <p className="font-medium">
                {request.approvedAt 
                  ? format(new Date(request.approvedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                  : '-'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="document-section">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-primary" />
            Assinatura Digital
          </h2>
          
          {request.signature ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-secondary/50 flex justify-center">
                <img 
                  src={request.signature} 
                  alt="Assinatura" 
                  className="max-h-24 object-contain"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Assinado em: {request.signedAt 
                    ? format(new Date(request.signedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : '-'
                  }
                </span>
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  Documento assinado digitalmente
                </span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-secondary/30">
              <PenTool className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aguardando assinatura</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => setShowSignature(true)}
              >
                Assinar Agora
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>Este documento foi gerado eletronicamente pelo Sistema de Gestão de Compras.</p>
          <p className="mt-1">
            Gerado em: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      <SignatureModal
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        onConfirm={handleSignature}
      />
    </div>
  );
};

export default OrdemCompra;
