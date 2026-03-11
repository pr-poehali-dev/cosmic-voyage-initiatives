import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LinkBioPage } from "./pages/LinkBioPage"
import { SongsPage } from "./pages/SongsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LinkBioPage />} />
        <Route path="/songs" element={<SongsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
