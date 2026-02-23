import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Trash2, FileText, Calendar, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PDFResource {
  id: string;
  title: string;
  summary: string;
  fileName: string;
  fileSize: string;
  category: string;
  publishDate: string;
  hostedUrl: string;
  previewContent: string;
  createdAt: string;
}

export function PDFResourceAdmin() {
  const [pdfResources, setPdfResources] = useState<PDFResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<PDFResource | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    fileName: '',
    fileSize: '',
    category: 'Election Analysis',
    publishDate: '',
    hostedUrl: '',
    previewContent: ''
  });

  // Fetch all PDF resources
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
      toast.error('Failed to load PDF resources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFResources();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.summary || !formData.hostedUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const pdfResource: PDFResource = {
        id: editingResource?.id || `pdf_${Date.now()}`,
        ...formData,
        createdAt: editingResource?.createdAt || new Date().toISOString()
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pdfResource)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save PDF resource');
      }

      toast.success(editingResource ? 'PDF resource updated!' : 'PDF resource added!');
      setIsDialogOpen(false);
      resetForm();
      fetchPDFResources();
    } catch (error) {
      console.error('Error saving PDF resource:', error);
      toast.error('Failed to save PDF resource');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PDF resource?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete PDF resource');
      }

      toast.success('PDF resource deleted');
      fetchPDFResources();
    } catch (error) {
      console.error('Error deleting PDF resource:', error);
      toast.error('Failed to delete PDF resource');
    }
  };

  // Handle edit
  const handleEdit = (resource: PDFResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      summary: resource.summary,
      fileName: resource.fileName,
      fileSize: resource.fileSize,
      category: resource.category,
      publishDate: resource.publishDate,
      hostedUrl: resource.hostedUrl,
      previewContent: resource.previewContent
    });
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      fileName: '',
      fileSize: '',
      category: 'Election Analysis',
      publishDate: '',
      hostedUrl: '',
      previewContent: ''
    });
    setEditingResource(null);
  };

  // Initialize default PDF resources
  const handleInitialize = async () => {
    if (!confirm('This will load 6 default PDF resources. Continue?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c35202b6/pdf-resources/initialize`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initialize PDF resources');
      }

      toast.success('Default PDF resources loaded successfully!');
      fetchPDFResources();
    } catch (error) {
      console.error('Error initializing PDF resources:', error);
      toast.error('Failed to initialize PDF resources');
    }
  };

  const getCategoryColor = (category: string) => {
    if (category === 'Election Analysis') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (category === 'Technology Assessment') return 'bg-green-100 text-green-800 border-green-200';
    if (category === 'Comprehensive Report') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PDF Resource Management</h2>
          <p className="text-gray-600 mt-1">Manage election analysis reports and publications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add PDF Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit PDF Resource' : 'Add New PDF Resource'}</DialogTitle>
              <DialogDescription>
                {editingResource ? 'Update PDF resource information' : 'Add a new PDF document to the resource library'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter PDF title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief summary of the document (2-3 sentences)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewContent">Preview Content *</Label>
                <Textarea
                  id="previewContent"
                  value={formData.previewContent}
                  onChange={(e) => setFormData({ ...formData, previewContent: e.target.value })}
                  placeholder="Detailed preview content shown in the modal (5-10 sentences)"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostedUrl">Hosted PDF URL *</Label>
                <Input
                  id="hostedUrl"
                  value={formData.hostedUrl}
                  onChange={(e) => setFormData({ ...formData, hostedUrl: e.target.value })}
                  placeholder="https://www.dropbox.com/... or Google Drive link"
                  required
                />
                <p className="text-xs text-gray-500">
                  Paste the shareable link from Dropbox, Google Drive, or other hosting service
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    placeholder="document.pdf"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileSize">File Size</Label>
                  <Input
                    id="fileSize"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="2.8 MB"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Election Analysis">Election Analysis</SelectItem>
                      <SelectItem value="Technology Assessment">Technology Assessment</SelectItem>
                      <SelectItem value="Comprehensive Report">Comprehensive Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    placeholder="e.g., October 2025"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingResource ? 'Update Resource' : 'Add Resource'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* PDF Resources List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading PDF resources...</p>
        </div>
      ) : pdfResources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF resources yet</h3>
            <p className="text-gray-600 mb-4">Load default resources or add your own PDF documents</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleInitialize}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Load 6 Default Resources
              </Button>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pdfResources.map((resource) => (
            <Card key={resource.id} className="border-l-4 border-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Badge className={`${getCategoryColor(resource.category)} text-xs font-medium border`}>
                        {resource.category}
                      </Badge>
                      {resource.publishDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {resource.publishDate}
                        </div>
                      )}
                      {resource.fileSize && (
                        <span className="text-xs text-gray-500">
                          {resource.fileSize}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <CardDescription className="mt-2">{resource.summary}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {resource.previewContent}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                    <span>File: {resource.fileName || 'Not specified'}</span>
                    <span>•</span>
                    <a
                      href={resource.hostedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View hosted file
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
