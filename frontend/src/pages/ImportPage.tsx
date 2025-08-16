import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { API_BASE_URL } from "../utils/api"; // ✅ import the base URL

export default function ImportPage() {
  const [uploading, setUploading] = useState(false);
  const [importedProspects, setImportedProspects] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setImportedProspects([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/import/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImportedProspects(data.data || []);

      toast({
        title: "✅ File uploaded",
        description: `${
          data.data?.length || 0
        } prospects imported successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "❌ Upload failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Import Excel Prospects</h1>
        </div>

        <div className="mb-4 space-y-2">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="flex items-center text-muted-foreground text-sm">
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Uploading...
            </p>
          )}
        </div>

        {importedProspects.length > 0 && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {importedProspects.length} Prospects Imported
              </h2>
              <Button onClick={() => navigate("/prospects")} variant="default">
                Go to All Prospects
              </Button>
            </div>
            <div className="grid gap-3">
              {importedProspects.map((p, i) => (
                <div
                  key={i}
                  className="border p-3 rounded bg-secondary/30 text-sm"
                >
                  <p className="font-medium">
                    {p.name} ({p.title})
                  </p>
                  <p className="text-muted-foreground">{p.email}</p>
                  <p className="text-muted-foreground">{p.organization_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
