
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { TranslationProvider } from "@/hooks/use-translation";
import { AuthProvider } from "@/hooks/use-auth";
import { ForumProvider } from "@/hooks/use-forum";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ForumCategory from "./pages/ForumCategory";
import TopicView from "./pages/TopicView";
import CreateTopic from "./pages/CreateTopic";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <ForumProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 pt-16 md:pt-20">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<EditProfile />} />
                      <Route path="/forum/:category" element={<ForumCategory />} />
                      <Route path="/topic/:id" element={<TopicView />} />
                      <Route path="/create-topic" element={<CreateTopic />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </ForumProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
