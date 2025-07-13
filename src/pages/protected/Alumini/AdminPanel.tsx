
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  Building,
  GraduationCap,
  BarChart3,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
} from "lucide-react";
import axios from "axios";
import type { AlumniData } from "@/pages/Index";
import { api } from "@/api/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { motion, type Variants } from "framer-motion";

const AdminPanel = () => {
  const [alumniData, setAlumniData] = useState<AlumniData[]>([]);
  const [filteredData, setFilteredData] = useState<AlumniData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${api.ADMIN_BASE_URL}/alumni`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const processedData = response.data.map((alumni: AlumniData) => ({
          ...alumni,
          submittedAt: alumni.createdAt,
        }));
        setAlumniData(processedData);
        setFilteredData(processedData);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch alumni data");
        } else {
          setError("Failed to fetch alumni data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  useEffect(() => {
    const filtered = alumniData.filter((alumni) => {
      const matchesSearch =
        alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "All" || alumni.department === selectedDepartment;
      const matchesYear = selectedYear === "All" || alumni.graduationYear === selectedYear;

      return matchesSearch && matchesDepartment && matchesYear;
    });

    setFilteredData(filtered);
  }, [alumniData, searchTerm, selectedDepartment, selectedYear]);

  const departments = ["All", ...Array.from(new Set(alumniData.map((a) => a.department)))];
  const years = ["All", ...Array.from(new Set(alumniData.map((a) => a.graduationYear))).sort((a, b) =>
    b.localeCompare(a)
  )];

  const deleteAlumni = (id: string) => {
    const updatedData = alumniData.filter((alumni) => alumni.id !== id);
    setAlumniData(updatedData);
    setFilteredData(updatedData);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumni-data.json";
    link.click();
  };


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

  const handleViewAlumni = (alumni: AlumniData) => {
    setSelectedAlumni(alumni);
    setIsSheetOpen(true);
  };

const handleImageClick = (alumni: AlumniData) => {
  // Construct the image URL using the same logic as in the alumni list and sheet
  const imageUrl = alumni.selfieKey
    ? `${api.BASE_URL}/selfie/${alumni.selfieKey}`
    : "/placeholder.svg";
  setSelectedImage(imageUrl);
  setIsImageDialogOpen(true);
};

  // Framer Motion variants for main sections
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Variants for card grids (staggered)
  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for individual cards and items
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Variants for buttons and cards with hover effect
  const interactiveVariants: Variants = {
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
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  // Variants for sheet slide-in
  const sheetVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Variants for sheet content (staggered)
  const sheetContentVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for dialog (image popup)
  const dialogVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-red-600 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-8"
        >
          <h1 className="text-3xl font-bold mb-2">Alumni Administration Panel</h1>
          <p>Manage and view all alumni registrations</p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">Total Alumni</p>
                    <p className="text-2xl font-bold">{alumniData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Departments</p>
                    <p className="text-2xl font-bold">{departments.length - 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm">Graduation Years</p>
                    <p className="text-2xl font-bold">{years.length - 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm">Filtered Results</p>
                    <p className="text-2xl font-bold">{filteredData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Controls */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Search & Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-4 gap-4"
              >
                <motion.div variants={itemVariants} className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div variants={interactiveVariants} whileHover="hover">
                  <Button onClick={exportData} className="flex items-center space-x-2 w-full">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alumni List */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Directory ({filteredData.length} records)</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-12"
                >
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Alumni Found</h3>
                  <p>No alumni records match your current filters.</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredData.map((alumni) => (
                    <motion.div
                      key={alumni.id}
                      variants={interactiveVariants}
                      whileHover="hover"
                      className="hover:shadow-md transition-shadow"
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <motion.img
                              src={
                                alumni.selfieKey
                                  ? `${api.BASE_URL}/selfie/${alumni.selfieKey}`
                                  : "/placeholder.svg"
                              }
                              alt="Profile"
                              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <div>
                                <h3 className="font-semibold">{alumni.name}</h3>
                                <p className="text-sm">{alumni.email}</p>
                                <p className="text-sm">{alumni.phone}</p>
                              </div>
                              <div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  <Badge variant="outline">{alumni.graduationYear}</Badge>
                                  <Badge variant="outline">{alumni.department}</Badge>
                                </div>
                                <p className="text-sm">{alumni.job}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs mb-2">Registered: {formatDate(alumni.createdAt)}</p>
                                <div className="flex justify-end space-x-2">
                                  <motion.div variants={interactiveVariants} whileHover="hover">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewAlumni(alumni)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div variants={interactiveVariants} whileHover="hover">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => deleteAlumni(alumni.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Image Popup Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DialogContent className="sm:max-w-md p-4">
              <DialogHeader>
                <DialogTitle>Profile Image</DialogTitle>
                <DialogClose />
              </DialogHeader>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={selectedImage}
                    alt="Profile"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                </motion.div>
              )}
            </DialogContent>
          </motion.div>
        </Dialog>

        {/* Alumni Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SheetContent className="sm:max-w-4xl overflow-y-auto p-4">
              <SheetHeader>
                <motion.div variants={itemVariants}>
                  <SheetTitle className="flex items-center gap-3">
                    <User className="h-6 w-6" />
                    <span className="text-xl font-semibold">Alumni Details</span>
                  </SheetTitle>
                </motion.div>
              </SheetHeader>

              {selectedAlumni && (
                <motion.div
                  variants={sheetContentVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 space-y-8"
                >
                  {/* Profile Section */}
                  <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <motion.img
                      src={
                        selectedAlumni.selfieKey
                          ? `${api.BASE_URL}/selfie/${selectedAlumni.selfieKey}`
                          : "/placeholder.svg"
                      }
                      alt={selectedAlumni.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-4 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      onClick={() => handleImageClick(selectedAlumni)} // Pass the entire alumni object
                    />

                    <h2 className="text-2xl font-bold">{selectedAlumni.name}</h2>
                    <p>{selectedAlumni.job || "Not specified"}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{selectedAlumni.graduationYear}</Badge>
                      <Badge variant="secondary">{selectedAlumni.department}</Badge>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Contact Information */}
                  <motion.div variants={itemVariants} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span>Contact Information</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Mail className="h-4 w-4" />
                        <div>
                          <p className="text-xs">Email</p>
                          <p>{selectedAlumni.email}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Phone className="h-4 w-4" />
                        <div>
                          <p className="text-xs">Phone</p>
                          <p>{selectedAlumni.phone || "Not specified"}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Professional Information */}
                  <motion.div variants={itemVariants} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-green-500" />
                      <span>Professional Information</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Building className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">Current Company</p>
                          <p>Not specified</p>
                        </div>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Briefcase className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">Current Position</p>
                          <p>{selectedAlumni.job || "Not specified"}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Academic Information */}
                  <motion.div variants={itemVariants} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <GraduationCap className="h-5 w-5 text-purple-500" />
                      <span>Academic Information</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Building className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">Department</p>
                          <p>{selectedAlumni.department}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-xs">Graduation Year</p>
                          <p>{selectedAlumni.graduationYear}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Registration Information */}
                  <motion.div variants={itemVariants} className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span>Registration Information</span>
                    </h3>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 border rounded-md p-3"
                    >
                      <Clock className="h-4 w-4" />
                      <div>
                        <p className="text-xs">Registered On</p>
                        <p>{formatDate(selectedAlumni.createdAt)}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </SheetContent>
          </motion.div>
        </Sheet>
      </div>
    </div>
  );
};

export default AdminPanel;
