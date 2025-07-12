// stores/useAlumniStore.ts
import { create } from 'zustand';

type AlumniFormData = {
  name: string;
  email: string;
  phone: string;
  graduationYear: string;
  department: string;
  currentJob: string;
};

type AlumniState = {
  selfie: string | null; // base64
  formData: Partial<AlumniFormData>;
  setSelfie: (img: string) => void;
  setFormData: (data: Partial<AlumniFormData>) => void;
  reset: () => void;
};

export const useAlumniStore = create<AlumniState>((set) => ({
  selfie: null,
  formData: {},
  setSelfie: (img) => set({ selfie: img }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ selfie: null, formData: {} }),
}));
