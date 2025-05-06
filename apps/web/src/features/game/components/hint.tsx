import { motion } from 'motion/react';

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
            perspective: '1000px',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: isVisible ? 180 : 0,
            }}
            transition={{ duration: 0.6 }}
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
          </motion.div>
        </div>
      ))}
    </div>
  );
}
