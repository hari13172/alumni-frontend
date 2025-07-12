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
  BarChart3
} from "lucide-react";
import type { AlumniData } from "@/pages/Index";


const AdminPanel = () => {
  const [alumniData, setAlumniData] = useState<AlumniData[]>([]);
  const [filteredData, setFilteredData] = useState<AlumniData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    // Load data from localStorage
    const data = JSON.parse(localStorage.getItem('alumniData') || '[]');
    setAlumniData(data);
    setFilteredData(data);
  }, []);

  useEffect(() => {
    // Filter data based on search and filters
    const filtered = alumniData.filter(alumni => {
      const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alumni.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === "All" || alumni.department === selectedDepartment;
      const matchesYear = selectedYear === "All" || alumni.graduationYear === selectedYear;
      
      return matchesSearch && matchesDepartment && matchesYear;
    });
    
    setFilteredData(filtered);
  }, [alumniData, searchTerm, selectedDepartment, selectedYear]);

  const departments = ["All", ...Array.from(new Set(alumniData.map(a => a.department)))];
  const years = ["All", ...Array.from(new Set(alumniData.map(a => a.graduationYear))).sort((a, b) => b.localeCompare(a))];

  const deleteAlumni = (id: string) => {
    const updatedData = alumniData.filter(alumni => alumni.id !== id);
    setAlumniData(updatedData);
    localStorage.setItem('alumniData', JSON.stringify(updatedData));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alumni-data.json';
    link.click();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Statistics
  const totalAlumni = alumniData.length;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Administration Panel</h1>
          <p className="text-gray-600">Manage and view all alumni registrations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Alumni</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAlumni}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Graduation Years</p>
                  <p className="text-2xl font-bold text-gray-900">{years.length - 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Filtered Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <Button onClick={exportData} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alumni List */}
        <Card>
          <CardHeader>
            <CardTitle>Alumni Directory ({filteredData.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Alumni Found</h3>
                <p className="text-gray-500">No alumni records match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((alumni) => (
                  <Card key={alumni.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Profile Picture */}
                        <img
                          src={alumni.selfieUrl}
                          alt={alumni.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        
                        {/* Main Info */}
                        <div className="flex-1 grid md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{alumni.name}</h3>
                            <p className="text-sm text-gray-600">{alumni.email}</p>
                            <p className="text-sm text-gray-600">{alumni.phone}</p>
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              <Badge variant="outline">{alumni.graduationYear}</Badge>
                              <Badge variant="outline">{alumni.department}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{alumni.currentJob}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-2">
                              Registered: {formatDate(alumni.submittedAt)}
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteAlumni(alumni.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;