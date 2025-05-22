import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import type { ExtendedUser } from '@/types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  const user = session.user as ExtendedUser;
  if (!user.id_usuario || !user.apellido || !user.telefono || !user.numero_id) {
    return NextResponse.json({ message: 'Perfil incompleto. Por favor, completa tu perfil para participar.' }, { status: 403 });
  }

  const raffleId = parseInt(params.id, 10);
  if (isNaN(raffleId)) {
    return NextResponse.json({ message: 'ID de rifa inválido.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { numbers, quantity, paymentMethod, totalAmount } = body;

    if (!Array.isArray(numbers) || numbers.length === 0 || numbers.length !== quantity) {
      return NextResponse.json({ message: 'Números comprados inválidos o no coinciden con la cantidad.' }, { status: 400 });
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ message: 'Cantidad de boletos inválida.' }, { status: 400 });
    }
    if (!['Pago Movil', 'Criptomoneda', 'Zinli'].includes(paymentMethod)) {
      return NextResponse.json({ message: 'Método de pago inválido.' }, { status: 400 });
    }
    // Optional: Validate totalAmount against quantity and ticketPrice from DB

    // Check if raffle exists and is active
    const raffleDetails = await query('SELECT estado, precio_boleto FROM Rifas WHERE id_rifa = ?', [raffleId]);
    if (raffleDetails.length === 0) {
        return NextResponse.json({ message: 'La rifa no existe.' }, { status: 404 });
    }
    if (raffleDetails[0].estado !== 'activa') {
        return NextResponse.json({ message: 'Esta rifa ya no está activa.' }, { status: 400 });
    }
    // Optional: Server-side price check
    // const expectedTotal = quantity * parseFloat(raffleDetails[0].precio_boleto);
    // if (Math.abs(expectedTotal - totalAmount) > 0.01) { // Check with a small tolerance for floating point issues
    //    return NextResponse.json({ message: 'El monto total no coincide con el precio de los boletos.' }, { status: 400 });
    // }


    // Insert into Boletos table
    // The numeros_comprados should be stored as a JSON string
    const numerosJson = JSON.stringify(numbers);
    
    await query(
      'INSERT INTO Boletos (id_rifa, id_usuario, numeros_comprados, cantidad_numeros, metodo_pago, estado_pago) VALUES (?, ?, ?, ?, ?, ?)',
      [raffleId, user.id_usuario, numerosJson, quantity, paymentMethod, 'pendiente'] // Initial state is pending
    );

    // The response here might differ based on actual payment flow.
    // For now, just a success message. Client will redirect to payment page.
    return NextResponse.json({ message: 'Solicitud de participación recibida. Redirigiendo al pago...' });

  } catch (error) {
    console.error('Error al procesar participación en rifa:', error);
    return NextResponse.json({ message: 'Error interno del servidor al procesar la participación.' }, { status: 500 });
  }
}
