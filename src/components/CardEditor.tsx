import { Settings, Palette, Sparkles, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CardData } from "@/pages/Index";

interface CardEditorProps {
  cardData: CardData;
  onUpdate: (updates: Partial<CardData>) => void;
}

export const CardEditor = ({ cardData, onUpdate }: CardEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          카드 편집
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">기본 정보</TabsTrigger>
            <TabsTrigger value="template">템플릿</TabsTrigger>
            <TabsTrigger value="effects">효과</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">카드 이름</Label>
              <Input
                id="name"
                value={cardData.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="카드 이름을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">카드 설명</Label>
              <Textarea
                id="description"
                value={cardData.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="카드에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">희귀도</Label>
                <Select value={cardData.rarity} onValueChange={(value) => onUpdate({ rarity: value as CardData['rarity'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="ultra-rare">Ultra Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">카드 번호</Label>
                <Input
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => onUpdate({ cardNumber: e.target.value })}
                  placeholder="001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setInfo">세트 정보</Label>
              <Input
                id="setInfo"
                value={cardData.setInfo}
                onChange={(e) => onUpdate({ setInfo: e.target.value })}
                placeholder="Holographic Series"
              />
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                홀로그램 템플릿
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'regular', label: 'Regular Holo', desc: '기본 홀로그램 효과' },
                  { value: 'rainbow', label: 'Rainbow Holo', desc: '무지개 홀로그램 효과' },
                  { value: 'cosmos', label: 'Cosmos Holo', desc: '우주 테마 홀로그램' }
                ].map((template) => (
                  <div
                    key={template.value}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      cardData.template === template.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onUpdate({ template: template.value as CardData['template'] })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.label}</h4>
                        <p className="text-sm text-muted-foreground">{template.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        cardData.template === template.value 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                효과 강도: {cardData.effectIntensity}%
              </Label>
              <Slider
                value={[cardData.effectIntensity]}
                onValueChange={([value]) => onUpdate({ effectIntensity: value })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <Label>글리터 밀도: {cardData.glitterDensity}%</Label>
              <Slider
                value={[cardData.glitterDensity]}
                onValueChange={([value]) => onUpdate({ glitterDensity: value })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                색상 팔레트
              </Label>
              <Select value={cardData.colorPalette} onValueChange={(value) => onUpdate({ colorPalette: value as CardData['colorPalette'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rainbow">무지개</SelectItem>
                  <SelectItem value="blue">블루 계열</SelectItem>
                  <SelectItem value="red">레드 계열</SelectItem>
                  <SelectItem value="custom">커스텀</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="scanlines">스캔라인 표시</Label>
              <Switch
                id="scanlines"
                checked={cardData.showScanlines}
                onCheckedChange={(checked) => onUpdate({ showScanlines: checked })}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};