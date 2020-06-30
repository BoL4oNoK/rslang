import create from '../../../utils/сreate';
import ModalWindow from './ModalWindow';
import { playAudio } from '../../../utils/audio';
import {
  shortTermStatisticsConstants,
  urls,
} from '../../../constants/constants';

const {
  ERROR_STAT,
  CORRECT_STAT,
  STAT_TITLE,
  STAT_CLOSE,
} = shortTermStatisticsConstants;

const {
  WORDS_AUDIOS_URL,
  STAT_IMAGE_AUDIO,
} = urls;

export default class ShortTermStatistics extends ModalWindow {
  constructor() {
    super();
    if (ShortTermStatistics.exists) {
      return ShortTermStatistics.instance;
    }

    ShortTermStatistics.exists = true;
    shortTermStatisticsConstants.instance = this;
    this.audio = new Audio();
    this.initilized = false;
  }

  render(wrongWords, rightWords) {
    if (!this.initilized) {
      this.initilized = true;
      this.modaleWindow = new ModalWindow();
      ModalWindow.changeDisplay(this.modal, 'block');
      ModalWindow.changeDisplay(this.modalCancel, 'none');
      this.modalTitle.innerHTML = STAT_TITLE;
      this.modalWarning.innerHTML = null;
      this.modalClose.innerHTML = STAT_CLOSE;
  
      this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${wrongWords.length}`, this.modalText);
      this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
      this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${rightWords.length}`, this.modalText);
      this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);
  
      ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
      ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);
      this.clickStatisticaAudio();
    }
  }

  update(wrongWords, rightWords) {
    this.statisticaWrongWordsText.innerHTML = '';
    this.statisticaRightWordsText.innerHTML = '';

    this.statisticaWrongWordsText = create('p', 'modal_title', `${ERROR_STAT} ${wrongWords.length}`, this.modalText);
    this.statisticaWrongWords = create('p', 'modal_words', '', this.statisticaWrongWordsText);
    this.statisticaRightWordsText = create('p', 'modal_title', `${CORRECT_STAT} ${rightWords.length}`, this.modalText);
    this.statisticaRightWords = create('p', 'modal_words', '', this.statisticaRightWordsText);

    ShortTermStatistics.statisticaWords(wrongWords, this.statisticaWrongWords);
    ShortTermStatistics.statisticaWords(rightWords, this.statisticaRightWords);
  }

  static statisticaWords(arrayWords, container) {
    arrayWords.forEach((word) => {
      const everyString = create('p', '', '', container);
      const picture = create('img', 'audio-pictures', '', everyString);
      picture.src = STAT_IMAGE_AUDIO;
      this.audioPic = create('audio', '', '', everyString);
      this.audioPic.setAttribute('data-audiosrc', word.audio);
      everyString.innerHTML += `<b>${word.word}</b> - ${word.wordTranslate}<br>`;
    });
  }

  clickStatisticaAudio() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.audio-pictures');

      if (target) {
        const audioSrc = `${WORDS_AUDIOS_URL}${event.target.nextSibling.dataset.audiosrc}`;
        if (this.audio) {
          playAudio(audioSrc, this.audio);
        }
      }
    });
  }
}
