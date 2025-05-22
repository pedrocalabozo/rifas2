'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Rifas' },
  { href: '/rules', label: 'Reglas' },
  { href: '/winners', label: 'Ganadores' },
  { href: '/profile', label: 'Perfil', requiresAuth: true },
];

export default function NavMenu() {
  const pathname = usePathname();
  // In a real app, you'd use useSession here to conditionally show/hide links
  // For now, 'Perfil' is always shown but will be protected by its page component.

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => (
        <Button key={item.href} variant="ghost" asChild
          className={cn(
            "text-sm font-medium",
            pathname === item.href ? "text-primary hover:text-primary/90" : "text-foreground/70 hover:text-foreground"
          )}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
