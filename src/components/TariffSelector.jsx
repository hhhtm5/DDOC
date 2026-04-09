export default function TariffSelector({ options, selected, onSelect }) {
  return (
    <div>
      {options.map(opt => (
        <div key={opt.id} style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer', background: selected?.id === opt.id ? '#e0f0ff' : '#fff' }} onClick={() => onSelect(opt)}>
          <strong>{opt.name}</strong> — {opt.price} ₽
        </div>
      ))}
    </div>
  );
}