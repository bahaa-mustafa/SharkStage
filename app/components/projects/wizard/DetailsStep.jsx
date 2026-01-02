import { Plus, X, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";

export default function DetailsStep({ formData, updateFormData }) {
  // Key Benefits
  const addBenefit = () => {
    updateFormData({
      keyBenefits: [...formData.keyBenefits, ""],
    });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.keyBenefits.filter((_, i) => i !== index);
    updateFormData({ keyBenefits: newBenefits.length ? newBenefits : [""] });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.keyBenefits];
    newBenefits[index] = value;
    updateFormData({ keyBenefits: newBenefits });
  };

  // Potential Risks
  const addRisk = () => {
    updateFormData({
      potentialRisks: [...formData.potentialRisks, ""],
    });
  };

  const removeRisk = (index) => {
    const newRisks = formData.potentialRisks.filter((_, i) => i !== index);
    updateFormData({ potentialRisks: newRisks.length ? newRisks : [""] });
  };

  const updateRisk = (index, value) => {
    const newRisks = [...formData.potentialRisks];
    newRisks[index] = value;
    updateFormData({ potentialRisks: newRisks });
  };

  // Timeline
  const addTimelinePhase = () => {
    updateFormData({
      timeline: [
        ...formData.timeline,
        { phase: "", title: "", date: "", status: "upcoming" },
      ],
    });
  };

  const removeTimelinePhase = (index) => {
    const newTimeline = formData.timeline.filter((_, i) => i !== index);
    updateFormData({ timeline: newTimeline });
  };

  const updateTimelinePhase = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    updateFormData({ timeline: newTimeline });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Project Details
      </h2>

      <p className="text-sm text-paragraph dark:text-paragraph">
        All fields in this step are optional but recommended for better project
        presentation.
      </p>

      {/* Key Benefits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-heading dark:text-background flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Key Benefits
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Benefit
          </button>
        </div>
        <div className="space-y-2">
          {formData.keyBenefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                placeholder={`Benefit ${index + 1}`}
              />
              {formData.keyBenefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Potential Risks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-heading dark:text-background flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Potential Risks
          </label>
          <button
            type="button"
            onClick={addRisk}
            className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Risk
          </button>
        </div>
        <div className="space-y-2">
          {formData.potentialRisks.map((risk, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={risk}
                onChange={(e) => updateRisk(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                placeholder={`Risk ${index + 1}`}
              />
              {formData.potentialRisks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRisk(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-heading dark:text-background flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Project Timeline
          </label>
          <button
            type="button"
            onClick={addTimelinePhase}
            className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Phase
          </button>
        </div>
        <div className="space-y-4">
          {formData.timeline.map((phase, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-background/20 rounded-lg bg-gray-50 dark:bg-background/5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-heading dark:text-background">
                  Phase {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeTimelinePhase(index)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={phase.phase}
                  onChange={(e) =>
                    updateTimelinePhase(index, "phase", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="Phase name (e.g., Phase 1)"
                />
                <input
                  type="text"
                  value={phase.title}
                  onChange={(e) =>
                    updateTimelinePhase(index, "title", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="Title (e.g., Planning & Research)"
                />
                <input
                  type="text"
                  value={phase.date}
                  onChange={(e) =>
                    updateTimelinePhase(index, "date", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
                  placeholder="Date (e.g., Q1 2024)"
                />
                <select
                  value={phase.status}
                  onChange={(e) =>
                    updateTimelinePhase(index, "status", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
          {formData.timeline.length === 0 && (
            <p className="text-sm text-paragraph dark:text-paragraph text-center py-4">
              No timeline phases added yet. Click "Add Phase" to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
