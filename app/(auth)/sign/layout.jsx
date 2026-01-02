export default function SignLayout({ children }) {
  return (
    <main className="bg-linear-to-b from-soft to-buttons/50 flex flex-col justify-center items-center py-16">
      <div className="overflow-hidden bg-linear-to-b from-primary to-secondary shadow-2xl lg:w-8/10 gap-4 grid lg:grid-cols-2 justify-between p-4 lg:ps-8 rounded-2xl">
        {children}
        <div className="overflow-hidden aspect-[16/17] rounded-2xl hidden lg:block self-center">
          <img
            className="w-full h-full object-cover object-bottom"
            src="/sign-3.jpg"
            alt=""
          />
        </div>
      </div>
    </main>
  );
}
