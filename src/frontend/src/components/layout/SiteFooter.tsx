import { Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with <Heart className="inline h-3 w-3 text-red-500 fill-red-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
