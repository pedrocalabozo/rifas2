import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, UserCheck, Ticket, Gift, ShieldCheck } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <ListChecks className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Reglas y Cómo Participar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Todo lo que necesitas saber para unirte a nuestras rifas y tener la oportunidad de ganar.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UserCheck className="mr-3 text-primary h-7 w-7" /> Requisitos para Participar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-foreground/90 text-base">
          <p>1. Debes ser mayor de 18 años para participar en cualquiera de nuestras rifas.</p>
          <p>2. Es obligatorio registrarse en nuestra plataforma utilizando una cuenta de Google válida.</p>
          <p>3. Debes completar tu perfil con tu nombre, apellido, número de teléfono y número de identificación (cédula) verídicos. Esta información es crucial para la entrega de premios.</p>
          <p>4. Asegúrate de que tu información de contacto esté actualizada para que podamos comunicarnos contigo si resultas ganador.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Ticket className="mr-3 text-primary h-7 w-7" /> Cómo Comprar Boletos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-foreground/90 text-base">
          <p>1. Explora la lista de rifas activas en nuestra página principal.</p>
          <p>2. Selecciona la rifa en la que deseas participar haciendo clic en "Participar".</p>
          <p>3. En la página de la rifa, elige la cantidad de números que deseas comprar.</p>
          <p>4. Haz clic en "Generar Números". El sistema asignará aleatoriamente tus números para esa rifa (hasta un máximo de 900 por compra, con números entre 1 y 900).</p>
          <p>5. Una vez generados tus números, selecciona tu método de pago preferido: Pago Móvil, Criptomoneda (USDT - TRC20) o Zinli.</p>
          <p>6. Sigue las instrucciones específicas para el método de pago seleccionado y completa la transacción. Deberás registrar la referencia de tu pago en nuestra plataforma.</p>
          <p>7. Una vez verificado tu pago, tus boletos quedarán registrados y estarás participando.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Gift className="mr-3 text-primary h-7 w-7" /> Anuncio de Ganadores y Entrega de Premios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-foreground/90 text-base">
          <p>1. Los ganadores serán anunciados en la sección "Ganadores" de nuestro sitio web y, si es posible, contactados directamente a través de la información de perfil proporcionada.</p>
          <p>2. Las fechas de los sorteos y anuncio de ganadores se especificarán en los detalles de cada rifa.</p>
          <p>3. Los premios deben ser reclamados dentro de los 30 días posteriores al anuncio, a menos que se especifique lo contrario.</p>
          <p>4. Para reclamar un premio, es posible que se requiera presentar una identificación válida que coincida con los datos del perfil.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <ShieldCheck className="mr-3 text-primary h-7 w-7" /> Términos Generales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-foreground/90 text-base">
          <p>• Rifa Facil se reserva el derecho de modificar estas reglas en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en el sitio web.</p>
          <p>• Cualquier intento de fraude o manipulación del sistema resultará en la descalificación inmediata y posible bloqueo de la cuenta.</p>
          <p>• Al participar, aceptas estos términos y condiciones.</p>
          <p>¡Mucha suerte a todos los participantes!</p>
        </CardContent>
      </Card>
    </div>
  );
}
