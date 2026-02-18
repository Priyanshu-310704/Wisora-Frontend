import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProfilePage from './pages/ProfilePage';
import TopicsPage from './pages/TopicsPage';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex gap-6">
              <Sidebar />
              <main className="flex-1 min-w-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/ask" element={<AskQuestionPage />} />
                  <Route path="/question/:id" element={<QuestionDetailPage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/topics" element={<TopicsPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}
