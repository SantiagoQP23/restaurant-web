import { SignupForm } from "../components/signup-form.component";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src="/logo.svg" alt="" className="size-6" />
            Teikio
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/logo.svg"
          alt="Teikio"
          className="absolute inset-0 m-auto size-48"
        />
      </div>
    </div>
  );
}
