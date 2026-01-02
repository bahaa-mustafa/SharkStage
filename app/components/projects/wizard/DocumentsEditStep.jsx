import { FileText, Upload, X, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentsEditStep({
  formData,
  updateFormData,
  isEdit,
}) {
  // For edit mode: show existing documents and allow replacement
  const removeExistingDocument = (index) => {
    const newExisting = formData.existingDocuments.filter(
      (_, i) => i !== index
    );
    updateFormData({ existingDocuments: newExisting });
    toast.success("Document will be removed when you save");
  };

  const handleDocumentAdd = (e) => {
    const files = Array.from(e.target.files);
    const totalDocs =
      formData.documents.length +
      formData.existingDocuments.length +
      files.length;

    if (totalDocs > 3) {
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

  const removeNewDocument = (index) => {
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
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const totalDocuments =
    formData.existingDocuments.length + formData.documents.length;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Project Documents
      </h2>

      <p className="text-sm text-paragraph dark:text-paragraph">
        {isEdit
          ? "Manage your project documents. You can replace all documents by uploading new ones."
          : "Upload supporting documents for your project (optional). Maximum 3 PDF files, 2MB each."}
      </p>

      {/* Existing Documents (Edit Mode Only) */}
      {isEdit && formData.existingDocuments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-heading dark:text-background">
            Current Documents ({formData.existingDocuments.length})
          </h3>
          {formData.existingDocuments.map((doc, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-green-50 dark:bg-green-900/10"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-heading dark:text-background mb-1">
                    {doc.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-paragraph dark:text-paragraph">
                    <span>
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingDocument(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {totalDocuments < 3 && (
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
              Click to upload {isEdit ? "new" : ""} documents
            </p>
            <p className="text-xs text-gray-500 dark:text-paragraph">
              PDF files only, up to 2MB each
            </p>
            <p className="text-xs text-paragraph dark:text-paragraph mt-2">
              {totalDocuments} / 3 documents
            </p>
          </label>
        </div>
      )}

      {/* New Documents (to be uploaded) */}
      {formData.documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-heading dark:text-background">
            New Documents to Upload ({formData.documents.length})
          </h3>
          {formData.documents.map((doc, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-blue-50 dark:bg-blue-900/10"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
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
                  onClick={() => removeNewDocument(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalDocuments === 3 && (
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
          {isEdit && (
            <li>• New documents will replace old ones when you save</li>
          )}
        </ul>
      </div>
    </div>
  );
}
