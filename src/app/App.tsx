import { Navigate, Route, Routes } from 'react-router-dom';
import { TrainerProfile } from '../profile/TrainerProfile';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TrainerProfile />} />
      <Route path="/pc/:boxId" element={<div>Keshav's PC</div>} />
      <Route path="/pc/:boxId/:entryId" element={<div>Keshav's PC</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
