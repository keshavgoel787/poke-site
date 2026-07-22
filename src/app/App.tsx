import { Navigate, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<main><h1>Keshav Goel</h1></main>} />
      <Route path="/pc/:boxId" element={<div>Keshav's PC</div>} />
      <Route path="/pc/:boxId/:entryId" element={<div>Keshav's PC</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
