import create from '../../../utils/сreate';
import {
  wordsToLearnSelectConstants,
} from '../../../constants/constants';

const {
  SELECT_TITLE,
  SELECT_OPTION_LEARNED_WORDS,
  SELECT_OPTION_WORDS_FROM_COLLECTIONS,
} = wordsToLearnSelectConstants; 

class WordsToLearnSelect {
  constructor(containerClassNameType) {
    this.containerClassNameType = containerClassNameType;
    this.HTML = null;
  }

  render() {
    this.HTML = create('div', `select__container ${this.containerClassNameType}__container`);
    create('div', `select__title ${this.containerClassNameType}__select-title`, SELECT_TITLE, this.HTML);
    create(
      'select', `select__item ${this.containerClassNameType}__learn-words-select`,
      [
        this.renderOption(SELECT_OPTION_LEARNED_WORDS),
        this.renderOption(SELECT_OPTION_WORDS_FROM_COLLECTIONS),
      ],
      this.HTML,
    );

    return this.HTML;
  }

  renderOption(optionText) {
    return create(
      'option',
      `select__option ${this.containerClassNameType}`, optionText, '',
      ['value', optionText],
    );
  }
}

export default WordsToLearnSelect;
