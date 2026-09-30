import React from "react";
import UserPanelNavigation from "./UserPanelNavigation";

const UserPanelLayout = ({ children }) => {
  return (
    <div className="bg-[#FFF8F2] font-ui text-[#3a2416]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-start lg:gap-8 lg:py-10 xl:px-10">
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-60">
          <UserPanelNavigation />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default UserPanelLayout;
