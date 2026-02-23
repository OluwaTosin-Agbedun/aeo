import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Eye, 
  Download, 
  FileText, 
  X
} from 'lucide-react';
import pdfThumbnail from 'figma:asset/458baee4b588f524bba4f85be07600b1d9c6b3d6.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PDFResource {
  id: string;
  title: string;
  summary: string;
  fileName: string;
  fileSize: string;
  category: string;
  publishDate: string;
  hostedUrl: string; // The original hosted URL (can be viewer link)
  previewContent: string;
  createdAt?: string;
}

export function PDFResourceLibrary() {
  const [pdfResources, setPdfResources] = useState<PDFResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState<PDFResource | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch PDF resources from database
  useEffect(() => {
    const fetchPDFResources = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch PDF resources');
        }

        const data = await response.json();
        setPdfResources(data.resources || []);
      } catch (error) {
        console.error('Error fetching PDF resources:', error);
        // Optionally set empty array on error
        setPdfResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDFResources();
  }, []);

  // Helper function to convert hosted URLs to direct download links
  const convertToDirectDownloadLink = (hostedUrl: string): string => {
    // Handle Dropbox links: replace ?dl=0 with ?dl=1
    if (hostedUrl.includes('dropbox.com')) {
      return hostedUrl.replace('?dl=0', '?dl=1').replace('&dl=0', '&dl=1');
    }
    
    // Handle Google Drive links: add export=download parameter
    if (hostedUrl.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL and convert to direct download
      const fileIdMatch = hostedUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    // Return original URL if no conversion needed
    return hostedUrl;
  };

  const handlePreview = (pdf: PDFResource) => {
    setSelectedPDF(pdf);
    setIsPreviewOpen(true);
  };

  const handleDownload = (pdf: PDFResource) => {
    // Convert hosted URL to direct download link
    const directDownloadUrl = convertToDirectDownloadLink(pdf.hostedUrl);
    
    // Create download link element
    const link = document.createElement('a');
    link.href = directDownloadUrl;
    link.download = pdf.fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Show confirmation message
    console.log(`Downloading: ${pdf.fileName} from ${directDownloadUrl}`);
  };

  const getCategoryColor = (category: string) => {
    if (category === 'Election Analysis') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (category === 'Technology Assessment') return 'bg-green-100 text-green-800 border-green-200';
    if (category === 'Comprehensive Report') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="mb-3 text-[36px] font-bold text-gray-900">Reports and Publications</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto text-[18px] leading-relaxed">
          Access our comprehensive collection of election integrity reports and analysis. 
          Each document provides evidence-based insights into Nigeria's electoral processes.
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading resources...</p>
        </div>
      ) : pdfResources.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No PDF resources available yet.</p>
        </div>
      ) : (
        <>
          {/* PDF Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfResources.map((pdf) => (
          <Card 
            key={pdf.id} 
            className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 bg-white"
          >
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge className={`${getCategoryColor(pdf.category)} text-xs font-medium border`}>
                  {pdf.category}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {pdf.publishDate}
                </div>
              </div>
              
              <CardTitle className="text-lg leading-tight text-gray-900 group-hover:text-blue-700 transition-colors">
                {pdf.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preview Image */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <img 
                  src={pdfThumbnail} 
                  alt="Election monitoring preview" 
                  className="w-full h-full object-cover"
                />
              </div>

              <CardDescription className="text-sm leading-relaxed text-gray-600 min-h-[80px]">
                {pdf.summary}
              </CardDescription>

              {/* File Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>PDF</span>
                </div>
                <div>{pdf.fileSize}</div>

              </div>

              {/* Action Buttons */}
              <div>
                <Button
                  onClick={() => handleDownload(pdf)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[85vh] p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-xl text-gray-900 pr-8">
                  {selectedPDF?.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Preview and download this election monitoring document from the Athena Election Observatory.
                </DialogDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge className={`${selectedPDF ? getCategoryColor(selectedPDF.category) : ''} text-xs`}>
                    {selectedPDF?.category}
                  </Badge>
                  <span>{selectedPDF?.fileSize}</span>
                  <span>{selectedPDF?.publishDate}</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-6">
            <ScrollArea className="h-full w-full">
              <div className="space-y-6">
                {/* PDF Preview Area */}
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden min-h-[400px] flex flex-col">
                  <div className="relative w-full h-64">
                    <img 
                      src={pdfThumbnail} 
                      alt="Election monitoring document preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 bg-white flex-1 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
                      This preview shows a snapshot of the election monitoring document. Download the full PDF for complete analysis and findings.
                    </p>
                    <Button 
                      onClick={() => selectedPDF && handleDownload(selectedPDF)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Direct Download
                    </Button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Document Summary</h4>
                  <p className="text-sm leading-relaxed text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {selectedPDF?.summary}
                  </p>
                  
                  <h4 className="text-lg font-medium text-gray-900 pt-4">Key Findings & Analysis</h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {selectedPDF?.previewContent}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              File: {selectedPDF?.fileName}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => selectedPDF && handleDownload(selectedPDF)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Direct Download
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}