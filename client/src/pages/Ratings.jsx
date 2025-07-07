import { useEffect, useState } from 'react';
import axios from 'axios';

function Ratings() {
  const [trainers, setTrainers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [comment, setComment] = useState('');
  const [ratingValue, setRatingValue] = useState(5);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchRatings();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/protected/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const onlyTrainers = res.data.filter((u) => u.role === 'admin'); 
      setTrainers(onlyTrainers);
    } catch (err) {
      console.error('Greska pri dohvatanju korisnika:', err);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ratings');
      setRatings(res.data);
    } catch (err) {
      console.error('Greska pri dohvatanju ocjena:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/ratings',
        {
          trainer_id: selectedTrainer,
          rating: ratingValue,
          comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Ocjena uspješno poslata!');
      setSelectedTrainer('');
      setRatingValue(5);
      setComment('');
      fetchRatings();
    } catch (err) {
      alert('Greška pri slanju ocjene');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ocijeni trenera</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <select required value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
          <option value="">Izaberi trenera</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingValue}
          onChange={(e) => setRatingValue(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Komentar"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Posalji</button>
      </form>

      <h3>Prethodne ocjene</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {ratings.map((r) => (
          <div key={r.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <strong>Ocjena: {r.rating} ⭐</strong>
            <p>{r.comment}</p>
            <p><em>Za trenera ID: {r.trainer_id}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ratings;
