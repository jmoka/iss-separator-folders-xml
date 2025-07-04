
import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFilesSelected, isProcessing }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processZipFile = async (zipFile: File): Promise<File[]> => {
    const zip = await JSZip.loadAsync(zipFile);
    const xmlFiles: File[] = [];

    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir && filename.toLowerCase().endsWith('.xml')) {
        const content = await file.async('blob');
        const xmlFile = new File([content], filename, { type: 'application/xml' });
        xmlFiles.push(xmlFile);
      }
    }

    return xmlFiles;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    let allXmlFiles: File[] = [];
    
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        try {
          const xmlFilesFromZip = await processZipFile(file);
          allXmlFiles.push(...xmlFilesFromZip);
          console.log(`Extraídos ${xmlFilesFromZip.length} arquivos XML do ZIP: ${file.name}`);
        } catch (error) {
          console.error(`Erro ao processar ZIP ${file.name}:`, error);
          alert(`Erro ao processar o arquivo ZIP: ${file.name}`);
        }
      } else if (
        file.name.toLowerCase().endsWith('.xml') || 
        file.type === 'text/xml' || 
        file.type === 'application/xml'
      ) {
        allXmlFiles.push(file);
      }
    }

    if (allXmlFiles.length === 0) {
      alert('Por favor, selecione arquivos XML ou ZIP contendo arquivos XML');
      return;
    }

    const totalFiles = files.length;
    const ignoredFiles = totalFiles - files.filter(f => 
      f.name.toLowerCase().endsWith('.xml') || 
      f.name.toLowerCase().endsWith('.zip') ||
      f.type === 'text/xml' || 
      f.type === 'application/xml'
    ).length;

    if (ignoredFiles > 0) {
      alert(`${ignoredFiles} arquivo(s) ignorado(s) por não serem XML ou ZIP`);
    }

    onFilesSelected(allXmlFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    await processFiles(files);
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
              {isProcessing ? 'Processando arquivos...' : 'Arrastar e soltar arquivos XML ou ZIP'}
            </h3>
            <p className="text-gray-500">
              {isProcessing ? 'Aguarde enquanto analisamos os arquivos' : 'ou clique para selecionar arquivos'}
            </p>
          </div>

          {!isProcessing && (
            <Button type="button" variant="outline">
              Selecionar Arquivos XML ou ZIP
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xml,.zip,text/xml,application/xml,application/zip"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="text-sm text-gray-500 space-y-1">
        <p>• Aceita arquivos XML individuais ou arquivos ZIP contendo XMLs</p>
        <p>• Você pode selecionar múltiplos arquivos de uma vez</p>
        <p>• Arquivos ZIP serão automaticamente extraídos</p>
        <p>• Os arquivos serão analisados pela tag &lt;tipoRecolhimento&gt;</p>
      </div>
    </div>
  );
};

export default FileUpload;
