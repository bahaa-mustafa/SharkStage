import EastIcon from "@mui/icons-material/East";
import Quote from "../Quote";
import styles from "./Hero.module.css";
function Hero() {
  return (
    <section
      className={`${styles.welcome} transform-gpu relative z-[5] sm:ps-[5%] max-sm:pt-30 max-lg:pt-28  pb-32 bg-linear-to-br from-primary to-secondary dark:to-heading`}
    >
      <div className="max-sm:w-9/10 max-sm:mx-auto max-sm:flex-col flex justify-between items-center sm:items-end ">
        <div className="content sm:w-10/19 lg:w-7/12 flex flex-col  gap-6 items-center">
          <h1 className=" text-center text-5xl lg:pt-28 lg:text-7xl font-bold lg:font-extrabold text-background dark:text-background">
            Invest in the Future of Innovation
          </h1>
          <p className="text-xl lg:text-2xl text-center font-light text-background dark:text-background">
            A marketplace where visionary projects meet strategic investors
          </p>
          <div className="btn_grop flex gap-8 text-primary dark:text-primary-dark font-semibold">
            <button className="cursor-pointer  bg-buttons dark:bg-buttons-dark transition-shadow duration-300 shadow-lg hover:shadow-black/20 dark:hover:shadow-white/10  px-3 py-2  rounded-lg">
              Start Investing <EastIcon />
            </button>
            <button className="bg-background/80 dark:bg-background/20 cursor-pointer backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-black/20 dark:hover:shadow-white/10  transition">
              List your project
            </button>
          </div>
          <div className="flex justify-between max-lg:flex-col max-lg:justify-center max-lg:gap-4">
            <Quote
              pic="/elon.jpg"
              name="Elon Musk"
              para="When something is important enough, you do it even if the odds are not in your favor."
            />
            <Quote
              pic="/jeff.jpg"
              name="Jeff Bezos"
              para="What we need to do is always lean into the future; when the world changes around you and when it changes against you."
            />
          </div>
        </div>
        <div className="overflow-hidden max-sm:hidden max-lg:w-8/19 w-5/12 max-sm:rounded-none max-lg:rounded-s-full rounded-bl-full self-center lg:self-start">
          <img className="w-full" src="/startup-edited.jpg" alt="" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
