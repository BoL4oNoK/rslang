import create from '../../utils/сreate';
import {
  vocabularyConstants,
  urls,
} from '../../constants/constants';
import {
  getAllUserWords,
  updateUserWord,
} from '../../service/service';
import {
  playAudio,
} from '../../utils/audio';
import {
  createWordDataForBackend,
} from '../../utils/words-functions';

export default create;
export {
  vocabularyConstants,
  urls,
  getAllUserWords,
  playAudio,
  updateUserWord,
  createWordDataForBackend,
};
