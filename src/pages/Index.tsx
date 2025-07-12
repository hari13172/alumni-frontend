import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Settings } from "lucide-react";
import VideoIntro from "./protected/Alumini/VideoIntro";
import SelfieCapture from "./protected/Alumini/SelfieCapture";
import AlumniForm from "./protected/Alumini/AluminiForm";
import UserProfile from "./protected/Alumini/UserProfile";
import AdminPanel from "./protected/Alumini/AdminPanel";
import AdminLogin from "./protected/Alumini/AdminLogin";

export type AlumniData = {
  id: string;
  name: string;
  email: string;
  graduationYear: string;
  department: string;
  currentJob: string;
  phone: string;
  selfieUrl: string;
  submittedAt: Date;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'video' | 'selfie' | 'form' | 'profile' | 'admin' | 'adminLogin'>('video');
  const [userSelfie, setUserSelfie] = useState<string>("");
  const [userData, setUserData] = useState<AlumniData | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleVideoComplete = () => {
    setCurrentStep('selfie');
  };

  const handleSelfieCapture = (selfieDataUrl: string) => {
    setUserSelfie(selfieDataUrl);
    setCurrentStep('form');
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setCurrentStep('admin');
    }
  };

  const handleAdminLoginCancel = () => {
    setCurrentStep(userData ? 'profile' : 'video');
  };

  const handleAdminPanelClick = () => {
    if (isAdminAuthenticated) {
      setCurrentStep('admin');
    } else {
      setCurrentStep('adminLogin');
    }
  };




  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'video':
        return <VideoIntro onComplete={handleVideoComplete} />;
      case 'selfie':
        return <SelfieCapture onCapture={handleSelfieCapture} />;
      case 'form':
        return <AlumniForm />;
      case 'profile':
        return <UserProfile />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleAdminLogin} onCancel={handleAdminLoginCancel} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <VideoIntro onComplete={handleVideoComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      {currentStep !== 'video' && currentStep !== 'adminLogin' && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Alumni Portal</h1>
              </div>

              <div className="flex space-x-4">
                {userData && (
                  <Button
                    variant={currentStep === 'profile' ? 'default' : 'outline'}
                    onClick={() => setCurrentStep('profile')}
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>My Profile</span>
                  </Button>
                )}

                <Button
                  variant={currentStep === 'admin' ? 'default' : 'outline'}
                  onClick={handleAdminPanelClick}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default Index;
