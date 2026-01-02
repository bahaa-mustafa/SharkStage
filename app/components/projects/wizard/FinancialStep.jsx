export default function FinancialStep({
  formData,
  updateFormData,
  maxAvailablePercentage = 100,
  isEdit = false,
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-heading dark:text-background mb-4">
        Financial Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-background">
            Total Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.totalPrice}
            onChange={(e) => updateFormData({ totalPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
            placeholder="0.00"
          />
        </div>

        {/* Available Percentage */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-background">
            Available % (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            max={maxAvailablePercentage}
            value={formData.availablePercentage}
            onChange={(e) =>
              updateFormData({ availablePercentage: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
            placeholder={`0-${maxAvailablePercentage.toFixed(2)}`}
          />
          <p className="text-xs text-paragraph dark:text-paragraph">
            {isEdit && maxAvailablePercentage < 100
              ? `Max ${maxAvailablePercentage.toFixed(2)}% (${(
                  100 - maxAvailablePercentage
                ).toFixed(2)}% invested)`
              : "Percentage available for investment"}
          </p>
        </div>

        {/* Expected ROI */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-background">
            Expected ROI (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.expectedROI}
            onChange={(e) => updateFormData({ expectedROI: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
            placeholder="0-100"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
        <h3 className="font-semibold text-heading dark:text-background mb-2">
          Financial Information
        </h3>
        <ul className="space-y-1 text-sm text-paragraph dark:text-paragraph">
          <li>
            • <strong>Total Price:</strong> The total valuation of your project
          </li>
          <li>
            • <strong>Available %:</strong> What percentage is available for
            investors (optional)
          </li>
          <li>
            • <strong>Expected ROI:</strong> Projected return on investment
            percentage
          </li>
        </ul>
      </div>
    </div>
  );
}
