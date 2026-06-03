import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground mt-2">Page not found</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
