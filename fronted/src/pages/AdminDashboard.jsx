import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  UserCog,
  Clock,
  ClipboardList,
  Building2,
  Settings as PieChart,
  Menu,
  Mail,
  Briefcase,
} from "lucide-react";
import Overview from "./Overview";
import Users from "./Users";
import Roles from "./Roles";
import Departments from "./Departments";
import ExtraHoursAdmi from "./ExtraHoursAdmi";
import Requests from "./Requests";
import authService from "../services/authService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Cargando...",
    email: "",
    role: "",
    department: "",
    position: "",
    avatar: "/api/placeholder/100/100",
    profilePicture: null,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser({
        name: `${currentUser.firstName || ""} ${
          currentUser.lastName || ""
        }`.trim(),
        email: currentUser.email || "",
        role: currentUser.role || "",
        department: currentUser.department || "",
        position: currentUser.position || "",
        avatar: currentUser.profilePictureUrl || "/api/placeholder/100/100",
        profilePicture: currentUser.profilePictureUrl || null,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const tabs = [
    { id: "users", label: "Usuarios", icon: <UsersIcon className="h-4 w-4" /> },
    {
      id: "requests",
      label: "Solicitudes",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      id: "departments",
      label: "Departamentos",
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 w-full sm:w-auto">
          <div className="relative mb-4 sm:mb-0">
            <a href="/profile">
              {/* <img
                src={user.profilePicture || user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover"
              /> */}
            </a>
            <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {user.name}
            </h1>
            <div className="mt-1 mb-2 bg-blue-100 px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 inline-block">
              {user.position}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{user.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block md:hidden mb-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-5 w-5 mr-2" />
          <span>
            {tabs.find((tab) => tab.id === activeTab)?.label || "Menú"}
          </span>
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {menuOpen && (
          <div className="block md:hidden absolute z-10 bg-white shadow-lg rounded-md w-[calc(100%-2rem)] mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center w-full text-left px-4 py-3 border-b border-gray-100 ${
                  activeTab === tab.id ? "bg-blue-50 text-blue-600" : ""
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMenuOpen(false);
                }}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <TabsList className="hidden md:grid grid-cols-7 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
            >
              {tab.icon}
              <span className="hidden lg:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="roles">
          <Roles />
        </TabsContent>
        <TabsContent value="departments">
          <Departments />
        </TabsContent>
        <TabsContent value="extraHoursAdmi">
          <ExtraHoursAdmi />
        </TabsContent>
        <TabsContent value="requests">
          <Requests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
