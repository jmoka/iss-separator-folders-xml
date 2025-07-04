
import React from 'react';
import { Download, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedFile } from '@/pages/Index';
import JSZip from 'jszip';

interface FileCategoriesProps {
  title: string;
  description: string;
  files: ProcessedFile[];
  color: 'blue' | 'green' | 'gray';
  icon: React.ReactNode;
}

const FileCategories = ({ title, description, files, color, icon }: FileCategoriesProps) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    gray: 'border-gray-200 bg-gray-50'
  };

  const badgeColorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  const downloadAll = async () => {
    if (files.length === 0) return;

    const zip = new JSZip();
    
    // Adiciona cada arquivo ao ZIP
    files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    // Gera o arquivo ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Cria o nome do arquivo ZIP baseado no título da categoria
    const zipFileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
    
    // Faz o download do ZIP
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSingle = (file: ProcessedFile) => {
    const blob = new Blob([file.content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={`${colorClasses[color]} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <Badge className={badgeColorClasses[color]}>
            {files.length}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {files.length > 0 ? (
          <>
            <Button 
              onClick={downloadAll} 
              className="w-full"
              variant="outline"
            >
              <Package className="mr-2 h-4 w-4" />
              Baixar ZIP ({files.length} arquivos)
            </Button>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadSingle(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum arquivo nesta categoria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileCategories;
