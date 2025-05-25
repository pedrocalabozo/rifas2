
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Raffle } from '@/types';
import { Ticket, Tag } from 'lucide-react';

interface RaffleCardProps {
  raffle: Raffle;
}

const CARD_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x300.png';
const CARD_PLACEHOLDER_AI_HINT = "raffle prize";

export default function RaffleCard({ raffle }: RaffleCardProps) {
  let displayImageUrl = CARD_PLACEHOLDER_IMAGE_URL;
  let displayImageHint = CARD_PLACEHOLDER_AI_HINT;

  if (raffle.imageUrl) {
    try {
      // Check if it's an absolute URL and parsable
      const parsedUrl = new URL(raffle.imageUrl);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        displayImageUrl = raffle.imageUrl;
        displayImageHint = raffle.imageHint || CARD_PLACEHOLDER_AI_HINT; // Use raffle's hint if its image is used
      }
    } catch (e) {
      // raffle.imageUrl is not a valid absolute URL, stick to placeholder
      console.warn(`Invalid raffle image URL in RaffleCard: "${raffle.imageUrl}". Using placeholder.`);
    }
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative">
        <Image
          src={displayImageUrl}
          alt={raffle.title}
          width={600}
          height={300} // Adjusted height for better aspect ratio
          className="object-cover w-full h-48" // Ensure image covers area
          data-ai-hint={displayImageHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {raffle.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {raffle.description}
        </CardDescription>
        <div className="flex items-center text-primary font-semibold">
          <Tag size={18} className="mr-2" />
          <span>Precio del Boleto: ${raffle.ticketPrice.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-muted/30">
        <Button asChild className="w-full" variant="default">
          <Link href={`/raffles/${raffle.id}`}>
            <Ticket size={18} className="mr-2" />
            Participar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
