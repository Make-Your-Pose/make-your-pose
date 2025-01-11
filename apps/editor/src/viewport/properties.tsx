import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Box } from 'styled-system/jsx';
import { Text } from '~/components/ui/text';

interface Props {
  selectedIndex: number | null;
  selectedLandmark: NormalizedLandmark | null;
}

export function Properties({ selectedIndex, selectedLandmark }: Props) {
  return (
    <Box bg="bg.subtle" p="6" w="200px">
      <Text>Properties</Text>
      <Box>
        {selectedIndex !== null && selectedLandmark && (
          <Box>
            <Text>Index: {selectedIndex}</Text>
            <Text>X: {selectedLandmark.x}</Text>
            <Text>Y: {selectedLandmark.y}</Text>
            <Text>Z: {selectedLandmark.z}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
