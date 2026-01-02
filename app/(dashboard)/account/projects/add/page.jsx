"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getProjects } from "@/lib/features/projects/projectsThunks";

// Import step components (we'll create these next)
import StepIndicator from "@/app/components/projects/wizard/StepIndicator";
import BasicInfoStep from "@/app/components/projects/wizard/BasicInfoStep";
import FinancialStep from "@/app/components/projects/wizard/FinancialStep";
import DetailsStep from "@/app/components/projects/wizard/DetailsStep";
import DocumentsStep from "@/app/components/projects/wizard/DocumentsStep";
import ReviewStep from "@/app/components/projects/wizard/ReviewStep";
import ProjectPaymentForm from "@/app/components/payment/ProjectPaymentForm";
// import ProjectPaymentForm from "@/app/components/payment/ProjectPaymentForm";

const STEPS = [
  { id: 1, name: "Basic Info", component: BasicInfoStep },
  { id: 2, name: "Financial", component: FinancialStep },
  { id: 3, name: "Details", component: DetailsStep },
  { id: 4, name: "Documents", component: DocumentsStep },
  { id: 5, name: "Review", component: ReviewStep },
];

export default function AddProjectWizard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    shortDesc: "",
    description: "",
    category: "",
    status: "active",
    imageFile: null,
    imagePreview: null,

    // Step 2: Financial
    totalPrice: "",
    availablePercentage: "",
    expectedROI: "",

    // Step 3: Details
    keyBenefits: [""],
    potentialRisks: [""],
    timeline: [],

    // Step 4: Documents
    documents: [], // { file, title, preview }
  });

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step) => {
    setError(null);

    switch (step) {
      case 1:
        if (
          !formData.title ||
          !formData.shortDesc ||
          !formData.description ||
          !formData.category
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        return true;

      case 2:
        if (!formData.totalPrice || !formData.expectedROI) {
          setError("Please fill in all required financial details");
          return false;
        }
        if (
          formData.availablePercentage &&
          (Number(formData.availablePercentage) < 0 ||
            Number(formData.availablePercentage) > 100)
        ) {
          setError("Available percentage must be between 0-100");
          return false;
        }
        if (
          Number(formData.expectedROI) < 0 ||
          Number(formData.expectedROI) > 100
        ) {
          setError("Expected ROI must be between 0-100");
          return false;
        }
        return true;

      case 3:
        // Optional step - always valid
        return true;

      case 4:
        // Validate documents
        if (formData.documents.length > 3) {
          setError("Maximum 3 documents allowed");
          return false;
        }
        for (const doc of formData.documents) {
          if (!doc.title || !doc.title.trim()) {
            setError("Each document must have a title");
            return false;
          }
          if (doc.file.size > 2 * 1024 * 1024) {
            setError("Each document must be less than 2MB");
            return false;
          }
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 5) {
        // Show payment form
        setShowPayment(true);
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
      window.scrollTo(0, 0);
    } else {
      router.back();
    }
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();

      // Basic info
      data.append("title", formData.title);
      data.append("shortDesc", formData.shortDesc);
      data.append("description", formData.description);
      data.append("category", JSON.stringify({ en: formData.category }));
      data.append("status", formData.status);
      data.append("owner", currentUser._id);

      // Financial
      data.append("totalPrice", Number(formData.totalPrice));
      data.append("expectedROI", Number(formData.expectedROI));
      if (formData.availablePercentage) {
        data.append(
          "availablePercentage",
          Number(formData.availablePercentage)
        );
      }

      // Details
      const benefits = formData.keyBenefits.filter((b) => b.trim());
      const risks = formData.potentialRisks.filter((r) => r.trim());

      if (benefits.length > 0) {
        data.append("keyBenefits", JSON.stringify(benefits));
      }
      if (risks.length > 0) {
        data.append("potentialRisks", JSON.stringify(risks));
      }
      if (formData.timeline.length > 0) {
        data.append("timeline", JSON.stringify(formData.timeline));
      }

      // Image
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      // Documents
      if (formData.documents.length > 0) {
        const docTitles = formData.documents.map((d) => d.title);
        data.append("documentTitles", JSON.stringify(docTitles));

        formData.documents.forEach((doc) => {
          data.append("documents", doc.file);
        });
      }

      const response = await api.post("/projects/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(getProjects());
      toast.success("Project created successfully!");
      router.push(`/projects/${response.data.newProjectId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
      toast.error(err.response?.data?.message || "Failed to create project");
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  if (showPayment) {
    return (
      <ProjectPaymentForm
        onSubmit={handlePaymentSuccess}
        onBack={() => setShowPayment(false)}
        loading={loading}
        errors={error ? { general: error } : {}}
        projectData={formData}
      />
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading dark:text-background mb-2">
            Add New Project
          </h1>
          <p className="text-paragraph dark:text-paragraph">
            Complete all steps to list your project
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg flex items-start gap-3">
            <AlertCircle
              className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-300 font-medium">
                Error
              </p>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-background/10 rounded-lg shadow-md dark:shadow-none p-6 border border-gray-200 dark:border-0 mb-6">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={error}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-background/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {currentStep === 5 ? "Proceed to Payment" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
