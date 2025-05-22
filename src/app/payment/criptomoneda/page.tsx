'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bitcoin, Copy, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

const cryptoAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"; // Example BTC address

export default function CriptomonedaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState('');
  const [amountSent, setAmountSent] = useState(''); // User confirms amount in crypto

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cryptoAddress);
      toast({ title: "Dirección Copiada", description: "La dirección de pago ha sido copiada al portapapeles." });
    } else {
      toast({ title: "Error", description: "No se pudo copiar al portapapeles.", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash || !amountSent) {
      toast({ title: "Error", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }
    toast({ title: "Transacción Enviada", description: "Tu transacción está siendo verificada en la red. Esto puede tardar unos minutos." });
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
            <Bitcoin className="mr-3 text-primary h-7 w-7" /> Pago con Criptomoneda (USDT - TRC20)
          </CardTitle>
          <CardDescription>
            Envía el monto exacto en USDT (Red TRC20) a la siguiente dirección y registra el Hash de la transacción.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent/20 p-4 rounded-md space-y-2">
            <p className="font-semibold">Dirección de Pago (USDT - TRC20):</p>
            <div className="flex items-center gap-2 bg-background p-2 rounded">
              <code className="text-sm break-all flex-grow">{cryptoAddress}</code>
              <Button size="icon" variant="ghost" onClick={handleCopyAddress} title="Copiar dirección">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-destructive">Asegúrate de enviar USDT a través de la red TRC20. Envíos a otras redes o de otras monedas podrían perderse.</p>
            <p className="mt-2 font-semibold">Por favor, transfiere el monto exacto de tu compra.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
              <Label htmlFor="amountSent">Monto Enviado (USDT)</Label>
              <Input 
                id="amountSent" 
                type="number" 
                step="any"
                placeholder="Ej: 10.00" 
                value={amountSent}
                onChange={(e) => setAmountSent(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="txHash">Hash de la Transacción (TxID)</Label>
              <Input 
                id="txHash" 
                type="text" 
                placeholder="El hash de tu transacción en la blockchain" 
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-5 w-5" /> Confirmar Transacción
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
