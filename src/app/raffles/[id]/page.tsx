import Image from 'next/image';
import { notFound } from 'next/navigation';
import RaffleParticipationForm from '@/components/raffles/RaffleParticipationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { query } from '@/lib/db';
import type { Raffle } from '@/types';
import { Tag, CalendarDays, Info } from 'lucide-react';

async function getRaffleDetails(id: string): Promise<Raffle | null> {
  try {
    const raffleId = parseInt(id, 10);
    if (isNaN(raffleId)) return null;

    const rafflesData = await query("SELECT id_rifa, titulo, descripcion, foto_url, data_ai_hint, precio_boleto, estado, fecha_fin, max_numeros FROM Rifas WHERE id_rifa = ?", [raffleId]) as any[];
    
    if (rafflesData.length === 0) {
      return null;
    }
    const raffle = rafflesData[0];
    return {
      id: raffle.id_rifa,
      title: raffle.titulo,
      description: raffle.descripcion,
      imageUrl: raffle.foto_url, // This can be null or empty string
      imageHint: raffle.data_ai_hint,
      ticketPrice: parseFloat(raffle.precio_boleto),
      status: raffle.estado,
      endDate: raffle.fecha_fin ? new Date(raffle.fecha_fin).toLocaleDateString() : undefined,
      maxNumbers: raffle.max_numeros,
    };
  } catch (error) {
    console.error(`Failed to fetch raffle ${id}:`, error);
    return null;
  }
}

const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/800x400.png';
const PLACEHOLDER_AI_HINT = "prize giveaway";

export default async function RafflePage({ params }: { params: { id: string } }) {
  const raffle = await getRaffleDetails(params.id);

  if (!raffle) {
    notFound();
  }

  const imageUrl = raffle.imageUrl || PLACEHOLDER_IMAGE_URL;
  const imageHint = raffle.imageUrl ? (raffle.imageHint || PLACEHOLDER_AI_HINT) : PLACEHOLDER_AI_HINT;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0">
          <Image
            src={imageUrl}
            alt={raffle.title}
            width={800}
            height={400}
            className="w-full object-cover aspect-[2/1]"
            data-ai-hint={imageHint}
            priority // Prioritize loading of main raffle image
          />
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary mb-3">{raffle.title}</CardTitle>
          <CardDescription className="text-lg text-foreground/80 mb-6">{raffle.description}</CardDescription>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-center bg-accent/20 p-3 rounded-md">
              <Tag size={20} className="text-primary mr-3 shrink-0" />
              <div>
                <span className="font-semibold">Precio del Boleto:</span> ${raffle.ticketPrice.toFixed(2)}
              </div>
            </div>
            {raffle.endDate && (
              <div className="flex items-center bg-accent/20 p-3 rounded-md">
                <CalendarDays size={20} className="text-primary mr-3 shrink-0" />
                <div>
                  <span className="font-semibold">Fecha de Cierre:</span> {raffle.endDate}
                </div>
              </div>
            )}
            <div className="flex items-center bg-accent/20 p-3 rounded-md sm:col-span-2">
              <Info size={20} className="text-primary mr-3 shrink-0" />
              <div>
                 <span className="font-semibold">Números disponibles:</span> Hasta {raffle.maxNumbers || 900} por compra.
              </div>
            </div>
          </div>

          <RaffleParticipationForm raffleId={raffle.id} ticketPrice={raffle.ticketPrice} maxNumbersPerPurchase={raffle.maxNumbers || 900} />
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const rafflesData = await query("SELECT id_rifa FROM Rifas WHERE estado = 'activa'") as any[];
    return rafflesData.map((raffle) => ({
      id: raffle.id_rifa.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for raffles during build:", error);
    return []; // Return empty array on error to allow build to succeed
  }
}

export const dynamic = 'auto'; // Changed from 'force-static'
export const revalidate = 3600; // Revalidate raffle details every hour
