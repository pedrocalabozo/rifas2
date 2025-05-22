export default function Footer() {
  return (
    <footer className="bg-card shadow-sm border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rifa Facil. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
