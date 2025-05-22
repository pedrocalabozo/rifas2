import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db'; // Conceptual database query function
import type { ExtendedUser } from '@/types';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }
  
  const user = session.user as ExtendedUser; // Cast to your extended user type
  const { id_usuario } = user;

  if (!id_usuario) {
     return NextResponse.json({ message: 'ID de usuario no encontrado en la sesión.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { apellido, telefono, numero_id } = body;

    // Basic validation
    if (!apellido || !telefono || !numero_id) {
      return NextResponse.json({ message: 'Apellido, teléfono y número de ID son requeridos.' }, { status: 400 });
    }
    if (typeof apellido !== 'string' || apellido.length < 2) {
        return NextResponse.json({ message: 'Apellido inválido.' }, { status: 400 });
    }
    if (typeof telefono !== 'string' || telefono.length < 7) {
        return NextResponse.json({ message: 'Teléfono inválido.' }, { status: 400 });
    }
    if (typeof numero_id !== 'string' || numero_id.length < 5) {
        return NextResponse.json({ message: 'Número de ID inválido.' }, { status: 400 });
    }

    await query(
      'UPDATE Usuarios SET apellido = ?, telefono = ?, numero_id = ? WHERE id_usuario = ?',
      [apellido, telefono, numero_id, id_usuario]
    );

    return NextResponse.json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
