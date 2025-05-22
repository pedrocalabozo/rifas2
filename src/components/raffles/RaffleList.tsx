import type { Raffle } from '@/types';
import RaffleCard from './RaffleCard';

interface RaffleListProps {
  raffles: Raffle[];
}

export default function RaffleList({ raffles }: RaffleListProps) {
  if (!raffles || raffles.length === 0) {
    return <p className="text-center text-muted-foreground text-lg py-10">No hay rifas disponibles en este momento.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-8">
      {raffles.map((raffle) => (
        <RaffleCard key={raffle.id} raffle={raffle} />
      ))}
    </div>
  );
}
