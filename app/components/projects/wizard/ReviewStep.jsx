import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  DollarSign,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

export default function ReviewStep({ formData }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Review Your Project
      </h2>

      <p className="text-sm text-paragraph dark:text-paragraph">
        Please review all information before proceeding to payment.
      </p>

      {/* Basic Information */}
      <div className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5">
        <h3 className="font-semibold text-heading dark:text-background mb-3 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Basic Information
        </h3>
        <div className="space-y-2 text-sm">
          {formData.imagePreview && (
            <div className="mb-3">
              <img
                src={formData.imagePreview}
                alt="Project"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">Title:</span>
            <span className="col-span-2 font-medium text-heading dark:text-background">
              {formData.title}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">Category:</span>
            <span className="col-span-2 font-medium text-heading dark:text-background">
              {formData.category}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">Status:</span>
            <span className="col-span-2 font-medium text-heading dark:text-background capitalize">
              {formData.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">
              Short Description:
            </span>
            <span className="col-span-2 text-paragraph dark:text-paragraph">
              {formData.shortDesc}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5">
        <h3 className="font-semibold text-heading dark:text-background mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Financial Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">
              Total Price:
            </span>
            <span className="col-span-2 font-medium text-heading dark:text-background">
              ${Number(formData.totalPrice).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-paragraph dark:text-paragraph">
              Expected ROI:
            </span>
            <span className="col-span-2 font-medium text-heading dark:text-background">
              {formData.expectedROI}%
            </span>
          </div>
          {formData.availablePercentage && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-paragraph dark:text-paragraph">
                Available %:
              </span>
              <span className="col-span-2 font-medium text-heading dark:text-background">
                {formData.availablePercentage}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Project Details */}
      {(formData.keyBenefits.some((b) => b.trim()) ||
        formData.potentialRisks.some((r) => r.trim()) ||
        formData.timeline.length > 0) && (
        <div className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5">
          <h3 className="font-semibold text-heading dark:text-background mb-3">
            Project Details
          </h3>
          
          {/* Benefits */}
          {formData.keyBenefits.some((b) => b.trim()) && (
            <div className="mb-4">
              <p className="text-sm font-medium text-heading dark:text-background mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Key Benefits
              </p>
              <ul className="space-y-1 text-sm text-paragraph dark:text-paragraph ml-6">
                {formData.keyBenefits
                  .filter((b) => b.trim())
                  .map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {formData.potentialRisks.some((r) => r.trim()) && (
            <div className="mb-4">
              <p className="text-sm font-medium text-heading dark:text-background mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Potential Risks
              </p>
              <ul className="space-y-1 text-sm text-paragraph dark:text-paragraph ml-6">
                {formData.potentialRisks
                  .filter((r) => r.trim())
                  .map((risk, index) => (
                    <li key={index}>• {risk}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {formData.timeline.length > 0 && (
            <div>
              <p className="text-sm font-medium text-heading dark:text-background mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Timeline ({formData.timeline.length} phases)
              </p>
              <div className="space-y-2 ml-6">
                {formData.timeline.map((phase, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-heading dark:text-background">
                      {phase.phase}:
                    </span>{" "}
                    <span className="text-paragraph dark:text-paragraph">
                      {phase.title} ({phase.date}) - {phase.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      {formData.documents.length > 0 && (
        <div className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5">
          <h3 className="font-semibold text-heading dark:text-background mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents ({formData.documents.length})
          </h3>
          <div className="space-y-2">
            {formData.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-paragraph dark:text-paragraph"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>{doc.title || doc.file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Note */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
        <p className="text-sm text-heading dark:text-background font-medium mb-2">
          Before you proceed:
        </p>
        <ul className="space-y-1 text-sm text-paragraph dark:text-paragraph">
          <li>✓ All information has been reviewed</li>
          <li>✓ All required fields are complete</li>
          <li>✓ Documents are properly titled</li>
          <li>✓ Ready to proceed with payment</li>
        </ul>
      </div>
    </div>
  );
}
