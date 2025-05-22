import RaffleList from '@/components/raffles/RaffleList';
import { query } from '@/lib/db';
import type { Raffle } from '@/types';

async function getRaffles(): Promise<Raffle[]> {
  // In a real app, this would fetch from your database via an API route or server action
  // For now, using the mock DB query
  try {
    const rafflesData = await query("SELECT id_rifa, titulo, descripcion, foto_url, data_ai_hint, precio_boleto, estado FROM Rifas WHERE estado = 'activa'") as any[];
    return rafflesData.map(raffle => ({
      id: raffle.id_rifa,
      title: raffle.titulo,
      description: raffle.descripcion,
      imageUrl: raffle.foto_url,
      imageHint: raffle.data_ai_hint,
      ticketPrice: parseFloat(raffle.precio_boleto),
      status: raffle.estado,
    }));
  } catch (error) {
    console.error("Failed to fetch raffles:", error);
    return [];
  }
}

export default async function HomePage() {
  const raffles = await getRaffles();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary tracking-tight">Bienvenido a Rifa Facil</h1>
      <p className="text-xl text-center text-foreground/80">
        ¡Explora nuestras rifas activas y participa para ganar premios increíbles!
      </p>
      
      {raffles.length > 0 ? (
        <RaffleList raffles={raffles} />
      ) : (
        <p className="text-center text-lg text-muted-foreground">No hay rifas activas en este momento. ¡Vuelve pronto!</p>
      )}
    </div>
  );
}
