import { useAlumniStore } from "@/global/useAlumniStore";
import SelfieCapture from "./SelfieCapture";
import AlumniForm from "./AluminiForm";


const AlumniRegister = () => {
  const selfie = useAlumniStore((s) => s.selfie);

  return (
    <div>
      {!selfie && <SelfieCapture onCapture={() => {}} />}
      {selfie && <AlumniForm mode="create"/>}
    </div>
  );
};

export default AlumniRegister;
