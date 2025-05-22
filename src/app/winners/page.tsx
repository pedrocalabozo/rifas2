import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Gift, CalendarCheck2 } from 'lucide-react';

// Mock data - in a real app, this would come from your database
const mockWinners = [
  { id: 1, raffleTitle: "Gran Rifa de Verano", userName: "Ana G.", winningNumber: 123, prize: "Viaje a la Playa", date: "2024-07-15" },
  { id: 2, raffleTitle: "Rifa Tecnológica", userName: "Carlos P.", winningNumber: 456, prize: "Nuevo Smartphone", date: "2024-07-20" },
  { id: 3, raffleTitle: "Rifa Sorpresa", userName: "Laura M.", winningNumber: 789, prize: "Tarjeta de Regalo de $100", date: "2024-07-25" },
];

export default function WinnersPage() {
  // const winners = await getWinnersFromDB(); // Fetch actual winners in a real app

  const winners = mockWinners; // Using mock data for now

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <Trophy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Lista de Ganadores</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ¡Felicidades a nuestros afortunados ganadores!
        </p>
      </div>

      {winners.length > 0 ? (
        <div className="space-y-6">
          {winners.map((winner) => (
            <Card key={winner.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-primary flex items-center">
                  <Gift size={24} className="mr-3"/> {winner.raffleTitle}
                </CardTitle>
                <CardDescription className="flex items-center text-sm pt-1">
                  <CalendarCheck2 size={16} className="mr-2"/> Anunciado el: {new Date(winner.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/20 p-4 rounded-md">
                  <p className="text-lg"><strong className="font-semibold">Ganador/a:</strong> {winner.userName}</p>
                  {winner.winningNumber && <p className="text-md"><strong className="font-semibold">Número Ganador:</strong> {winner.winningNumber}</p>}
                  <p className="text-md"><strong className="font-semibold">Premio:</strong> {winner.prize}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Aún no hay ganadores registrados.</p>
            <p className="text-sm text-muted-foreground">¡Participa en nuestras rifas activas y podrías ser el próximo!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
