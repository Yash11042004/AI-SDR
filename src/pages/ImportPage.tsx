// ImportPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ImportPage() {
  const [uploading, setUploading] = useState(false);
  const [importedProspects, setImportedProspects] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    setErrorMessage("");
    setImportedProspects([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/import/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImportedProspects(data.data || []);
      setUploadSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong");
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
          {uploading && <p className="text-muted-foreground">Uploading...</p>}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        {uploadSuccess && importedProspects.length === 0 && (
          <p className="text-yellow-600 mt-4">
            File uploaded successfully, but no valid prospects found.
          </p>
        )}

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
