import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LanguageHome from './pages/LanguageHome';
import Vocab from './pages/Vocab';
import Grammar from './pages/Grammar';
import Quiz from './pages/Quiz';
import Lesson from './pages/Lesson';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="learn/:lang" element={<LanguageHome />} />
        <Route path="learn/:lang/vocab" element={<Vocab />} />
        <Route path="learn/:lang/grammar" element={<Grammar />} />
        <Route path="learn/:lang/grammar/:lessonId" element={<Grammar />} />
        <Route path="learn/:lang/quiz" element={<Quiz />} />
        <Route path="learn/:lang/lesson/:theme" element={<Lesson />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
