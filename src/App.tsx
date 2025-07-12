
import { Routes, Route } from "react-router";
import Index from "./pages/Index";
import UserProfile from "./pages/protected/Alumini/UserProfile";
import AlumniForm from "./pages/protected/Alumini/AluminiForm";


const App = () => (


  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/alumni/:id" element={<UserProfile  />} />
     <Route path="/alumni/edit/:id" element={<AlumniForm mode="edit" />} />
  </Routes>


);

export default App;
