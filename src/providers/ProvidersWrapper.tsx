import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/auth/providers/JWTProvider";
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider,
} from "@/providers";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client";
import {
  client,
  setLogoutCallback,
  setOpenModalCallback,
} from "@/services/connection";

const queryClient = new QueryClient();

// ====================================================================
// 🚪 Callback central de logout (executado quando JWT expira)
// ====================================================================
setLogoutCallback(async () => {
  if ((window as any)._isLoggingOut) return;
  (window as any)._isLoggingOut = true;

  console.warn("🚪 [LOGOUT] Sessão expirada — limpando dados e redirecionando...");

  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include", // ✅ garante envio do cookie a ser limpo
    });
  } catch (err) {
    console.warn("⚠️ [LOGOUT] Erro ao limpar cookie JWT:", err);
  }

  localStorage.clear();
  sessionStorage.clear();

  if (window.location.pathname !== "/auth/login") {
    window.location.replace("/auth/login");
  }

  setTimeout(() => ((window as any)._isLoggingOut = false), 2000);
});

setOpenModalCallback(() => {
  alert("⚠️ Sua sessão expirou. Faça login novamente para continuar.");
});

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SettingsProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <SnackbarProvider>
                      <MenusProvider>{children}</MenusProvider>
                    </SnackbarProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export { ProvidersWrapper };
