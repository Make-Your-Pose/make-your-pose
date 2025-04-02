import { Menu } from '@ark-ui/react';

import { DevtoolMachineContext } from '../machine';
import { css } from '~styled-system/css';

export function DevtoolMenu() {
  const devtoolActorRef = DevtoolMachineContext.useActorRef();

  const enableWebcam = DevtoolMachineContext.useSelector(
    (state) => state.context.enableWebcam,
  );

  return (
    <Menu.Root>
      <Menu.Trigger
        className={css({
          position: 'fixed',
          top: 4,
          right: 4,
          padding: 2,
          backgroundColor: 'ButtonFace',
          color: 'ButtonText',
          zIndex: 9999,
        })}
      >
        개발자도구
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.CheckboxItem
            className={css({
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              backgroundColor: 'ButtonFace',
              color: 'ButtonText',
            })}
            checked={enableWebcam}
            value="enableWebcam"
            onCheckedChange={(checked) => {
              devtoolActorRef.send({ type: 'TOGGLE_WEBCAM', state: checked });
            }}
          >
            <Menu.ItemText>웹캠 보기</Menu.ItemText>
            <Menu.ItemIndicator>✅</Menu.ItemIndicator>
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
