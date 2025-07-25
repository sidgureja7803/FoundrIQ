import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IdeaSubmissionPage from './pages/IdeaSubmissionPage';
import ResultsDashboardPage from './pages/ResultsDashboardPage';
import ReportPage from './pages/ReportPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<IdeaSubmissionPage />} />
          <Route path="/results/:analysisId" element={<ResultsDashboardPage />} />
          <Route path="/report/:analysisId" element={<ReportPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
