import AppSidebar from "@/components/Application/Admin/AppSidebar";
import ThemeProvider from "@/components/Application/Admin/ThemeProvider";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className="admin-portal">
        <AppSidebar />
        <main className="min-h-screen w-full bg-background text-foreground md:w-[calc(100vw-16rem)] overflow-x-hidden">
          <div className="min-h-[calc(100vh-40px)] bg-background px-5 pb-10 pt-20 md:px-8">
            <Topbar />
            {children}
          </div>

          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            © {new Date().getFullYear()} Super Ideal. All Rights Reserved.
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default layout;
