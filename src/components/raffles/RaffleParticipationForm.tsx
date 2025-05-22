'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Bitcoin, ShoppingCart, Info, Loader2, ShieldCheck } from 'lucide-react';
import type { ExtendedUser } from '@/types';
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton for loading

interface RaffleParticipationFormProps {
  raffleId: number;
  ticketPrice: number;
  maxNumbersPerPurchase: number;
}

export default function RaffleParticipationForm({ raffleId, ticketPrice, maxNumbersPerPurchase }: RaffleParticipationFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [numTickets, setNumTickets] = useState(1);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(ticketPrice);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const user = session?.user as ExtendedUser | undefined;
  const profileComplete = user?.apellido && user?.telefono && user?.numero_id;

  useEffect(() => {
    setTotalPrice(numTickets * ticketPrice);
  }, [numTickets, ticketPrice]);

  const handleNumTicketsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let count = parseInt(e.target.value, 10);
    if (isNaN(count) || count < 1) {
      count = 1;
    } else if (count > maxNumbersPerPurchase) { 
      count = maxNumbersPerPurchase;
      toast({ title: "Límite alcanzado", description: `Puedes comprar hasta ${maxNumbersPerPurchase} números a la vez.` });
    }
    setNumTickets(count);
    setGeneratedNumbers([]); 
    setSelectedPaymentMethod(null);
  };

  const generateRandomNumbers = () => {
    if (status === 'unauthenticated') {
      toast({ title: 'Acción Requerida', description: 'Por favor, inicia sesión para generar números.', variant: 'destructive' });
      router.push('/'); 
      return;
    }
    if (!profileComplete) {
      toast({ title: 'Perfil Incompleto', description: 'Completa tu perfil para generar números.', variant: 'destructive' });
      router.push('/profile');
      return;
    }

    const numbers = new Set<number>();
    const maxRaffleNumber = 900; 
    while (numbers.size < numTickets) {
      numbers.add(Math.floor(Math.random() * maxRaffleNumber) + 1);
    }
    setGeneratedNumbers(Array.from(numbers).sort((a,b) => a-b));
    setSelectedPaymentMethod(null); 
  };
  
  const handlePaymentSubmit = async (paymentMethod: string) => {
    if (generatedNumbers.length === 0) {
      toast({ title: "Error", description: "Primero genera tus números.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setSelectedPaymentMethod(paymentMethod); 

    try {
      const ticketData = {
        raffleId,
        userId: user?.id_usuario,
        numbers: generatedNumbers,
        quantity: numTickets,
        paymentMethod: paymentMethod,
        totalAmount: totalPrice,
      };

      const response = await fetch(`/api/raffles/participate/${raffleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}.`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            try {
                const textError = await response.text();
                errorMessage = textError || errorMessage;
            } catch (textParseError) {
                // Stick with the initial status code and text.
            }
        }
        throw new Error(errorMessage);
      }
      
      toast({
        title: "Procesando Pago",
        description: `Serás redirigido para completar tu pago con ${paymentMethod}.`,
      });
      router.push(`/payment/${paymentMethod.toLowerCase().replace(/\s+/g, '-')}`);

    } catch (error) {
       let userMessage = 'Ocurrió un error inesperado al procesar tu participación.';
       if (error instanceof Error) {
           userMessage = error.message;
       }
       if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
           userMessage = 'Error de red al enviar tu participación. Verifica tu conexión e inténtalo de nuevo.';
       }
       toast({
        title: "Error de Participación",
        description: userMessage,
        variant: "destructive",
      });
      setIsProcessing(false); 
      setSelectedPaymentMethod(null);
    }
  };


  if (status === 'loading') {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (status === 'unauthenticated') {
    return (
      <Alert variant="default" className="border-primary bg-primary/10">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Inicia Sesión para Participar</AlertTitle>
        <AlertDescription>
          Debes iniciar sesión para poder comprar boletos y participar en esta rifa.
          <Button onClick={() => router.push('/')} className="mt-3 ml-auto block">Iniciar Sesión</Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!profileComplete) {
     return (
      <Alert variant="default" className="border-primary bg-primary/10">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Completa tu Perfil</AlertTitle>
        <AlertDescription>
          Para participar en las rifas, primero debes completar tu información de perfil.
          <Button onClick={() => router.push('/profile')} className="mt-3 ml-auto block">Ir al Perfil</Button>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <Card className="bg-card/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><ShoppingCart size={28} className="mr-3 text-primary"/>Comprar Boletos</CardTitle>
        <CardDescription>Selecciona la cantidad de números, géneralos y elige tu método de pago.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="numTickets" className="text-base font-medium">Cantidad de Números (Max: {maxNumbersPerPurchase})</Label>
          <Input
            id="numTickets"
            type="number"
            value={numTickets}
            onChange={handleNumTicketsChange}
            min="1"
            max={maxNumbersPerPurchase.toString()}
            className="max-w-xs text-base"
            disabled={isProcessing}
          />
        </div>

        <Button onClick={generateRandomNumbers} disabled={isProcessing || !numTickets} className="w-full sm:w-auto text-base py-3 px-6">
          {isProcessing && generatedNumbers.length === 0 && !selectedPaymentMethod ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          Generar Números Aleatorios
        </Button>

        {generatedNumbers.length > 0 && (
          <div className="space-y-3 p-4 border border-dashed rounded-lg bg-background">
            <h3 className="text-lg font-semibold text-primary">Tus Números Generados:</h3>
            <div className="flex flex-wrap gap-2">
              {generatedNumbers.map((num) => (
                <span key={num} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow">
                  {num}
                </span>
              ))}
            </div>
            <p className="font-semibold text-lg mt-3">Total a Pagar: ${totalPrice.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
      
      {generatedNumbers.length > 0 && (
        <CardFooter className="flex-col items-start space-y-4 p-6 border-t">
          <h3 className="text-xl font-semibold mb-2">Selecciona un Método de Pago:</h3>
          <Tabs defaultValue="pago-movil" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="pago-movil" disabled={isProcessing && selectedPaymentMethod !== 'Pago Movil'}><Smartphone className="mr-2" /> Pago Móvil</TabsTrigger>
              <TabsTrigger value="criptomoneda" disabled={isProcessing && selectedPaymentMethod !== 'Criptomoneda'}><Bitcoin className="mr-2" /> Criptomoneda</TabsTrigger>
              <TabsTrigger value="zinli" disabled={isProcessing && selectedPaymentMethod !== 'Zinli'}><CreditCard className="mr-2" /> Zinli</TabsTrigger>
            </TabsList>
            <TabsContent value="pago-movil" className="mt-4">
              <Button onClick={() => handlePaymentSubmit('Pago Movil')} className="w-full text-base py-3" disabled={isProcessing}>
                {isProcessing && selectedPaymentMethod === 'Pago Movil' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Smartphone className="mr-2 h-5 w-5" />}
                Pagar con Pago Móvil
              </Button>
            </TabsContent>
            <TabsContent value="criptomoneda" className="mt-4">
               <Button onClick={() => handlePaymentSubmit('Criptomoneda')} className="w-full text-base py-3" disabled={isProcessing}>
                {isProcessing && selectedPaymentMethod === 'Criptomoneda' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bitcoin className="mr-2 h-5 w-5" />}
                Pagar con Criptomoneda
              </Button>
            </TabsContent>
            <TabsContent value="zinli" className="mt-4">
              <Button onClick={() => handlePaymentSubmit('Zinli')} className="w-full text-base py-3" disabled={isProcessing}>
                {isProcessing && selectedPaymentMethod === 'Zinli' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                Pagar con Zinli
              </Button>
            </TabsContent>
          </Tabs>
        </CardFooter>
      )}
    </Card>
  );
}
