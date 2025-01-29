import { Tabs } from '@ark-ui/react';

import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { Link } from 'react-router';

function Lobby() {
  return (
    <div>
      <Tabs.Root defaultValue="1">
        <div
          className={css({
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            left: '0',
            top: '0',
            bgSize: 'cover',
            bgPosition: 'center',
            filter: 'auto',
            blur: '3xl',
          })}
          style={{
            backgroundImage: `url(${bg1})`,
          }}
        />

        <div
          className={stack({
            direction: 'column',
            gap: '12',
            position: 'relative',
            width: '100vw',
            height: '100vh',
            px: '12',
            py: '16',
          })}
        >
          <Tabs.Content
            value="1"
            className={stack({
              direction: 'column',
              gap: '0',
              width: '100%',
              flex: '1',
              bgSize: 'cover',
              bgPosition: 'center',
              borderRadius: '2xl',
              padding: '12',
              color: 'white',
            })}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.0)), url(${bg1})`,
            }}
          >
            <div>
              <div
                className={css({
                  textStyle: '6xl',
                  fontWeight: 'bold',
                  mb: '4',
                })}
              >
                스포츠
              </div>
              <div
                className={css({
                  textWrap: 'wrap',
                  whiteSpace: 'pre',
                  fontSize: 'lg',
                })}
              >
                {/* biome-ignore lint/style/noUnusedTemplateLiteral: <explanation> */}
                {`세계적인 스포츠 스타들의\n시그니처 포즈를 맞춰 보세요`}
              </div>
            </div>
            <Link
              to={'/game'}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '200px',
                height: '48px',
                bgColor: 'white',
                color: 'black',
                borderRadius: 'lg',
                marginTop: 'auto',
              })}
            >
              시작하기
            </Link>
          </Tabs.Content>
          <Tabs.List>
            <Tabs.Trigger
              value="1"
              className={css({
                position: 'relative',
                width: '320px',
                height: '180px',
                bgSize: 'cover',
                bgPosition: 'center',
                borderRadius: '2xl',
                _selected: {
                  border: '2px solid',
                  borderColor: 'white',
                },
              })}
              style={{
                backgroundImage: `url(${bg1})`,
              }}
            >
              스포츠
            </Tabs.Trigger>
          </Tabs.List>
        </div>
      </Tabs.Root>

      {/* <ul
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
      </ul> */}
    </div>
  );
}

export default Lobby;
