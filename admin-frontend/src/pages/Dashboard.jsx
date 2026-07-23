import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Extract the JWT token from the Redux store
  const token = useSelector((state) => state.auth.token);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState('');

  // Add a new empty block to the array
  const addBlock = (type) => {
    const newBlock = {
      _id: Date.now().toString(), // Temporary unique ID for React mapping
      type,
      data: type === 'equation' ? { equation: '', displayMode: true } : { text: '' },
      order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update specific data inside a block
  const updateBlockData = (index, key, value) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].data[key] = value;
    setBlocks(updatedBlocks);
  };

  // Submit the payload to the PostgreSQL database
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/pages',
        { title, slug, blocks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('Page saved successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Error saving page.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>CMS Dashboard</h1>
        <button className="btn" onClick={() => dispatch(logout())}>Logout</button>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Page Builder</h2>
        {status && <p style={{ color: status.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{status}</p>}
        
        <input 
          type="text" 
          placeholder="Page Title (e.g., Welcome to TechCorp)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ padding: '0.75rem', fontSize: '1rem' }}
        />
        <input 
          type="text" 
          placeholder="Page Slug (e.g., home, about-us)" 
          value={slug} 
          onChange={e => setSlug(e.target.value)} 
          required 
          style={{ padding: '0.75rem', fontSize: '1rem' }}
        />

        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          <button type="button" className="btn" onClick={() => addBlock('header')}>+ Add Header</button>
          <button type="button" className="btn" onClick={() => addBlock('paragraph')}>+ Add Paragraph</button>
          <button type="button" className="btn" onClick={() => addBlock('equation')}>+ Add Math Equation</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {blocks.map((block, index) => (
            <div key={block._id} style={{ border: '1px solid #ccc', padding: '1rem', background: '#f9f9f9' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{block.type} BLOCK (Order: {block.order})</h4>
              
              {block.type === 'header' || block.type === 'paragraph' ? (
                <textarea 
                  value={block.data.text} 
                  onChange={(e) => updateBlockData(index, 'text', e.target.value)} 
                  style={{ width: '100%', minHeight: '80px', padding: '0.5rem' }} 
                  placeholder={`Enter your ${block.type} text here...`}
                />
              ) : block.type === 'equation' ? (
                <input 
                  type="text" 
                  value={block.data.equation} 
                  onChange={(e) => updateBlockData(index, 'equation', e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem' }} 
                  placeholder="Enter LaTeX formula (e.g., E=mc^2)"
                />
              ) : null}
            </div>
          ))}
        </div>

        <button type="submit" className="btn" style={{ background: '#28a745', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}>
          Publish Page
        </button>
      </form>
    </div>
  );
};

export default Dashboard;