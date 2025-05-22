'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { ExtendedUser } from '@/types'; 
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }).optional(),
  apellido: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }),
  telefono: z.string().min(7, { message: 'El teléfono debe ser válido.' }).regex(/^\+?[0-9\s-()]+$/, { message: 'Número de teléfono inválido.'}),
  numero_id: z.string().min(5, { message: 'La cédula/ID debe tener al menos 5 caracteres.' }),
  email: z.string().email().optional(), 
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: ExtendedUser;
  onProfileUpdate: () => Promise<void>;
}

export default function ProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nombre: user.name ?? '',
      apellido: user.apellido ?? '',
      telefono: user.telefono ?? '',
      numero_id: user.numero_id ?? '',
      email: user.email ?? '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}.`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            // If response is not JSON, try to get text.
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
        title: 'Perfil Actualizado',
        description: 'Tu información ha sido guardada correctamente.',
      });
      await onProfileUpdate(); 
    } catch (error) {
      let userMessage = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
          userMessage = error.message;
      }
      // For true "Failed to fetch" (network errors), error.message might be "Failed to fetch"
      if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
          userMessage = 'Error de red. Por favor, verifica tu conexión e inténtalo de nuevo.';
      }
      toast({
        title: 'Error al actualizar',
        description: userMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} disabled={!!user.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Tu apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Tu número de teléfono" {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numero_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cédula / Número de ID</FormLabel>
              <FormControl>
                <Input placeholder="Tu número de identificación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Tu email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {user.apellido && user.telefono && user.numero_id ? 'Actualizar Perfil' : 'Guardar y Continuar'}
        </Button>
      </form>
    </Form>
  );
}
