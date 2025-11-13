import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, FileText, Trash2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function StudyMaterials() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    tags: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const materialsQuery = trpc.materials.getMaterials.useQuery();
  const uploadMutation = trpc.materials.uploadMaterial.useMutation();
  const deleteMutation = trpc.materials.deleteMaterial.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !selectedFile) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(",")[1];
        if (!base64Data) {
          toast.error("Failed to read file");
          return;
        }

        await uploadMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          fileData: base64Data,
          fileName: selectedFile.name,
          fileType: selectedFile.type.split("/")[1] || "bin",
          fileSize: selectedFile.size,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
        });

        toast.success("Material uploaded successfully!");
        setFormData({ title: "", description: "", subject: "", tags: "" });
        setSelectedFile(null);
        setIsOpen(false);
        materialsQuery.refetch();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error("Failed to upload material");
      console.error(error);
    }
  };

  const handleDelete = async (materialId: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteMutation.mutateAsync({ materialId });
      toast.success("Material deleted successfully!");
      materialsQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete material");
      console.error(error);
    }
  };

  const materials = materialsQuery.data || [];

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      txt: "📋",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      zip: "📦",
      rar: "📦",
    };
    return icons[fileType.toLowerCase()] || "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and organize your notes, PDFs, and study materials
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <Input
                  placeholder="e.g., Chapter 5 Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <Input
                  placeholder="e.g., Biology"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Add details about this material..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  placeholder="e.g., important, exam-prep, chapter-5"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedFile ? selectedFile.name : "Click to select file"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max 50MB • PDF, DOC, TXT, Images, ZIP
                    </p>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload Material
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Materials List */}
      {materialsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : materials.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No materials yet. Upload your first study material!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* File Icon */}
                  <div className="text-3xl mt-1">
                    {getFileIcon(material.fileType)}
                  </div>

                  {/* Material Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {material.subject} • {formatFileSize(material.fileSize)}
                    </p>
                    {material.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {material.description}
                      </p>
                    )}
                    {material.tags && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {JSON.parse(material.tags || "[]").map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Uploaded {format(new Date(material.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Study Material Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Organize materials by subject and chapter for easy access</li>
          <li>✓ Use descriptive titles and tags for quick searching</li>
          <li>✓ Add notes about important points in the description</li>
          <li>✓ Keep your materials updated as you progress through courses</li>
          <li>✓ Share important materials with study groups</li>
        </ul>
      </Card>
    </div>
  );
}
