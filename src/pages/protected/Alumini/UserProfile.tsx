import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  Briefcase, 
  Clock,
  Edit
} from "lucide-react";
import type { AlumniData } from "@/pages/Index";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "@/api/api";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<AlumniData>({
    id: "",
    name: "",
    email: "",
    graduationYear: "",
    department: "",
    job: "",
    phone: "",
    selfieUrl: "",
    submittedAt: new Date(),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${api.BASE_URL}/profile/${id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Profile Data</h3>
            <p className="text-gray-500">Please complete the registration process first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEditProfile = () => {
    navigate(`/alumni/edit/${id}`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Profile</h1>
          <p className="text-gray-600">Your registered details and information</p>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src={userData.selfieUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-2">
                  {userData.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white text-blue-600">
                    Class of {userData.graduationYear}
                  </Badge>
                  <Badge variant="secondary" className="bg-white text-blue-600">
                    {userData.department}
                  </Badge>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0">
                <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic & Professional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Academic & Professional
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Graduation Year</p>
                      <p className="font-medium">{userData.graduationYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{userData.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Current Position</p>
                      <p className="font-medium">{userData.job}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Registered on {formatDate(userData.submittedAt)}</span>
                <span>•</span>
                <span>Profile ID: {userData.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Connect with Alumni</h3>
              <p className="text-sm text-gray-600">Find and connect with fellow graduates</p>
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Upcoming Events</h3>
              <p className="text-sm text-gray-600">Stay updated with alumni events</p>
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Career Services</h3>
              <p className="text-sm text-gray-600">Access career opportunities</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;