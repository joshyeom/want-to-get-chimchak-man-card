import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { CardData } from "@/pages/Index";

interface CardPreviewProps {
  cardData: CardData;
}

export const CardPreview = ({ cardData }: CardPreviewProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 3D rotation calculation
      const rotateX = (y - 50) * 0.35;
      const rotateY = (x - 50) * -0.35;
      
      // Update CSS variables
      card.style.setProperty('--pointer-x', `${x}%`);
      card.style.setProperty('--pointer-y', `${y}%`);
      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'ultra-rare': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRaritySymbol = (rarity: string) => {
    switch (rarity) {
      case 'common': return '●';
      case 'rare': return '◆';
      case 'ultra-rare': return '★';
      case 'legendary': return '✦';
      default: return '●';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          카드 미리보기
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative">
          <div
            ref={cardRef}
            className={`holo-card holo-${cardData.template} w-80 h-112 relative cursor-none`}
            style={{
              aspectRatio: '660/921',
              '--effect-intensity': cardData.effectIntensity / 100,
              '--glitter-density': `${cardData.glitterDensity}%`,
            } as React.CSSProperties}
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
              
              {/* Image Layer */}
              {cardData.image && (
                <div className="absolute inset-4 rounded-lg overflow-hidden">
                  <img
                    src={cardData.image}
                    alt="Card image"
                    className="w-full h-3/5 object-cover"
                    style={{
                      filter: `brightness(${1 + (cardData.effectIntensity / 200)}) contrast(${1 + (cardData.effectIntensity / 400)})`,
                    }}
                  />
                </div>
              )}

              {/* Holographic Shine Layer */}
              <div className="holo-shine" style={{ opacity: cardData.effectIntensity / 100 }} />

              {/* Glare Effect */}
              <div className="holo-glare" />

              {/* Card Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
                    {cardData.name}
                  </h3>
                  <div className={`flex items-center justify-center gap-2 ${getRarityColor(cardData.rarity)}`}>
                    <span className="text-lg">{getRaritySymbol(cardData.rarity)}</span>
                    <span className="text-sm font-medium uppercase">
                      {cardData.rarity.replace('-', ' ')}
                    </span>
                    <span className="text-lg">{getRaritySymbol(cardData.rarity)}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="space-y-3">
                  {cardData.description && (
                    <div className="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm text-center">
                        {cardData.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-black/30 px-2 py-1 rounded">
                      #{cardData.cardNumber}
                    </span>
                    <span className="bg-black/30 px-2 py-1 rounded">
                      {cardData.setInfo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scanlines Effect */}
              {cardData.showScanlines && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-repeat-y animate-pulse"
                       style={{
                         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                       }} />
                </div>
              )}

              {/* Glitter Effect */}
              {cardData.glitterDensity > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: Math.floor(cardData.glitterDensity / 10) }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random()}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              마우스를 카드 위에 올려 홀로그래픽 효과를 확인하세요!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};