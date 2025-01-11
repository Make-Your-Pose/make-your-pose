import { Box, Divider, Flex, Stack } from 'styled-system/jsx';
import { Heading } from './components/ui/heading';
import { Button } from './components/ui/button';
import { Text } from './components/ui/text';
import { extractFromImage } from './extract/from-image';
import { useState } from 'react';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { openFile } from './file/open';
import { saveFile } from './file/save';
import { Viewport } from './viewport/viewport';

function App() {
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);

  return (
    <Flex direction="row">
      <Box bg="bg.emphasized" h="dvh" p="6">
        <Heading as="h1" textStyle="xl" mb="4">
          Editor
        </Heading>
        <Stack my="2">
          <Text as="h2">File</Text>
          <Stack>
            <Button
              variant="outline"
              onClick={async () => {
                const landmarks = await openFile();
                setLandmarks(landmarks);
              }}
            >
              Open file
            </Button>
            <Button
              variant="outline"
              disabled={!landmarks}
              onClick={async () => {
                if (!landmarks) {
                  return;
                }

                saveFile(landmarks);
              }}
            >
              Save file
            </Button>
          </Stack>
          <Divider />
        </Stack>
        <Stack my="2">
          <Text as="h2">Extract</Text>
          <Stack>
            <Button
              variant="outline"
              onClick={async () => {
                const landmarks = await extractFromImage();
                setLandmarks(landmarks);
              }}
            >
              Extract from image
            </Button>
          </Stack>
          <Divider />
        </Stack>
      </Box>
      <Viewport landmarks={landmarks} onLandmarksUpdate={setLandmarks} />
    </Flex>
  );
}

export default App;
