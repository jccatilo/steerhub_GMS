import Regform from "./components/auth/regform";
import Regcard from "./components/auth/regcard";

export default function Home() {
  return (
    <>
      <div className="relative h-screen w-screen">
        {/* Background Regcard */}
        <div className="absolute inset-0 z-0">
          <Regcard />
        </div>

        <div className="relative flex justify-center items-center h-screen z-10">
          <Regform />
        </div>
      </div>
    </>
  );
}
