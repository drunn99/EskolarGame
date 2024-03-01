/**
 * @typedef {keyof typeof BATTLE_MENU_OPTIONS} BattleMenuOptions
 */

/**@enum {BattleMenuOptions} */
export const BATTLE_MENU_OPTIONS = Object.freeze({
    LUCHAR: "LUCHAR",
    MAGIA: "MAGIA",
    ITEM: "ITEM",
    HUIR: "HUIR"
});

/**
 * @typedef {keyof typeof ATTACK_MENU_OPTIONS} AttackMenuOptions
 */

/**@enum {AttackMenuOptions} */
export const ATTACK_MENU_OPTIONS = Object.freeze({
    ATACAR: 'ATACAR',
    PROTEGERSE: 'PROTEGERSE',
})

/**
 * @typedef {keyof typeof ACTIVE_BATTLE_MENU} ActiveBattleMenu
 */

/**@enum {ActiveBattleMenu} */
export const ACTIVE_BATTLE_MENU = Object.freeze({
    BATTLE_MAIN: 'BATTLE_MAIN',
    BATTLE_ATACAR_SELECT: 'BATTLE_ATACAR_SELECT',
    BATTLE_MAGIA_SELECT: 'BATTLE_MAGIA_SELECT',
    BATTLE_ITEM_SELECT: 'BATTLE_ITEM_SELECT',
    BATTLE_HUIR_SELECT: 'BATTLE_HUIR_SELECT',
});