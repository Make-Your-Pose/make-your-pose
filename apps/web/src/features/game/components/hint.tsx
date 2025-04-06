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
        position: 'absolute',
        inset: 0,
      }}
    >
      {hint.map((isVisible, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          style={{
            position: 'relative',
            perspective: '1000px', // Add perspective for 3D effect
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isVisible ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front face (visible when hint is not revealed) */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                backfaceVisibility: 'hidden',
              }}
            />

            {/* Back face (visible when hint is revealed) */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
