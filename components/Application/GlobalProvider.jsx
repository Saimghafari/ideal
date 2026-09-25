"use client";

import { persistor, store } from "@/store/store";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import Loading from "./Loading";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import AuthSessionSync from "./AuthSessionSync";

const queryClient = new QueryClient();

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

const GlobalProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading />}>
          <AuthSessionSync />
          {children}
        </PersistGate>
      </Provider>
      {process.env.NODE_ENV === "development" ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  );
};

export default GlobalProvider;
