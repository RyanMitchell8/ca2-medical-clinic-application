import { useEffect } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import {
  IconUsers,
  IconDashboard,
  IconStethoscope,
  IconCalendarClock,
  IconPillFilled,
  IconReportMedical,
  IconInnerShadowTop,
} from "@tabler/icons-react";

import { useAuth } from "@/hooks/useAuth";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sidebar navigation items
const navItems = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Doctors", url: "/doctors", icon: IconStethoscope },
  { title: "Patients", url: "/patients", icon: IconUsers },
  { title: "Appointments", url: "/appointments", icon: IconCalendarClock },
  { title: "Diagnoses", url: "/diagnoses", icon: IconReportMedical },
  { title: "Prescriptions", url: "/prescriptions", icon: IconPillFilled },
];

export function AppSidebar(props) {
  const location = useLocation();
  const { user } = useAuth(); // ← REAL USER DATA

  console.log("AUTH USER:", user);

  const message = location.state?.message;
  const type = location.state?.type;

  // Show toast messages from navigation
  useEffect(() => {
    if (!message) return;

    if (type === "error") toast.error(message);
    else if (type === "success") toast.success(message);
    else toast(message);
  }, [message, type]);

  // Fallback user display
  const sidebarUser = {
    name: user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.name || "Unknown User",

    email: user?.email || "No email provided",
    avatar: user?.avatar || "/avatars/default.png",
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                <a href="/" className="flex items-center gap-2">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">The Grand Medical Clinic</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={sidebarUser} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
