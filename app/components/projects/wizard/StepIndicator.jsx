import { CheckCircle2 } from "lucide-react";

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep > step.id
                    ? "bg-green-500 dark:bg-green-600 text-white"
                    : currentStep === step.id
                    ? "bg-primary dark:bg-primary-dark text-white"
                    : "bg-gray-200 dark:bg-background/20 text-gray-500 dark:text-paragraph"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  step.id
                )}
              </div>
              <p
                className={`text-xs mt-2 font-medium hidden sm:block ${
                  currentStep >= step.id
                    ? "text-heading dark:text-background"
                    : "text-paragraph dark:text-paragraph"
                }`}
              >
                {step.name}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2">
                <div
                  className={`h-full rounded transition-all ${
                    currentStep > step.id
                      ? "bg-green-500 dark:bg-green-600"
                      : "bg-gray-200 dark:bg-background/20"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
