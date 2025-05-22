'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Banknote, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default function PagoMovilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [referencia, setReferencia] = useState('');
  const [monto, setMonto] = useState(''); // Usually pre-filled or calculated

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencia || !monto) {
      toast({ title: "Error", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }
    // Here you would typically send the payment details to your backend for verification.
    // For this demo, we'll simulate success.
    toast({ title: "Pago Enviado", description: "Tu pago está siendo procesado. Recibirás una confirmación pronto." });
    router.push('/profile'); // Redirect to profile or a "thank you" page
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Smartphone className="mr-3 text-primary h-7 w-7" /> Pago Móvil
          </CardTitle>
          <CardDescription>
            Realiza tu pago a la siguiente cuenta y registra la referencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent/20 p-4 rounded-md text-sm">
            <p><strong>Banco:</strong> Mi Banco Ejemplo</p>
            <p><strong>Teléfono:</strong> 0412-1234567</p>
            <p><strong>CI/RIF:</strong> V-12345678</p>
            <p className="mt-2 font-semibold">Por favor, transfiere el monto exacto de tu compra.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="monto">Monto Pagado (Bs.)</Label>
              <Input 
                id="monto" 
                type="number" 
                placeholder="Ej: 150.00" 
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="referencia">Número de Referencia</Label>
              <Input 
                id="referencia" 
                type="text" 
                placeholder="Tu número de referencia del pago" 
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              <Banknote className="mr-2 h-5 w-5" /> Confirmar Pago
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
