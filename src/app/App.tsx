import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { CareerPC } from '../pc/CareerPC';
import { TrainerProfile } from '../profile/TrainerProfile';
import { legacyPcPath } from '../navigation/routes';

function LegacyPcRedirect() {
  const { boxId, entryId } = useParams();

  return <Navigate to={legacyPcPath(boxId, entryId)} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TrainerProfile />} />
      <Route path="/pokemon/:tab" element={<CareerPC />} />
      <Route path="/pokemon/:tab/:entryId" element={<CareerPC />} />
      <Route path="/pc/:boxId" element={<LegacyPcRedirect />} />
      <Route path="/pc/:boxId/:entryId" element={<LegacyPcRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
