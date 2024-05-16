import Phaser from "../../../lib/phaser.js";
import { BATTLE_UI_SOUND, DATA_ASSET_KEYS, PLAYER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../assetsKeys/asset-keys.js";
import { DIRECTION } from "../../../common/direction.js";
import { exhaustiveGuard } from "../../../utils/guard.js";
import { BATTLE_MENU_OPTIONS, ATTACK_MENU_OPTIONS, ACTIVE_BATTLE_MENU } from "./battle-menu-options.js";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config.js";
import { BattleChar } from "../../battleChars/battle-Chars.js";

const BATTLE_MENU_CURSOR_POS = Object.freeze({
    x: 75,
    y: 30
})

const ATTACK_MENU_CURSOR_POS = Object.freeze({
    x1: 75,
    x2: 330,
    y: 60
})

export class BattleMenu {
    /**@type {Phaser.Scene} */
    #scene;
    /**@type {Phaser.GameObjects.Container} */
    #mainBattleMenuContainer;
    /**@type {Phaser.GameObjects.Container} */
    #moveSelectionSubContainer;
    /**@type {Phaser.GameObjects.Container} */
    #questionContainer;
    /**@type {Phaser.GameObjects.Text} */
    #battleTextLine1;
    /**@type {Phaser.GameObjects.Image} */
    #mainBattleMenuCursor;
    /**@type {Phaser.GameObjects.Image} */
    #attackBattleMenuCursor;
    /**@type {Phaser.GameObjects.Image} */
    #questionMenuCursor;
    /**@type {import("./battle-menu-options.js").BattleMenuOptions} */
    #selectedBattleMenuOption;
    /**@type {import("./battle-menu-options.js").AttackMenuOptions} */
    #selectedAttackMenuOption;
    /**@type {import("../../../../types/typedef.js").Question} */
    #battleQuestion
    /**@type {import("./battle-menu-options.js").ActiveBattleMenu} */
    #activeBattleMenu
    /**@type {String[]}*/
    #queuedInfoPanelMessages;
    /**@type {() => void |undefined}*/
    #queuedInfoPanelCallback;
    /**@type {Boolean}*/
    #waitingForPlayerInput;
    /**@type {Number | undefined} */
    #selectedAttackIndex
    /**@type {BattleChar}*/
    #activePlayer;

    /**
     * 
     * @param {Phaser.Scene} scene La escena de phaser3 que se añadirá al menú de batalla
     * @param {BattleChar} activePlayer
     */
    constructor(scene, activePlayer) {
        this.#scene = scene;
        this.#activePlayer = activePlayer;
        this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUCHAR;
        this.#selectedAttackMenuOption = ATTACK_MENU_OPTIONS.ATACAR;
        this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
        this.#queuedInfoPanelCallback = undefined;
        this.#queuedInfoPanelMessages = [];
        this.#waitingForPlayerInput = false;
        this.#selectedAttackIndex = undefined;
        this.#createMainInfoPane();
        this.#createMainBattleMenu();
        this.#createPlayerFightSub();
    }

    /**@type {Number | undefined} */
    get selectedAttack() {
        if (this.#activeBattleMenu == ACTIVE_BATTLE_MENU.BATTLE_ATACAR_SELECT) {
            return this.#selectedAttackIndex;
        }
        return undefined;
    }

    //Lógica de interfaz
    showMainBattleMenu() {
        this.#mainBattleMenuContainer.setAlpha(1);
        this.#battleTextLine1.setAlpha(1);
        this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
        this.#selectedAttackIndex = undefined;
    }

    hideMainBattleMenu() {
        this.#mainBattleMenuContainer.setAlpha(0);
        this.#battleTextLine1.setAlpha(0);
    }

    showFightMenu() {
        this.#moveSelectionSubContainer.setAlpha(1);
        this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_ATACAR_SELECT;
        this.#selectedAttackMenuOption = ATTACK_MENU_OPTIONS.ATACAR;
    }

    hideFightMenu() {
        this.#moveSelectionSubContainer.setAlpha(0);
    }

    showQuestionMenu() {
        this.#questionContainer.setAlpha(1);
    }

    hideQuestionMenu() {
        this.#questionContainer.setAlpha(0);
    }

    /**
     * 
     * @param {import("../../../common/direction.js").Direction|'OK'|'CANCEL'} input 
     */
    handlePlayerInput(input) {
        if (this.#waitingForPlayerInput && (input === 'CANCEL' || input === 'OK')) {
            this.#updateInfoPaneMessage();
            return;
        }

        if (input === 'CANCEL') {
            this.#switchToMainBattleMenu();
            return;
        }

        if (input == 'OK') {
            if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
                this.#handlerPlayerMainBattleOption();
                return;
            }

            if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_ATACAR_SELECT) {
                this.#handlePlayerAttack();
            }

            if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_QUESTION) {
                this.#handleQuestionSelect();
            }

            return;
        }

        switch (this.#activeBattleMenu) {
            case ACTIVE_BATTLE_MENU.BATTLE_MAIN:
                this.#updateSelectedBattleMenuOption(input);
                this.#moveMainBattleMenuCursor();
                break;
            case ACTIVE_BATTLE_MENU.BATTLE_ATACAR_SELECT:
                this.#updateSelectedAttackOption(input);
                this.#moveAttackMenuCursor();
                break;
            default:
                break;
        }

        /*
        this.#updateSelectedBattleMenuOption(input);
        this.#moveMainBattleMenuCursor();

        this.#updateSelectedAttackOption(input);
        this.#moveAttackMenuCursor();
        */
    }

    //Creación de interfaz

    //Menu principal
    #createMainBattleMenu() {
        this.#battleTextLine1 = this.#scene.add.text(8, 8, `¿Qué vas a hacer ${this.#activePlayer.name}?`, BATTLE_UI_TEXT_STYLE);
        this.#mainBattleMenuCursor = this.#scene.add.image(75, 30, UI_ASSET_KEYS.CURSOR).setOrigin(0).setScale(3).setDepth(1);
        this.#mainBattleMenuContainer = this.#scene.add.container(this.#scene.scale.width / 2 - 8, 8, [
            this.#createMainInfoSubPane(),
            this.#scene.add.text(100, 30, BATTLE_MENU_OPTIONS.LUCHAR, BATTLE_UI_TEXT_STYLE),
            this.#scene.add.text(400, 30, BATTLE_MENU_OPTIONS.MAGIA, BATTLE_UI_TEXT_STYLE),
            this.#scene.add.text(100, 100, BATTLE_MENU_OPTIONS.ITEM, BATTLE_UI_TEXT_STYLE),
            this.#scene.add.text(400, 100, BATTLE_MENU_OPTIONS.HUIR, BATTLE_UI_TEXT_STYLE),
            this.#mainBattleMenuCursor,
        ]);

        this.hideMainBattleMenu();
    }

    //Submenu LUCHAR
    #createPlayerFightSub() {
        this.#attackBattleMenuCursor = this.#scene.add.image(ATTACK_MENU_CURSOR_POS.x1, ATTACK_MENU_CURSOR_POS.y, UI_ASSET_KEYS.CURSOR, 0).setOrigin(0).setScale(3);
        this.#moveSelectionSubContainer = this.#scene.add.container(8, 8, [
            this.#scene.add.text(100, 60, 'Atacar', BATTLE_UI_TEXT_STYLE),
            this.#scene.add.text(350, 60, 'Protegerse', BATTLE_UI_TEXT_STYLE),
            this.#attackBattleMenuCursor,
        ]);
        this.hideFightMenu();
    }

    //Submenu Pregunta
    #createQuestionSubMenu(options) {
        this.#questionMenuCursor = this.#scene.add.image(75, 20, UI_ASSET_KEYS.CURSOR).setOrigin(0).setScale(3);
        this.#questionContainer = this.#scene.add.container(this.#scene.scale.width / 2 - 8, 8, [
            this.#scene.add.text(100, 30, options[0], BATTLE_UI_TEXT_STYLE).setFontSize(18),
            this.#scene.add.text(400, 30, options[1], BATTLE_UI_TEXT_STYLE).setFontSize(18),
            this.#scene.add.text(100, 100, options[2], BATTLE_UI_TEXT_STYLE).setFontSize(18),
            this.#scene.add.text(400, 100, options[3], BATTLE_UI_TEXT_STYLE).setFontSize(18),
            this.#questionMenuCursor,
        ]);
        this.hideQuestionMenu();
    }

    #moveAttackMenuCursor() {
        switch (this.#selectedAttackMenuOption) {
            case ATTACK_MENU_OPTIONS.ATACAR:
                this.#attackBattleMenuCursor.setPosition(ATTACK_MENU_CURSOR_POS.x1, ATTACK_MENU_CURSOR_POS.y);
                break;
            case ATTACK_MENU_OPTIONS.PROTEGERSE:
                this.#attackBattleMenuCursor.setPosition(ATTACK_MENU_CURSOR_POS.x2, ATTACK_MENU_CURSOR_POS.y);
        }
    }

    /**
     * 
     * @param {import("../../../common/direction.js").Direction} direction 
     * Método que actualiza la opción seleccionada en el menú de ATACAR
     */
    #updateSelectedAttackOption(direction) {
        if (this.#selectedAttackMenuOption === ATTACK_MENU_OPTIONS.ATACAR) {
            if (direction === DIRECTION.RIGHT) {
                this.#selectedAttackMenuOption = ATTACK_MENU_OPTIONS.PROTEGERSE;
            }
        }

        if (this.#selectedAttackMenuOption == ATTACK_MENU_OPTIONS.PROTEGERSE) {
            if (direction == DIRECTION.LEFT) {
                this.#selectedAttackMenuOption = ATTACK_MENU_OPTIONS.ATACAR;
            }
        }
    }


    //Menu de información
    #createMainInfoPane() {
        const padding = 4;
        const menuHeight = 170;
        this.#scene.add.rectangle(padding, padding, this.#scene.scale.width - padding * 2, menuHeight - padding, 0xa1764f).setOrigin(0).setStrokeStyle(8, 0xa18f4f).setAlpha(1);
    }
    #createMainInfoSubPane() {
        const padding = 8;
        const menuHeight = 150;
        return this.#scene.add.rectangle(0, 0, this.#scene.scale.width / 2, menuHeight + padding, 0x6dc74a).setOrigin(0).setAlpha(0.4);
    }

    /**
     * 
     * @param {import("../../../common/direction.js").Direction} direction 
     * Método que actualiza la opción seleccionada en el menú de batalla
     */
    #updateSelectedBattleMenuOption(direction) {
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.LUCHAR) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.MAGIA;
                    return;
                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;
                default:
                    break;

            }
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.MAGIA) {
            switch (direction) {
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUCHAR;
                    return;
                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.HUIR;
                    return;
                default:
                    break;

            }
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
            switch (direction) {
                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUCHAR;
                    return;
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.HUIR;
                    return;
                default:
                    break;

            }
        }
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.HUIR) {
            switch (direction) {
                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.MAGIA;
                    return;
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;
                default:
                    break;

            }
        }
    }

    //Método que actualiza la posición del cursor de la interfaz de combate
    #moveMainBattleMenuCursor() {
        switch (this.#selectedBattleMenuOption) {
            case BATTLE_MENU_OPTIONS.LUCHAR:
                this.#mainBattleMenuCursor.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y);
                return;
            case BATTLE_MENU_OPTIONS.MAGIA:
                this.#mainBattleMenuCursor.setPosition(BATTLE_MENU_CURSOR_POS.x + 300, BATTLE_MENU_CURSOR_POS.y);
                return;
            case BATTLE_MENU_OPTIONS.ITEM:
                this.#mainBattleMenuCursor.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y + 70);
                return;
            case BATTLE_MENU_OPTIONS.HUIR:
                this.#mainBattleMenuCursor.setPosition(BATTLE_MENU_CURSOR_POS.x + 300, BATTLE_MENU_CURSOR_POS.y + 70);
                return;
            default:
                exhaustiveGuard(this.#selectedBattleMenuOption);
        }
    }

    //Método que nos devuelve al menú principal
    #switchToMainBattleMenu() {
        this.hideQuestionMenu();
        this.hideFightMenu();
        this.showMainBattleMenu();
    }

    #handlerPlayerMainBattleOption() {
        this.hideMainBattleMenu();

        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.LUCHAR) {
            this.showFightMenu();
            return;
        }

        if (this.#selectedBattleMenuOption == BATTLE_MENU_OPTIONS.ITEM) {
            this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_ITEM_SELECT;
            this.updateInfoPaneMessagesAndWaitInput(['Tu bolsa está vacía . . .'], () => {
                this.#switchToMainBattleMenu();
            })
            return;
        }

        if (this.#selectedBattleMenuOption == BATTLE_MENU_OPTIONS.MAGIA) {
            this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAGIA_SELECT;
            this.updateInfoPaneMessagesAndWaitInput(['Aún no conoces ningún hechizo'], () => {
                this.#switchToMainBattleMenu();
            })
            return;
        }

        if (this.#selectedBattleMenuOption == BATTLE_MENU_OPTIONS.HUIR) {
            this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_HUIR_SELECT;
            this.updateInfoPaneMessagesAndWaitInput(['¡No conseguiste escapar!'], () => {
                this.#switchToMainBattleMenu();
            })
            return;
        }
    }

    /**
     * 
     * @param {string[]} messages 
     * @param {() => void} [callback] 
     */
    updateInfoPaneMessagesAndWaitInput(messages, callback) {
        this.#queuedInfoPanelMessages = messages;
        this.#queuedInfoPanelCallback = callback;
        this.#updateInfoPaneMessage();
    }

    #updateInfoPaneMessage() {
        this.#waitingForPlayerInput = false;
        this.#battleTextLine1.setText('').setAlpha(1);
        //Comprobar si se han terminado los mensajes de la cola y llamada da callback
        if (this.#queuedInfoPanelMessages.length === 0) {
            if (this.#queuedInfoPanelCallback) {
                this.#queuedInfoPanelCallback();
                this.#queuedInfoPanelCallback = undefined;
            }
            return;
        }
        //Primer mensaje de la cola, animarlo y eliminarlo
        let messageToDisplay = this.#queuedInfoPanelMessages.shift();
        this.#battleTextLine1.setText(messageToDisplay);
        this.#waitingForPlayerInput = true;
    }

    #handlePlayerAttack() {
        let selectedAttackIndex = 0;
        switch (this.#selectedAttackMenuOption) {
            case ATTACK_MENU_OPTIONS.ATACAR:
                selectedAttackIndex = 0;
                this.#handleQuestionSelect();
                break;
            case ATTACK_MENU_OPTIONS.PROTEGERSE:
                selectedAttackIndex = 1;
                this.#handleQuestionSelect();
                break;
            default:
                break;
        }
        this.#selectedAttackIndex = selectedAttackIndex;
    }

    #handleQuestionSelect() {
        this.#fetchNewQuestion();
        this.#createQuestionSubMenu(this.#battleQuestion.questionOptions);
        this.hideFightMenu();
        this.showQuestionMenu();
        this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_QUESTION;
        this.updateInfoPaneMessagesAndWaitInput([this.#battleQuestion.questionHeader], () => {
            this.#switchToMainBattleMenu();
        });
    }

    #fetchNewQuestion() {
        /**@type {import("../../../../types/typedef.js").Question[]} */
        const data = this.#scene.cache.json.get(DATA_ASSET_KEYS.QUESTIONS);
        let rndIndex = Math.floor(Math.random() * 3);
        const newQuestion = data.find((question) => question.id = rndIndex);
        if(newQuestion != undefined){
            this.#battleQuestion = newQuestion;
        }
    }

}