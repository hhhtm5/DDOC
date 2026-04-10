export default function TariffSelector({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => onSelect(opt)}
          style={{
            border: selected?.id === opt.id ? '3px solid #2AABEE' : '1px solid #ccc',
            borderRadius: 16,
            padding: 18,
            cursor: 'pointer',
            background: selected?.id === opt.id ? '#e6f4ff' : '#fff',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: '600' }}>{opt.name}</div>
          <div style={{ fontSize: 24, fontWeight: '700', color: '#2AABEE', marginTop: 8 }}>
            {opt.price} ₽
          </div>
        </div>
      ))}
    </div>
  );
}
