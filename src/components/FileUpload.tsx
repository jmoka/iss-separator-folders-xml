
import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFilesSelected, isProcessing }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const xmlFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.xml') || 
      file.type === 'text/xml' || 
      file.type === 'application/xml'
    );

    if (xmlFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos XML');
      return;
    }

    if (xmlFiles.length !== files.length) {
      alert(`${files.length - xmlFiles.length} arquivo(s) ignorado(s) por não serem XML`);
    }

    onFilesSelected(xmlFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const xmlFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.xml') || 
      file.type === 'text/xml' || 
      file.type === 'application/xml'
    );

    if (xmlFiles.length > 0) {
      onFilesSelected(xmlFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Processando arquivos...' : 'Arrastar e soltar arquivos XML'}
            </h3>
            <p className="text-gray-500">
              {isProcessing ? 'Aguarde enquanto analisamos os arquivos' : 'ou clique para selecionar arquivos'}
            </p>
          </div>

          {!isProcessing && (
            <Button type="button" variant="outline">
              Selecionar Arquivos XML
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xml,text/xml,application/xml"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="text-sm text-gray-500 space-y-1">
        <p>• Aceita apenas arquivos XML</p>
        <p>• Você pode selecionar múltiplos arquivos de uma vez</p>
        <p>• Os arquivos serão analisados pela tag &lt;tipoRecolhimento&gt;</p>
      </div>
    </div>
  );
};

export default FileUpload;
