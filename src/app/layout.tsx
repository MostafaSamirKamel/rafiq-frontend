import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { cookies } from "next/headers";
import { authAPI } from "@/services/apiClient";
import { AuthInit } from "@/lib/store/AuthInit";

export const metadata: Metadata = {
  title: "رفيق - منصة علاجية ذكية للأطفال",
  description: "منصة علاجية تعتمد على الذكاء الاصطناعي لمساعدة الأطفال على تطوير المهارات الاجتماعية والتواصل",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rafiq_token')?.value;
  let initialUser = null;

  if (token) {
    try {
      const user = await authAPI.getMe(token);
      initialUser = { user, token };
    } catch (error) {
      console.error('Failed to prefetch user for hydration:', error);
    }
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased" suppressHydrationWarning>
        <StoreProvider>
          <AuthInit initialUser={initialUser}>
            {children}
          </AuthInit>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={true}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
          />
        </StoreProvider>
      </body>
    </html>
  );
}
