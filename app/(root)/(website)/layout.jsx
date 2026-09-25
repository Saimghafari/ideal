import Footer from "@/components/Application/Website/Footer";
import Header from "@/components/Application/Website/Header";
import { CurrencyProvider } from "@/components/Application/Website/CurrencyProvider";
import { getRequestCurrency } from "@/lib/getRequestCurrency";
import React from "react";

const layout = async ({ children }) => {
  const currency = await getRequestCurrency();

  return (
    <div>
      <CurrencyProvider currency={currency}>
        <Header />
        <main>{children}</main>
        <Footer />
      </CurrencyProvider>
    </div>
  );
};

export default layout;
