import { Sparkles, Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 text-accent animate-pulse opacity-50 animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                나도 침착맨 카드 갖고싶다
              </h1>
              <p className="text-xs text-muted-foreground">
                Holographic Card Generator
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => window.open('https://github.com/joshyeom', '_blank')}
            >
              <Heart className="w-4 h-4 mr-2" />
              만든이
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://github.com/joshyeom/want-to-get-chimchak-man-card', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              Github
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};