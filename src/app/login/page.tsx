import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول - TUNREPLAY",
  description: "تسجيل الدخول إلى حسابك في TUNREPLAY",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          تسجيل الدخول
        </h1>
        <p className="text-gray-400 text-center mb-8">
          أدخل بريدك الإلكتروني وكلمة المرور
        </p>
        <LoginForm allowSignup={false} />
      </div>
    </main>
  );
}
