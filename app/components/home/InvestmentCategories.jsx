import { categories } from "@/data/categories";

export default function InvestmentCategories() {
  return (
    <section className="py-16 bg-background dark:bg-background-dark text-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl dark:text-background sm:text-5xl font-bold mb-3  ">
            Explore <span className="text-primary">Investment Categories</span>
          </h2>
          <p className="text-paragraph mt-2">
            Discover opportunities across diverse industries and sectors
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-background/10 rounded-2xl shadow-sm p-6 flex flex-col justify-between 
                          hover:shadow-lg hover:-translate-y-1 
                         transition-all duration-300 ease-out"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${cat.bg}`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-paragraph font-medium">
                  {cat.projects}
                </span>
              </div>
              <h3 className="font-semibold text-lg dark:text-background">
                {cat.title}
              </h3>
              <p className="text-paragraph text-sm mb-6">{cat.desc}</p>
              <hr className="border-gray-200 mb-2" />
              <p className="text-sm text-paragraph font-medium">
                Average ROI:{" "}
                <span className="text-yellow-500 font-medium">{cat.roi}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
