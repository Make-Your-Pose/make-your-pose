import { useState } from 'react';
import { Link } from 'react-router';
import { css, cx } from '~styled-system/css';
import { center, container, hstack } from '~styled-system/patterns';

function Lobby() {
  const [items] = useState(['sports', 'meme', 'yoga']);

  return (
    <div className={cx(container(), center())}>
      <ul
        className={cx(
          hstack(),
          css({
            my: '4',
          }),
        )}
      >
        {items.map((item) => (
          <li key={item}>
            <Link
              to="/game"
              className={css({
                display: 'block',
                px: '4',
                py: '3',
                bg: 'gray.100',
                border: '1px solid',
                borderColor: 'blue.500',
              })}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
