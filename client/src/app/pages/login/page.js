import Userlogin from "@/app/components/login/userlogin";
import Userbg from "@/app/components/login/userbg";

export default function Home() {
  return (
    <>
      <div className="relative h-screen w-screen">
        {/* Background Regcard */}
        <div className="absolute inset-0 z-0">
          <Userbg />
        </div>

        <div className="relative flex justify-center items-center h-screen z-10">
          <Userlogin />
        </div>
      </div>
    </>
  );
}
