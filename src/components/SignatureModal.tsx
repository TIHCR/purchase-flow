import { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eraser, Check, X, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signature: string) => void;
}

const SignatureModal = ({ isOpen, onClose, onConfirm }: SignatureModalProps) => {
  const sigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (isOpen && sigRef.current) {
      sigRef.current.clear();
    }
  }, [isOpen]);

  const handleClear = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
  };

  const handleConfirm = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const signatureData = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      onConfirm(signatureData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PenTool className="w-5 h-5 text-primary" />
            Assinatura Digital
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Desenhe sua assinatura no campo abaixo usando o mouse ou toque na tela.
          </p>
          
          <div className="border-2 border-dashed border-border rounded-lg bg-card overflow-hidden">
            <SignatureCanvas
              ref={sigRef}
              penColor="#1e40af"
              canvasProps={{
                width: 550,
                height: 200,
                className: 'w-full touch-none',
                style: { 
                  width: '100%', 
                  height: '200px',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem'
                }
              }}
            />
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Ao assinar, você confirma a aprovação desta Ordem de Compra
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="gap-2"
          >
            <Eraser className="w-4 h-4" />
            Limpar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Confirmar Assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
