import { Dimensions } from 'react-native';

export const NUM_COLUMNS = 2;
export const GRID_GAP = 4;
export const ROW_GAP = 16;
export const HORIZONTAL_PADDING = 0;
export const CARD_WIDTH =
  (Dimensions.get('window').width - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
export const MEDIA_HEIGHT = CARD_WIDTH * 1.3;
