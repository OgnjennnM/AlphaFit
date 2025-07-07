import './PlanCard.css';

function PlanCard({ plan, selected, onSelect, showSubscribe, onSubscribe }) {
  return (
    <div
      className={`plan-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(plan)}
    >
      <h3>{plan.name}</h3>
      <ul>
        {plan.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <p className="price">€{plan.price}/month</p>

      {selected && showSubscribe && (
        <button className="subscribe-btn" onClick={(e) => {
          e.stopPropagation(); 
          onSubscribe(plan.id);
        }}>
          Pretplati se
        </button>
      )}
    </div>
  );
}

export default PlanCard;
