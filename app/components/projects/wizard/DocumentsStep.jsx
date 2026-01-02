import { FileText, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentsStep({ formData, updateFormData }) {
  const handleDocumentAdd = (e) => {
    const files = Array.from(e.target.files);

    if (formData.documents.length + files.length > 3) {
      toast.error("Maximum 3 documents allowed");
      return;
    }

    const validFiles = [];

    for (const file of files) {
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 2MB`);
        continue;
      }
      validFiles.push({
        file,
        title: file.name.replace(".pdf", ""),
        preview: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      updateFormData({
        documents: [...formData.documents, ...validFiles],
      });
    }
  };

  const removeDocument = (index) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    updateFormData({ documents: newDocuments });
  };

  const updateDocumentTitle = (index, title) => {
    const newDocuments = [...formData.documents];
    newDocuments[index].title = title;
    updateFormData({ documents: newDocuments });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Project Documents
      </h2>

      <p className="text-sm text-paragraph dark:text-paragraph">
        Upload supporting documents for your project (optional). Maximum 3 PDF
        files, 2MB each.
      </p>

      {/* Upload Area */}
      {formData.documents.length < 3 && (
        <div className="border-2 border-dashed border-gray-300 dark:border-background/30 rounded-lg p-8 text-center hover:border-primary dark:hover:border-primary-dark transition cursor-pointer">
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleDocumentAdd}
            className="hidden"
            id="document-upload"
          />
          <label htmlFor="document-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-paragraph" />
            <p className="text-sm text-gray-600 dark:text-paragraph mb-1">
              Click to upload documents
            </p>
            <p className="text-xs text-gray-500 dark:text-paragraph">
              PDF files only, up to 2MB each
            </p>
            <p className="text-xs text-paragraph dark:text-paragraph mt-2">
              {formData.documents.length} / 3 documents uploaded
            </p>
          </label>
        </div>
      )}

      {/* Documents List */}
      {formData.documents.length > 0 && (
        <div className="space-y-3">
          {formData.documents.map((doc, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={doc.title}
                    onChange={(e) => updateDocumentTitle(index, e.target.value)}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                    placeholder="Document title (required)"
                  />
                  <div className="flex items-center gap-4 text-xs text-paragraph dark:text-paragraph">
                    <span className="font-medium">{doc.file.name}</span>
                    <span>{formatFileSize(doc.file.size)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formData.documents.length === 3 && (
        <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
          Maximum number of documents reached (3/3)
        </p>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
        <h3 className="font-semibold text-heading dark:text-background mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Guidelines
        </h3>
        <ul className="space-y-1 text-sm text-paragraph dark:text-paragraph">
          <li>• PDF format only</li>
          <li>• Maximum 2MB per document</li>
          <li>• Up to 3 documents per project</li>
          <li>• Each document must have a descriptive title</li>
          <li>
            • Recommended: Business plan, Financial projections, Market analysis
          </li>
        </ul>
      </div>
    </div>
  );
}
