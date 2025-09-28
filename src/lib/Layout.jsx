// src/lib/Layout.js
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { BarChart3, Users, Target, Activity as ActivityIcon, Settings, Bell, Search } from "lucide-react";

/* NOTE: these imports assume you have shadcn-style UI components available at these paths.
   If your project uses different casing (components vs components) or different paths,
   change the imports below accordingly. */
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Activities", url: "/activities", icon: ActivityIcon },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div
      style={{
        "--primary": "30 64 175",
        "--primary-foreground": "255 255 255",
        "--secondary": "5 150 105",
        "--secondary-foreground": "255 255 255",
        "--accent": "234 88 12",
        "--accent-foreground": "255 255 255",
      }}
    >
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-slate-50">
          <Sidebar className="border-r border-slate-200 bg-white">
            <SidebarHeader className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">SalesAI</h2>
                  <p className="text-xs text-slate-500 font-medium">Smart CRM Assistant</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url ? "bg-blue-50 text-blue-700 shadow-sm" : ""
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-slate-600">Active Leads</span>
                      <span className="ml-auto font-bold text-slate-900">24</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-slate-600">This Month</span>
                      <span className="ml-auto font-bold text-green-600">+18%</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-slate-600">Conversion</span>
                      <span className="ml-auto font-bold text-slate-900">32%</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-slate-700 font-semibold text-sm">SR</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">Sales Rep</p>
                  <p className="text-xs text-slate-500 truncate">Quota: 87% achieved</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200 md:hidden" />
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search leads, companies..." className="pl-10 bg-slate-50 border-slate-200 focus:bg-white" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <Bell className="w-5 h-5 text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                    <Settings className="w-5 h-5 text-slate-600" />
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-slate-50">
              {/* Render the active child route here */}
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
