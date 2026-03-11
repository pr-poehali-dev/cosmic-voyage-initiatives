import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LinkBioPage } from "./pages/LinkBioPage"
import { SongsPage } from "./pages/SongsPage"
import { SongDetailPage } from "./pages/SongDetailPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LinkBioPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/songs/:id" element={<SongDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App