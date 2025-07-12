import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck } from "lucide-react";

import { useAlumniStore } from "@/global/useAlumniStore";
import { api } from "@/api/api";
import { toast } from "sonner";

interface AlumniFormProps {
  mode?: string;
}

const currentYear = new Date().getFullYear();
const alumniSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required").max(15),
  graduationYear: z.string().refine(
    (yr) => {
      const num = Number(yr);
      return num >= currentYear - 49 && num <= currentYear;
    },
    { message: "Please select a valid year" }
  ),
  department: z.string().min(1, "Department is required"),
  job: z.string().min(1, "Current job info is required"),
});

type FormData = z.infer<typeof alumniSchema>;

const AlumniForm: React.FC<AlumniFormProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { selfie, setSelfie, reset } = useAlumniStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(alumniSchema) });

  // Prefill form if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${api.BASE_URL}/profile/${id}`)
        .then((response) => {
          const data = response.data;
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("phone", data.phone);
          setValue("graduationYear", data.graduationYear);
          setValue("department", data.department);
          setValue("job", data.job);
          setSelfie(data.selfieUrl);
        })
        .catch((err) => {
          console.error("Failed to load profile", err);
          alert("Unable to load alumni data.");
        });
    }
  }, [id, setValue, setSelfie]);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));

      // Include selfie if available
      if (selfie) {
        const blob = await (await fetch(selfie)).blob();
        const selfieFile = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        formData.append("selfie", selfieFile);
      } else if (!id) {
        // Selfie is required only for registration
        alert("Please capture or upload your selfie first.");
        setIsSubmitting(false);
        return;
      }

      const endpoint = id ? `${api.BASE_URL}/profile/${id}` : `${api.BASE_URL}/register`;
      const method = id ? axios.put : axios.post;

      const response = await method(endpoint, formData);

      toast.success(
        id ? "Profile updated successfully!" : "Registration completed successfully!"
      );
      navigate(`/alumni/${response.data.id || id}`);
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert("❌ " + (err.response?.data?.error || err.message || "Unknown Error"));
      } else if (err instanceof Error) {
        alert("❌ " + err.message);
      } else {
        alert("❌ Unknown Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const departments = [
    "MCA",
    "MSC",
    "DS",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <UserCheck className="h-8 w-8 text-blue-600" />
            <span>{id ? "Edit Alumni Profile" : "Alumni Registration"}</span>
          </CardTitle>
          <p className="text-gray-600">
            {id
              ? "Update your alumni profile details below."
              : "Please provide your details to complete your alumni profile."}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input {...register("name")} id="name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" {...register("email")} id="email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input {...register("phone")} id="phone" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Select
                onValueChange={(v) => setValue("graduationYear", v, { shouldValidate: true })}
                defaultValue={id ? undefined : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.graduationYear && (
                <p className="text-red-500 text-sm">{errors.graduationYear.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                onValueChange={(v) => setValue("department", v, { shouldValidate: true })}
                defaultValue={id ? undefined : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department.message}</p>
              )}
            </div>

            {/* Current Job */}
            <div className="space-y-2">
              <Label htmlFor="job">Current Job Title & Company</Label>
              <Textarea rows={3} {...register("job")} id="job" />
              {errors.job && (
                <p className="text-red-500 text-sm">{errors.job.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Profile"
                : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniForm;