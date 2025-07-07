import { useEffect, useState } from 'react';
import axios from 'axios';
import './Promotions.css';

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(res.data);
    } catch (err) {
      console.error('Greska pri dohvatanju promocija:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert('Izaberi sliku');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('text', text);

    try {
      await axios.post('http://localhost:5000/api/promotions', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setImage(null);
      setText('');
      fetchPromotions();
      alert('Uspešno dodato');
    } catch (err) {
      alert('Greška pri uploadu');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="promotions-container">
      <h2>Promocije</h2>

      {role === 'admin' && (
        <form onSubmit={handleUpload} className="promotion-form">
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <input
            type="text"
            placeholder="Opis promocije"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="blue-btn">Dodaj promociju</button>
        </form>
      )}

      <div className="promotion-grid">
        {promotions.map((promo) => (
          <div key={promo.id} className="promotion-card">
            <img
              src={`http://localhost:5000/uploads/${promo.image}`}
              alt="Promo"
              className="promotion-img"
            />
            <p>{promo.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Promotions;
