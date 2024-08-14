import Adminregform from "@/app/components/admin components/auth/adminregform";
import Adminregcard from "@/app/components/admin components/auth/adminregcard";

export default function login() {
  return (
    <>
      <div className="relative h-screen w-screen">
        {/* Background Regcard */}
        <div className="absolute inset-0 z-0">
          <Adminregcard />
        </div>

        <div className="relative flex justify-center items-center h-screen z-10">
          <Adminregform />
        </div>
      </div>
    </>
  );
}
