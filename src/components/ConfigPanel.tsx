import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ConfigSettings {
  tagName: string;
  tomadorValue: string;
  prestadorValue: string;
}

interface ConfigPanelProps {
  config: ConfigSettings;
  onConfigChange: (config: ConfigSettings) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const handleChange = (field: keyof ConfigSettings, value: string) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="text-blue-600" />
          Configurações de Separação
        </CardTitle>
        <CardDescription>
          Defina a TAG XML e os valores para categorização automática
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tagName">Nome da TAG XML</Label>
            <Input
              id="tagName"
              value={config.tagName}
              onChange={(e) => handleChange('tagName', e.target.value)}
              placeholder="Ex: IssRetido"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tomadorValue">Valor para Tomador</Label>
            <Input
              id="tomadorValue"
              value={config.tomadorValue}
              onChange={(e) => handleChange('tomadorValue', e.target.value)}
              placeholder="Ex: 1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prestadorValue">Valor para Prestador</Label>
            <Input
              id="prestadorValue"
              value={config.prestadorValue}
              onChange={(e) => handleChange('prestadorValue', e.target.value)}
              placeholder="Ex: 2"
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
          <strong>Padrão ABRASF:</strong> IssRetido com valor 1 (Retido pelo Tomador) ou 2 (Não Retido - Prestador)
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
