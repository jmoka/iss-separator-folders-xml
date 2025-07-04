
import React, { useState } from 'react';
import { Upload, Download, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import FileCategories from '@/components/FileCategories';

export interface ProcessedFile {
  name: string;
  content: string;
  category: 'tomador' | 'prestador' | 'sem_categoria';
  originalFile: File;
}

const Index = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (uploadedFiles: File[]) => {
    setIsProcessing(true);
    const processed: ProcessedFile[] = [];

    for (const file of uploadedFiles) {
      try {
        const content = await file.text();
        const category = categorizeFile(content);
        
        processed.push({
          name: file.name,
          content,
          category,
          originalFile: file
        });
      } catch (error) {
        console.error(`Erro ao processar arquivo ${file.name}:`, error);
        toast({
          title: "Erro no processamento",
          description: `Não foi possível processar o arquivo ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setFiles(processed);
    setIsProcessing(false);
    
    toast({
      title: "Processamento concluído",
      description: `${processed.length} arquivos processados com sucesso`
    });
  };

  const categorizeFile = (xmlContent: string): 'tomador' | 'prestador' | 'sem_categoria' => {
    const tipoRecolhimentoMatch = xmlContent.match(/<tipoRecolhimento>(.*?)<\/tipoRecolhimento>/i);
    
    if (!tipoRecolhimentoMatch) {
      return 'sem_categoria';
    }

    const tipoRecolhimento = tipoRecolhimentoMatch[1].toLowerCase();
    
    if (tipoRecolhimento.includes('tomador')) {
      return 'tomador';
    } else if (tipoRecolhimento.includes('prestador')) {
      return 'prestador';
    }
    
    return 'sem_categoria';
  };

  const clearFiles = () => {
    setFiles([]);
    toast({
      title: "Arquivos limpos",
      description: "Todos os arquivos foram removidos da lista"
    });
  };

  const tomadorFiles = files.filter(f => f.category === 'tomador');
  const prestadorFiles = files.filter(f => f.category === 'prestador');
  const semCategoriaFiles = files.filter(f => f.category === 'sem_categoria');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <FileText className="text-blue-600" />
            Separador de XML ISS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Faça upload dos seus arquivos XML e separe automaticamente por tipo de recolhimento de ISS
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="text-blue-600" />
              Upload de Arquivos XML
            </CardTitle>
            <CardDescription>
              Selecione múltiplos arquivos XML para análise e separação automática
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onFilesSelected={processFiles} isProcessing={isProcessing} />
          </CardContent>
        </Card>

        {/* Results Section */}
        {files.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Arquivos Processados ({files.length})
              </h2>
              <Button onClick={clearFiles} variant="outline">
                Limpar Todos
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FileCategories
                title="ISS - Tomador"
                description="Arquivos com ISS a recolher pelo Tomador"
                files={tomadorFiles}
                color="blue"
                icon={<FolderOpen className="text-blue-600" />}
              />
              
              <FileCategories
                title="ISS - Prestador"
                description="Arquivos com ISS a recolher pelo Prestador"
                files={prestadorFiles}
                color="green"
                icon={<FolderOpen className="text-green-600" />}
              />
              
              <FileCategories
                title="Sem Categoria"
                description="Arquivos sem tag tipoRecolhimento identificada"
                files={semCategoriaFiles}
                color="gray"
                icon={<FolderOpen className="text-gray-600" />}
              />
            </div>

            {/* Summary */}
            <Alert>
              <AlertDescription>
                <strong>Resumo:</strong> {tomadorFiles.length} arquivo(s) para Tomador, {prestadorFiles.length} arquivo(s) para Prestador, {semCategoriaFiles.length} arquivo(s) sem categoria identificada.
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
