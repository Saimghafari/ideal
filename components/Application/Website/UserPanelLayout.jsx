import React from "react";
import UserPanelNavigation from "./UserPanelNavigation";

const UserPanelLayout = ({ children }) => {
  return (
    <div className="nn-cream-bg">
      <div className="flex flex-col gap-10 px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-12 lg:flex-row lg:gap-14 lg:px-28 xl:gap-16 xl:px-36">
        <aside className="w-full shrink-0 lg:w-56 xl:w-64">
          <UserPanelNavigation />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default UserPanelLayout;
