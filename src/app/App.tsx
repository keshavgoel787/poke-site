import { Navigate, Route, Routes } from 'react-router-dom';
import { CareerPC } from '../pc/CareerPC';
import { TrainerProfile } from '../profile/TrainerProfile';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TrainerProfile />} />
      <Route path="/pc/:boxId" element={<CareerPC />} />
      <Route path="/pc/:boxId/:entryId" element={<CareerPC />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
