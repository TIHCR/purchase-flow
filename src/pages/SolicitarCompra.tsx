import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { usePurchaseStore } from '@/store/purchaseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Send, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  setor: z.string().min(1, 'Selecione um setor'),
  solicitante: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  urgencia: z.boolean().default(false),
  motivo: z.string().min(10, 'Descreva o motivo com pelo menos 10 caracteres').max(500),
  produto: z.string().min(2, 'Nome do produto é obrigatório').max(200),
  quantidade: z.coerce.number().min(1, 'Quantidade mínima é 1').max(10000),
});

type FormData = z.infer<typeof formSchema>;

const setores = [
  'Administrativo',
  'Comercial',
  'Financeiro',
  'Marketing',
  'Operações',
  'RH',
  'TI',
  'Produção',
  'Logística',
];

const SolicitarCompra = () => {
  const navigate = useNavigate();
  const addRequest = usePurchaseStore((state) => state.addRequest);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      setor: '',
      solicitante: '',
      urgencia: false,
      motivo: '',
      produto: '',
      quantidade: 1,
    },
  });

  const onSubmit = (data: FormData) => {
    addRequest(data);
    toast({
      title: 'Solicitação enviada!',
      description: 'Sua solicitação foi registrada e está aguardando aprovação.',
    });
    form.reset();
    navigate('/aprovar');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nova Solicitação de Compra</h1>
            <p className="text-muted-foreground">Preencha os dados para solicitar uma compra</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados do Solicitante */}
          <div className="form-section animate-slide-up">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Dados do Solicitante</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solicitante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Solicitante</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Setor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {setores.map((setor) => (
                        <SelectItem key={setor} value={setor}>
                          {setor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dados do Produto */}
          <div className="form-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Dados do Produto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="produto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produto / Material</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Notebook Dell Latitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Motivo da Compra</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o motivo e justificativa para esta solicitação..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Seja claro e objetivo na justificativa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Urgência */}
          <div className="form-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FormField
              control={form.control}
              name="urgencia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="w-4 h-4" />
                      Caso de Urgência
                    </FormLabel>
                    <FormDescription>
                      Marque apenas se a compra for realmente urgente. Isso priorizará sua solicitação.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" className="gap-2 px-8">
              <Send className="w-4 h-4" />
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SolicitarCompra;
