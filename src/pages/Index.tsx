import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { CardEditor } from "@/components/CardEditor";
import { CardPreview } from "@/components/CardPreview";
import { ExportOptions } from "@/components/ExportOptions";
import { Header } from "@/components/Header";
import { Sparkles } from "lucide-react";

export interface CardData {
  image: string | null;
  name: string;
  description: string;
  rarity: "common" | "rare" | "ultra-rare" | "legendary";
  cardNumber: string;
  setInfo: string;
  template: "regular" | "rainbow" | "cosmos";
  effectIntensity: number;
  colorPalette: "rainbow" | "blue" | "red" | "custom";
  glitterDensity: number;
  showScanlines: boolean;
}

const Index = () => {
  const [cardData, setCardData] = useState<CardData>({
    image: null,
    name: "나도 침착맨",
    description: "홀로그래픽 카드 생성기로 만든 특별한 카드",
    rarity: "ultra-rare",
    cardNumber: "001",
    setInfo: "Holographic Series",
    template: "rainbow",
    effectIntensity: 75,
    colorPalette: "rainbow",
    glitterDensity: 50,
    showScanlines: true,
  });

  const updateCardData = (updates: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              홀로그래픽 카드 생성기
            </h1>
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            당신만의 특별한 홀로그래픽 카드를 만들어보세요. 
            이미지를 업로드하고 다양한 효과를 적용하여 멋진 카드를 생성할 수 있습니다.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Upload & Editor */}
          <div className="space-y-6">
            <ImageUploader 
              onImageUpload={(image) => updateCardData({ image })}
              currentImage={cardData.image}
            />
            
            <CardEditor 
              cardData={cardData}
              onUpdate={updateCardData}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <CardPreview cardData={cardData} />
          </div>
        </div>

        {/* Export Options */}
        <ExportOptions cardData={cardData} />
      </main>
    </div>
  );
};

export default Index;