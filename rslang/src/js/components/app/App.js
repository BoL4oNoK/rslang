import create from '../../utils/сreate';

import Authorization from '../authentication/Authorization';
import Registration from '../authentication/Registration';
import Authentication from '../authentication/Authentication';
import Preloader from '../preloader/Preloader';
import Vocabulary from '../vocabulary/Vocabulary';
import Settings from '../settings/Settings';
import Statistics from '../statistics/Statistics';

import MainPage from '../main-page/MainPage';

import CloseButton from '../mini-games/common/CloseButton';
import ShortTermStatistics from '../mini-games/common/ShortTermStatistics';
import BurgerMenu from '../main-page/components/BurgerMenu';

import MainGame from '../main-game/MainGame';
import SavannahGame from '../mini-games/savannah/Savannah';
import SpeakIt from '../mini-games/speak-it/SpeakIt';
import EnglishPuzzle from '../mini-games/english-puzzle/EnglishPuzzle';
import FindAPair from '../mini-games/find-a-pair/find-a-pair';
import SprintGame from '../mini-games/sprint/Sprint';
import AuditionGame from '../mini-games/audition-game/AuditionGame';

import {
  createUser,
  loginUser,
  getUserById,
  getRefreshToken,
} from '../../service/service';
import {
  errorTypes,
  authenticationConstants,
  mainPageHeaderButtonConstants,
  gamesInfo,
} from '../../constants/constants';

const {
  USER_IS_NOT_AUTHORIZED,
} = errorTypes;

const {
  AUTHORIZATION_TITLE,
  REGISTRATION_TITLE,
} = authenticationConstants;

const {
  mainGame,
  savannah,
  speakIt,
  findAPair,
  sprint,
  audioGame,
  englishPuzzle,
} = gamesInfo;

const {
  STATISTICS_CODE,
  VOCABULARY_CODE,
  PROMO_CODE,
  ABOUT_TEAM_CODE,
  SETTINGS_CODE,
} = mainPageHeaderButtonConstants;

class App {
  constructor() {
    this.closeButton = new CloseButton();
    this.shortTermStatistics = new ShortTermStatistics();
    this.preloader = new Preloader();

    this.state = {
      user: {
        isAuthrorized: false,
        userId: '',
        refreshToken: '',
        token: '',
        email: '',
        name: '',
      },
      currentPage: localStorage.getItem('current-page'),
    };

    const arrowSavedState = localStorage.getItem('arrow-bottom-clicked');
    this.isArrowBottomButtonClicked = arrowSavedState && JSON.parse(arrowSavedState);
    this.container = null;
  }

  async run() {
    this.container = create('main', 'main-page__content', '', document.body);
    try {
      await this.checkIsUserAuthorized();
    } catch (error) {
      this.renderAuthorizationBlock();
      this.prelodaer.hide();
    }
  }

  activateMainPageHandlers() {
    this.activateLogOutButton();
    this.activateGoToTheMainPageButton();
    this.activatePagesRenders();
    BurgerMenu.activateBurgerMenuHandler();
  }

  renderAuthorizationBlock() {
    App.removeModalElements();
    localStorage.setItem('user-data', '');
    localStorage.setItem('arrow-bottom-clicked', '');
    localStorage.setItem('current-page', '');
    this.state.user.isAuthrorized = false;
    this.clearMainContainersBeforeRender();
    this.renderAuthenticationBlock('authorization');
    this.renderToggleAuthentication();
    this.activateAuthenticationForm();
  }

  createMiniGameParameterObject() {
    return {
      user: this.state.user,
      closeButton: this.closeButton,
      shortTermStatistics: this.shortTermStatistics,
    };
  }

  activateGoToTheMainPageButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('#button-go-to-main-page');

      if (target) {
        this.clearMainContainersBeforeRender();
        this.saveCurrentPage();
        this.renderMainPage();
        BurgerMenu.makeBurgerMenuIconVisible();
        document.body.classList.remove('main-game_opened');
      }
    });
  }

  saveCurrentPage(page = '') {
    this.state.currentPage = page;
    localStorage.setItem('current-page', page);
  }

  renderStatistics() {
    this.statistics.render('.main-page__content');
  }

  async renderVocabulary() {
    const html = await this.vocabulary.render();
    this.container.append(html);
  }

  renderPromoPage() {}

  renderAboutTeamPage() {}

  renderSettingsBlock(isRenderAfterReload = false) {
    if (isRenderAfterReload) {
      this.renderMainPage();
    }
    const { background: settingsBackground } = this.settings.modalWindow;
    this.settings.openSettingsWindow();
    settingsBackground.classList.add('modal-block_top-layer');
  }

  activatePagesRenders() {
    document.addEventListener('click', async (event) => {
      const target = event.target.closest('[data-page-code]');

      if (target) {
        const { pageCode } = target.dataset;
        await this.selectPageRenderingByPageCode(pageCode, false);
        BurgerMenu.closeBurgerMenu();
      }
    });
  }

  async selectPageRenderingByPageCode(pageCode, isRenderAfterReload = true) {
    this.saveCurrentPage(pageCode);

    this.clearMainContainersBeforeRender();
    document.body.scrollIntoView();
    switch (pageCode) {
      case mainGame.code:
        await this.renderMainGame();
        break;
      case speakIt.code:
        await this.renderSpeakItGame();
        break;
      case englishPuzzle.code:
        await this.renderEnglishPuzzle();
        break;
      case audioGame.code:
        this.renderAuditionGame();
        break;
      case savannah.code:
        await this.renderSavannah();
        break;
      case sprint.code:
        await this.renderSprintGame();
        break;
      case findAPair.code:
        await this.renderFindAPair();
        break;
      case STATISTICS_CODE:
        this.renderStatistics();
        break;
      case VOCABULARY_CODE:
        await this.renderVocabulary();
        break;
      case PROMO_CODE:
        break;
      case ABOUT_TEAM_CODE:
        break;
      case SETTINGS_CODE:
        this.renderSettingsBlock(isRenderAfterReload);
        break;
      default:
        this.renderMainPage();
    }
  }

  clearMainContainersBeforeRender() {
    this.container.innerHTML = '';
    document.body.classList.remove('main-game_opened');

    const startGameWindow = document.querySelector('.start-game-window');
    const dailyStatistics = document.querySelector('.daily-statistics__overlay');
    if (startGameWindow) {
      startGameWindow.remove();
    }
    if (dailyStatistics) {
      dailyStatistics.remove();
    }
  }

  async renderMainGame() {
    this.mainGame = new MainGame(this.state.user);
    await this.mainGame.render('.main-page__content');
  }

  async renderSpeakItGame() {
    this.speakIt = new SpeakIt(this.createMiniGameParameterObject());
    await this.speakIt.run('.main-page__content');
  }

  async renderEnglishPuzzle() {
    this.englishPuzzle = new EnglishPuzzle(this.createMiniGameParameterObject());
    await this.englishPuzzle.start('.main-page__content');
  }

  renderAuditionGame() {
    this.auditionGame = new AuditionGame(this.createMiniGameParameterObject());
    this.auditionGame.render(5, 5, '.main-page__content');
  }

  async renderSavannah() {
    this.savannah = new SavannahGame(this.createMiniGameParameterObject());
    await this.savannah.render('.main-page__content');
  }

  renderSprintGame() {
    this.sprintGame = new SprintGame(this.createMiniGameParameterObject());
    const html = this.SprintGame.SprintRender();
    this.container.append(html);
  }

  async renderFindAPair() {
    this.findAPair = new FindAPair(this.createMiniGameParameterObject());
    await this.findAPair.init();
    this.renderStartPage('.main-page__content');
  }

  static removeModalElements() {
    const startGameWindow = document.querySelector('.start-game-window');
    const exitButton = document.querySelector('.exit-button');

    if (startGameWindow) {
      startGameWindow.remove();
    }

    if (exitButton) {
      exitButton.remove();
    }
  }

  async initSettings() {
    this.settings = new Settings(this.state.user);
    await this.settings.init();
  }

  async initStatistics() {
    this.statistics = new Statistics();
    await this.settings.init();
  }

  async initVocabulary() {
    this.vocabulary = new Vocabulary(this.state.user);
    await this.vocabulary.init();
  }

  async initAuxilaryComponents() {
    await this.initSettings();
    await this.initStatistics();
    await this.initVocabulary();
  }

  renderMainPage() {
    const { name, email } = this.state.user;
    this.mainPage = new MainPage(name || email);
    const html = this.mainPage.render();
    this.container.append(html);
    BurgerMenu.makeBurgerMenuIconVisible();

    if (this.isArrowBottomButtonClicked) {
      setTimeout(() => {
        MainPage.scrollIntoGamesBlock();
      }, 1000);
    }
  }

  activateLogOutButton() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('#logout-trigger');

      if (target) {
        this.renderAuthorizationBlock();
      }
    });
  }

  activateAuthenticationForm() {
    document.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (event.target.classList.contains('authorization__form')) {
        this.preloader.show();
        await this.signInUser();
        this.preloader.hide();
      }
      if (event.target.classList.contains('registration__form')) {
        try {
          this.preloader.show();
          const data = await Authentication.submitData(createUser);
          this.state = {
            ...this.state,
            user: {
              ...this.state.user,
              userId: data.userId,
              email: data.email,
            },
          };
          await this.signInUser();
          this.preloader.hide();
        } catch (error) {
          console.log(error);
          this.prelodaer.hide();
          Authentication.createErrorBlock(error.message);
        }
      }
    });
  }

  async signInUser() {
    try {
      const data = await Authentication.submitData(loginUser);
      const userData = await getUserById(data.userId, data.token);
      this.state = {
        ...this.state,
        user: {
          ...this.state.user,
          userId: data.userId,
          token: data.token,
          refreshToken: data.refreshToken,
          name: userData.name,
          email: userData.email,
        },
      };
      document.querySelector('.authentication').remove();
      document.querySelector('.authentication__buttons').remove();
      await this.initAuxilaryComponents();
      this.activateMainPageHandlers();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
    } catch (error) {
      console.log(error);
      Authentication.createErrorBlock(error.message);
    }
  }

  async renderSavannahGame() {
    this.savannahGame = new SavannahGame(this.createMiniGameParameterObject());
    await this.savannahGame.render();
  }

  async checkIsUserAuthorized() {
    const savedUserData = localStorage.getItem('user-data');
    try {
      this.preloader.render();
      this.preloader.show();

      let data = null;
      switch (true) {
        case savedUserData !== '': {
          const { userId, token } = JSON.parse(savedUserData);
          data = await getUserById(userId, token);
          break;
        }
        case this.state.user.userId && this.state.user.token: {
          const { userId, token } = this.state.user;
          data = await getUserById(userId, token);
          break;
        }
        default:
          throw new Error(USER_IS_NOT_AUTHORIZED);
      }

      this.state.user.isAuthrorized = true;
      this.state.user = {
        ...this.state.user,
        userId: data.id,
        email: data.email,
        token: JSON.parse(savedUserData).token,
        refreshToken: JSON.parse(savedUserData).refreshToken,
        name: data.name,
      };
      await this.initAuxilaryComponents();
      this.activateMainPageHandlers();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
      this.prelodaer.hide();
    } catch (error) {
      console.log(error);
      const parsedData = JSON.parse(savedUserData);
      const { userId, refreshToken } = parsedData;
      const data = await getRefreshToken(userId, refreshToken);
      this.state.user = {
        ...this.state.user,
        ...data,
      };
      await this.initAuxilaryComponents();
      this.activateMainPageHandlers();
      await this.selectPageRenderingByPageCode(this.state.currentPage);
      this.prelodaer.hide();
    }
  }

  renderToggleAuthentication() {
    const buttonsContainer = create('div', 'authentication__buttons');
    this.authenticationToggleButton = create(
      'button',
      'authentication__toggle-button',
      REGISTRATION_TITLE,
      buttonsContainer,
      ['type', 'button'], ['authenticationType', 'authorization'],
    );
    this.container.prepend(buttonsContainer);

    document.addEventListener('click', (event) => {
      const target = event.target.closest('.authentication__toggle-button');
      if (target) {
        const { authenticationType } = target.dataset;
        const typeToInit = authenticationType === 'registration' ? 'authorization' : 'registration';
        this.renderAuthenticationBlock(typeToInit);
        target.dataset.authenticationType = typeToInit;
        target.textContent = authenticationType === 'registration'
          ? REGISTRATION_TITLE
          : AUTHORIZATION_TITLE;
      }
    });
  }

  renderAuthenticationBlock(type) {
    const authenticationHTML = document.querySelector('.authentication');
    if (authenticationHTML) {
      authenticationHTML.remove();
    }
    const authentication = type === 'registration' ? new Registration() : new Authorization();

    this.container.append(authentication.render());
  }
}

export default App;
