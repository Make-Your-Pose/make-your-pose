interface Props {
  hint: boolean[];
}

export function Hint({ hint }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '4px',
        width: '100%',
        height: '100%',
      }}
    >
      {hint.map((isVisible, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          style={{
            backgroundColor: '#e0e0e0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            opacity: isVisible ? 0 : 1,
          }}
        />
      ))}
    </div>
  );
}
