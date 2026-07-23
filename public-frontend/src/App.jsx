import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BlockRenderer from './components/BlockRenderer';
import './index.css';

const PageView = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const currentSlug = slug || 'home';
        const res = await axios.get(`http://localhost:5000/api/pages/${currentSlug}`);
        setPageData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('404: The page you are looking for does not exist.');
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <div className="container" style={{ marginTop: '3rem' }}>Loading content...</div>;
  if (error) return <div className="container" style={{ color: 'red', marginTop: '3rem' }}>{error}</div>;
  if (!pageData) return null;

  return (
    <div>
      <header style={{ background: '#111', color: '#fff', padding: '2rem 1rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{pageData.title}</h1>
      </header>
      <main>
        <BlockRenderer blocks={pageData.blocks} />
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PageView />} />
      <Route path="/:slug" element={<PageView />} />
    </Routes>
  </Router>
);

export default App;