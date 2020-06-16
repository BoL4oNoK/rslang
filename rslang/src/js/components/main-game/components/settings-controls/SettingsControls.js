import create from '../../../../utils/сreate';
import { mainGameStrings } from '../../../../constants/constants';

const {
  SETTINGS_AUTOPLABACK_TEXT,
  SETTINGS_TRANSLATIONS_LABEL_TEXT,
} = mainGameStrings;

class SettingsControls {
  constructor() {
    this.HTML = null;
  }

  render() {
    this.HTML = create(
      'div', 'main-game__settings',
      [
        SettingsControls.renderCheckbox('autoplayback', SETTINGS_AUTOPLABACK_TEXT),
        SettingsControls.renderCheckbox('translations', SETTINGS_TRANSLATIONS_LABEL_TEXT),
      ],
    );

    return this.HTML;
  }

  static renderCheckbox(classNameType, labelText) {
    const inputId = `${classNameType}-checkbox`;
    const container = create('div', 'main-game__setting');
    create('label', 'main-game__label', labelText, container, ['for', inputId]);
    create(
      'input',
      `main-game__setting main-game__${classNameType}`, '', container,
      ['type', 'checkbox'], ['id', inputId], ['checked', 'true'],
    );

    return container;
  }
}

export default SettingsControls;
