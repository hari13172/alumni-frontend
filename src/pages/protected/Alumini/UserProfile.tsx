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
  Edit,
} from "lucide-react";
import type { AlumniData } from "@/pages/Index";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "@/api/api";
import axios from "axios";
import { motion, type Variants } from "framer-motion";

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
    createdAt: new Date(),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${api.BASE_URL}/profile/${id}`);
        setUserData({
          ...response.data,
          submittedAt: response.data.submittedAt || response.data.createdAt,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  // Framer Motion variants for the main profile card
  const profileCardVariants: Variants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut", // Valid easing function
      },
    },
  };

  // Variants for the card content sections (staggered)
  const contentVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for individual items (e.g., contact and academic info)
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut", // Valid easing function
      },
    },
  };

  // Variants for additional action cards (with hover effect)
  const actionCardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          variants={profileCardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Profile Data
              </h3>
              <p className="text-gray-500">
                Please complete the registration process first.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }


const formatDate = (date: Date | string | undefined) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }
  try {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", // ✅ Convert to IST
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Optional: show AM/PM format
    });
  } catch (e) {
    console.error("Date parsing error:", e, "Input:", date);
    return "N/A";
  }
};



  const handleEditProfile = () => {
    navigate(`/alumni/edit/${id}`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center py-8"
        >
          <h1 className="text-3xl font-bold mb-2">Alumni Profile</h1>
          <p className="text-gray-600">Your registered details and information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={profileCardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-6"
              >
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <motion.img
                    src={userData.selfieUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-2">
                    {userData.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      Class of {userData.graduationYear}
                    </Badge>
                    <Badge variant="secondary">{userData.department}</Badge>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEditProfile}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="p-6">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Contact Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center space-x-3"
                    >
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center space-x-3"
                    >
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm">Phone</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Academic & Professional Info */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Academic & Professional
                  </h3>
                  <div className="space-y-3">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-start space-x-3"
                    >
                      <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm">Graduation Year</p>
                        <p className="font-medium">{userData.graduationYear}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-start space-x-3"
                    >
                      <Building className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm">Department</p>
                        <p className="font-medium">{userData.department}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-start space-x-3"
                    >
                      <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm">Current Position</p>
                        <p className="font-medium">{userData.job}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Registration Details */}
              <motion.div
                variants={itemVariants}
                className="mt-6 pt-6 border-t"
              >
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Registered on {formatDate(userData.createdAt)}</span>
                  <span>•</span>
                  <span>Profile ID: {userData.id}</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-4"
        >
          <motion.div
            variants={actionCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card className="p-6 text-center cursor-pointer">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Connect with Alumni</h3>
                <p className="text-sm">Find and connect with fellow graduates</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            variants={actionCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card className="p-6 text-center cursor-pointer">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Upcoming Events</h3>
                <p className="text-sm">Stay updated with alumni events</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            variants={actionCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card className="p-6 text-center cursor-pointer">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Career Services</h3>
                <p className="text-sm text-gray-600">
                  Access career opportunities
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;