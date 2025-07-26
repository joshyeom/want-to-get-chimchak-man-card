import { useState } from "react";
import { Download, FileImage, Film, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { CardData } from "@/pages/Index";

interface ExportOptionsProps {
  cardData: CardData;
}

export const ExportOptions = ({ cardData }: ExportOptionsProps) => {
  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "gif" | "html">("png");
  const [resolution, setResolution] = useState<"1x" | "2x" | "4x">("2x");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cardData.image) {
      toast.error("먼저 이미지를 업로드해주세요.");
      return;
    }

    setIsExporting(true);
    
    try {
      // Create a canvas for export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas size based on resolution
      const baseWidth = 660;
      const baseHeight = 921;
      const multiplier = parseInt(resolution.replace('x', ''));
      
      canvas.width = baseWidth * multiplier;
      canvas.height = baseHeight * multiplier;

      // Scale context for high resolution
      ctx.scale(multiplier, multiplier);

      // Draw card background
      const gradient = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f172a');
      
      ctx.fillStyle = gradient;
      ctx.roundRect(0, 0, baseWidth, baseHeight, 12);
      ctx.fill();

      // Load and draw user image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = cardData.image!;
      });

      // Draw image in card area
      const imageY = 40;
      const imageHeight = baseHeight * 0.6;
      const imageWidth = baseWidth - 80;
      const imageX = 40;
      
      ctx.save();
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 8);
      ctx.clip();
      ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
      ctx.restore();

      // Add holographic overlay effect
      if (cardData.effectIntensity > 0) {
        const holoGradient = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
        holoGradient.addColorStop(0, `rgba(255, 0, 255, ${cardData.effectIntensity / 400})`);
        holoGradient.addColorStop(0.3, `rgba(0, 255, 255, ${cardData.effectIntensity / 400})`);
        holoGradient.addColorStop(0.6, `rgba(255, 255, 0, ${cardData.effectIntensity / 400})`);
        holoGradient.addColorStop(1, `rgba(255, 0, 255, ${cardData.effectIntensity / 400})`);
        
        ctx.fillStyle = holoGradient;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, baseWidth, baseHeight);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Add text content
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.name, baseWidth / 2, imageY + imageHeight + 40);

      ctx.font = '14px Arial';
      const descLines = cardData.description.match(/.{1,40}/g) || [cardData.description];
      descLines.forEach((line, index) => {
        ctx.fillText(line, baseWidth / 2, imageY + imageHeight + 70 + (index * 20));
      });

      // Add card info
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`#${cardData.cardNumber}`, 40, baseHeight - 40);
      
      ctx.textAlign = 'right';
      ctx.fillText(cardData.setInfo, baseWidth - 40, baseHeight - 40);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${cardData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${resolution}.${exportFormat}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success(`카드가 ${exportFormat.toUpperCase()} 형식으로 다운로드되었습니다!`);
        }
      }, `image/${exportFormat}`, 0.9);

    } catch (error) {
      console.error('Export failed:', error);
      toast.error("내보내기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cardData.name} - 홀로그래픽 카드</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #0f172a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        .holo-card {
            width: 330px;
            height: 460px;
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f172a);
            border-radius: 12px;
            position: relative;
            cursor: none;
            transform-style: preserve-3d;
            transition: transform 0.1s ease;
        }
        .holo-card:hover {
            transform: perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(1.02);
        }
        .card-content {
            position: relative;
            z-index: 10;
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: white;
        }
        .card-image {
            width: 100%;
            height: 60%;
            background-image: url('${cardData.image}');
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            margin: 20px 0;
        }
        .holo-shine {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
            opacity: 0;
            transition: opacity 0.3s ease;
            mix-blend-mode: screen;
            border-radius: 12px;
        }
        .holo-card:hover .holo-shine {
            opacity: ${cardData.effectIntensity / 100};
        }
    </style>
</head>
<body>
    <div class="holo-card" id="holoCard">
        <div class="holo-shine"></div>
        <div class="card-content">
            <div>
                <h3>${cardData.name}</h3>
                <p>${cardData.rarity.replace('-', ' ').toUpperCase()}</p>
            </div>
            <div class="card-image"></div>
            <div>
                <p>${cardData.description}</p>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span>#${cardData.cardNumber}</span>
                    <span>${cardData.setInfo}</span>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const card = document.getElementById('holoCard');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            const rotateX = (y - 50) * 0.35;
            const rotateY = (x - 50) * -0.35;
            
            card.style.setProperty('--rotate-x', rotateX + 'deg');
            card.style.setProperty('--rotate-y', rotateY + 'deg');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cardData.name.replace(/[^a-zA-Z0-9]/g, '_')}_interactive.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("인터랙티브 HTML 파일이 다운로드되었습니다!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          내보내기 옵션
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>파일 형식</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as typeof exportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (투명 배경)</SelectItem>
                <SelectItem value="jpg">JPG (고품질)</SelectItem>
                <SelectItem value="gif">GIF (애니메이션)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>해상도</Label>
            <Select value={resolution} onValueChange={(value) => setResolution(value as typeof resolution)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1x">1x (660×921px)</SelectItem>
                <SelectItem value="2x">2x (1320×1842px)</SelectItem>
                <SelectItem value="4x">4x (2640×3684px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={handleExport}
            disabled={isExporting || !cardData.image}
            className="btn-holo"
          >
            <FileImage className="w-4 h-4 mr-2" />
            {isExporting ? "내보내는 중..." : "이미지 다운로드"}
          </Button>

          <Button 
            onClick={exportAsHTML}
            disabled={!cardData.image}
            variant="outline"
          >
            <Code className="w-4 h-4 mr-2" />
            HTML 다운로드
          </Button>
        </div>

        <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2">💡 내보내기 팁</h4>
          <ul className="space-y-1 text-xs">
            <li>• PNG: 투명 배경이 필요한 경우 추천</li>
            <li>• JPG: 파일 크기가 작고 고품질</li>
            <li>• GIF: 홀로그램 애니메이션 효과 포함</li>
            <li>• HTML: 웹에서 인터랙티브하게 사용 가능</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};