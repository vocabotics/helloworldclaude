import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HelloWorldDisplay from '@/components/HelloWorldDisplay'
import SimpleLayout from '@/components/SimpleLayout'
import BackgroundPattern from '@/components/BackgroundPattern'

function App() {
  const baseUrl = import.meta.env.BASE_URL || '/'
  
  return (
    <Router basename={baseUrl}>
      <BackgroundPattern />
      <Routes>
        <Route 
          path="/" 
          element={
            <SimpleLayout>
              <div className="text-center space-y-8">
                <HelloWorldDisplay 
                  variant="gradient" 
                  animated={true}
                  size="large"
                />
                <div className="max-w-md mx-auto">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    A simple, clean implementation of the classic "Hello World" message.
                  </p>
                </div>
              </div>
            </SimpleLayout>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App