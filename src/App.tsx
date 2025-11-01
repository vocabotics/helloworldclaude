import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SnakeGame from '@/components/SnakeGame'

function App() {
  const baseUrl = import.meta.env.BASE_URL || '/'

  return (
    <Router basename={baseUrl}>
      <Routes>
        <Route
          path="/"
          element={<SnakeGame />}
        />
      </Routes>
    </Router>
  )
}

export default App