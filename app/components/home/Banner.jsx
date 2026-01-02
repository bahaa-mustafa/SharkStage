import styles from "./Banner.module.css";
function Banner() {
  const words = [
    "Investment",
    "Growth",
    "Trust",
    "Innovation",
    "Opportunity",
    "Success",
    "Partnership",
    "Security",
  ];
  return (
    <section className="w-full overflow-hidden bg-linear-to-r from-primary to-buttons dark:from-primary-dark dark:to-buttons-dark">
      <div className=" py-8 text-background dark:text-background w-[1600px] overflow-hidden relative">
        <div className={`${styles.first} flex justify-around`}>
          {words.map((ele, index) => (
            <span key={index} className="mx-8 text-2xl font-semibold">
              {ele}
            </span>
          ))}
        </div>
        <div
          className={`${styles.second} flex justify-around left-full items-center absolute inset-0 w-full h-full`}
        >
          {words.map((ele, index) => (
            <span key={index} className="mx-8 text-2xl font-semibold">
              {ele}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
