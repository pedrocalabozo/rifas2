import type { User as NextAuthUser } from 'next-auth';

// ExtendedUser interface for use within the application, mirroring next-auth session user
export interface ExtendedUser extends NextAuthUser {
  id_usuario?: number;
  google_id?: string; // This might be session.user.id from next-auth
  apellido?: string | null;
  telefono?: string | null;
  numero_id?: string | null;
}

export interface Raffle {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string; // for AI image search
  ticketPrice: number;
  maxNumbers?: number; // e.g., up to 900
  status: 'activa' | 'finalizada' | 'cancelada';
  endDate?: string; // Optional: ISO date string
}

export interface Ticket {
  id: number;
  raffleId: number;
  userId: number;
  numbers: number[];
  quantity: number;
  paymentMethod: 'pago_movil' | 'criptomoneda' | 'zinly';
  paymentStatus: 'pendiente' | 'pagado' | 'fallido';
  purchaseDate: string; // ISO date string
}

export interface Winner {
  id: number;
  raffleId: number;
  userId: number;
  ticketId: number;
  winningNumber?: number;
  prizeDescription?: string;
  announcementDate: string; // ISO date string
}

// Helper type for profile form values
export type ProfileFormData = {
  nombre?: string;
  apellido: string;
  telefono: string;
  numero_id: string;
  email?: string;
};
