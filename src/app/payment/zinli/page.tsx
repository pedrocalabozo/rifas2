'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const zinliEmail = "usuario.rifafacil@zinli.com"; // Example Zinli email

export default function ZinliPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [referencia, setReferencia] = useState('');
  const [monto, setMonto] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(zinliEmail);
    toast({ title: "Email Copiado", description: "El email de Zinli ha sido copiado." });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencia || !monto) {
      toast({ title: "Error", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }
    toast({ title: "Pago Enviado", description: "Tu pago con Zinli está siendo procesado." });
    router.push('/profile');
  };

  return (
    <div className="max-w-md mx-auto">
       <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CreditCard className="mr-3 text-primary h-7 w-7" /> Pago con Zinli
          </CardTitle>
          <CardDescription>
            Envía el pago al siguiente email de Zinli y registra la referencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent/20 p-4 rounded-md space-y-2">
            <p className="font-semibold">Email de Zinli para el pago:</p>
            <div className="flex items-center gap-2 bg-background p-2 rounded">
              <code className="text-sm break-all flex-grow">{zinliEmail}</code>
              <Button size="icon" variant="ghost" onClick={handleCopyEmail} title="Copiar email">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
             <p className="mt-2 font-semibold">Por favor, transfiere el monto exacto de tu compra.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="monto">Monto Pagado (USD)</Label>
              <Input 
                id="monto" 
                type="number" 
                step="any"
                placeholder="Ej: 10.00" 
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="referencia">Referencia de Zinli o Nota</Label>
              <Input 
                id="referencia" 
                type="text" 
                placeholder="ID de transacción o tu nombre de usuario Zinli"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                required  
              />
            </div>
            <Button type="submit" className="w-full">
              <DollarSign className="mr-2 h-5 w-5" /> Confirmar Pago Zinli
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
