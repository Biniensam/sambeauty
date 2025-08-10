"use client";

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#be185d", // Pink color matching your theme
          colorText: "#111827",
          colorBackground: "#ffffff",
          colorInputBackground: "#f9fafb",
          colorInputText: "#111827",
        },
        elements: {
          formButtonPrimary: "bg-pink-600 hover:bg-pink-700 text-white",
          card: "bg-white border border-pink-200",
          headerTitle: "text-pink-700",
          headerSubtitle: "text-gray-600",
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
