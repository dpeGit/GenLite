/*
*/
/*
    This file is part of GenLite.

    GenLite is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    GenLite is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Foobar. If not, see <https://www.gnu.org/licenses/>.
*/

/** Core Features */
import { GenLite } from "./core/genlite.class";
import { GenLiteNotificationPlugin } from "./core/plugins/genlite-notification.plugin";
import { GenLiteSettingsPlugin } from "./core/plugins/genlite-settings.plugin";
import { GenLiteCommandsPlugin } from "./core/plugins/genlite-commands.plugin";
import { GenLiteConfirmation } from "./core/helpers/genlite-confirmation.class";


/** Official Plugins */
import { GenLiteVersionPlugin } from "./plugins/genlite-version.plugin";
import { GenLiteCameraPlugin } from "./plugins/genlite-camera.plugin";
import { GenLiteChatPlugin } from "./plugins/genlite-chat.plugin";
import { GenLiteDropRecorderPlugin } from "./plugins/genlite-drop-recorder.plugin";
import { GenLiteInventoryPlugin } from "./plugins/genlite-inventory.plugin";
import { GenLiteItemHighlightPlugin } from "./plugins/genlite-item-highlight.plugin";
import { GenLiteNPCHighlightPlugin } from "./plugins/genlite-npc-highlight.plugin";
import { GenLiteRecipeRecorderPlugin } from "./plugins/genlite-recipe-recorder.plugin";
import { GenLiteWikiDataCollectionPlugin } from "./plugins/genlite-wiki-data-collection.plugin";
import { GenLiteXpCalculator } from "./plugins/genlite-xp-calculator.plugin";
import { GenLiteHitRecorder } from "./plugins/genlite-hit-recorder.plugin";
import { GenLiteMenuScaler } from "./plugins/genlite-menu-scaler.plugin";
import { GenLiteMusicPlugin } from "./plugins/genlite-music.plugin";
import { GenLiteLocationsPlugin } from "./plugins/genlite-locations.plugin";
import { GenLiteMenuSwapperPlugin } from "./plugins/genlite-menuswapper.plugin";
import { GenLiteItemTooltips } from "./plugins/genlite-item-tooltips.plugin";
import { GenLiteSoundNotification } from "./plugins/genlite-sound-notification.plugin";
import { GenLiteGeneralChatCommands } from "./plugins/genlite-generalchatcommand.plugin";
import { GenLitePlayerToolsPlugin }  from "./plugins/genlite-playertools.plugin";
import { GenLiteHighscores } from "./plugins/genlite-highscores.plugin";

declare const GM_getResourceText : (s:string) => string;
declare global {
    interface Document {
        fonts: any;
        game: any;
        client: any;
        genlite: any;
        initGenLite: () => void;
    }
}

const DISCLAIMER = `
GenLite is NOT associated with Rose-Tinted Games.
Do not talk about GenLite in the main discord.
Do not report bugs to the devs with GenLite enabled, they will ignore you and get annoyed.
Do disable GenLite first and test for the bug again.
If you find a bug and are unsure post in the GenLite Server. We will help you.
While we work to ensure compatibility, Use At Your Own Risk.
Press Cancel to Load, Press Okay to Stop.`;

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

let scriptText = GM_getResourceText('clientjs');

const acmeFont = new FontFace('Acme', 'url(https://play.genfanad.com/play/js/f6db4c5c3282b4e95e85.ttf)');
acmeFont.load().then(() => document.fonts.add(acmeFont));

scriptText = scriptText.substring(0, scriptText.length - 5)
    + "; document.client = {};"
    + "document.client.get = function(a) {"
    +   "return eval(a);"
    + "};"
    + "document.client.set = function(a, b) {"
    +   "eval(a + ' = ' + b);"
    + "};"
    + scriptText.substring(scriptText.length-5)
    + "//# sourceURL=client.js";

let isInitialized = false;

(async function load() {
    let confirmed = localStorage.getItem("GenLiteConfirms");
    if (!confirmed && await GenLiteConfirmation.confirm(DISCLAIMER) === true)
        return;
    confirmed = "true";
    localStorage.setItem("GenLiteConfirms", confirmed);

    async function initGenLite() {

        function gameObject(
            name: string,
            minified: string,
            parent: Object = null
        ): any {
            var o = document.client.get(minified);
            if (!o) {
                console.log(`${minified} (${name}) is not defined: ${o}`);
            }

            if (!parent) {
                parent = document.game;
            }
            parent[name] = o;
        }

        document.game = {};
        document.game.ITEM_RIGHTCLICK_LIMIT = 20; // TODO: Is this equivalent? It seems to no longer be included in client.js

        // Classes
        gameObject('Bank', 'tv');
        gameObject('Chat', 'rv');
        gameObject('Actor', 'Dg');
        gameObject('Animation', 'h_');
        gameObject('Camera', 'DS');
        gameObject('Character', 'A_');
        gameObject('DeduplicatingCachedLoader', 'wS');
        gameObject('FadeAnimation', 'd_');
        gameObject('FrozenEffect', 'Gg');
        gameObject('Game', 'X_');
        gameObject('Graphics', 'NS');
        gameObject('HumanCharacter', 'jg');
        gameObject('Inventory', 'Cv');
        gameObject('ItemStack', 'Lg');
        gameObject('MinimapRenderer', 'j_');
        gameObject('ModelProjectileAnimation', 'g_');
        gameObject('MonsterCharacter', 'Hg');
        gameObject('Network', 'ug');
        gameObject('NewSegmentLoader', 'yS');
        gameObject('NPC', 'I_');
        gameObject('OptimizedScene', 'PS');
        gameObject('PassThroughSpineTexture', 'Pg');
        gameObject('PhasedLoadingManager', 'gS');
        gameObject('Player', 'O_');
        gameObject('PlayerHUD', 'zv');
        gameObject('PlayerInfo', 'Xg');
        gameObject('Seed', 'z_');
        gameObject('Segment', 'B_');
        gameObject('ShrinkForBoatAnimation', 'p_');
        gameObject('SpriteAnimation', '__');
        gameObject('SpriteProjectileAnimation', 'f_');
        gameObject('TeleportAnimation', 'u_');
        gameObject('TemporaryScenery', 'H_');
        gameObject('WorldManager', 'IS');
        gameObject('WorldObject', 'E_');
        gameObject('Math', 'xi', document.game.THREE);
        gameObject('SFXPlayer', '$m');

        // Objects
        gameObject('BANK', 'ew');
        gameObject('CHAT', 'nw');
        gameObject('DATA', 'Qy');
        gameObject('FRIENDS', 'dw');
        gameObject('GAME', 'K_.game');
        gameObject('GRAPHICS', 'KS.graphics');
        gameObject('INVENTORY', 'uw');
        gameObject('KEYBOARD', 'XS');
        gameObject('NETWORK', 'pg.network');
        gameObject('PHASEDLOADINGMANAGER', 'gS');
        gameObject('PLAYER', '$S.player');
        gameObject('SFX_PLAYER', 'Jm');
        gameObject('WORLDMANAGER', 'IS');
        gameObject('MUSIC_PLAYER', 'Nv');
        gameObject('MUSIC_TRACK_NAMES', 'Pv');
        gameObject('SETTINGS', 'bw');
        gameObject('THREE', 'e');
        gameObject('PLAYER_INFO', 'fw');

        if (isInitialized) {
            document.genlite.onUIInitialized();
            return;
        }
        isInitialized = true;

        const genlite = new GenLite();
        document.genlite = genlite;
        await genlite.init();

        /** Core Features */
        genlite.notifications = await genlite.pluginLoader.addPlugin(GenLiteNotificationPlugin);
        genlite.settings = await genlite.pluginLoader.addPlugin(GenLiteSettingsPlugin);
        genlite.commands = await genlite.pluginLoader.addPlugin(GenLiteCommandsPlugin);

        /** Official Plugins */
        await genlite.pluginLoader.addPlugin(GenLiteVersionPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteCameraPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteChatPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteNPCHighlightPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteItemHighlightPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteInventoryPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteDropRecorderPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteWikiDataCollectionPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteXpCalculator);
        await genlite.pluginLoader.addPlugin(GenLiteRecipeRecorderPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteHitRecorder);
        await genlite.pluginLoader.addPlugin(GenLiteMenuScaler);
        await genlite.pluginLoader.addPlugin(GenLiteMusicPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteLocationsPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteMenuSwapperPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteItemTooltips);
        await genlite.pluginLoader.addPlugin(GenLiteSoundNotification);
        await genlite.pluginLoader.addPlugin(GenLiteGeneralChatCommands);
        await genlite.pluginLoader.addPlugin(GenLitePlayerToolsPlugin);
        await genlite.pluginLoader.addPlugin(GenLiteHighscores);

        /** post init things */
        await document['GenLiteSettingsPlugin'].postInit();
        await document['GenLiteNPCHighlightPlugin'].postInit();
        await document['GenLiteDropRecorderPlugin'].postInit();

        // NOTE: currently initGenlite is called after the scene has started
        //       (in minified function NS). The initializeUI function does not
        //       exist in genfanad and is inlined in NS. So at this point, UI
        //       is already initialized and we update the plugins.
        //
        //       We should eventually move genlite to init at page start, then
        //       this needs to move to the NS override at the bottom of this
        //       file.
        genlite.onUIInitialized();
    }

    function firefoxOverride(e) {
        let src = e.target.src;
        if (src === 'https://play.genfanad.com/play/js/client.js') {
            e.preventDefault(); // do not load
            e.stopPropagation();
            var script = document.createElement('script');
            script.textContent = scriptText;
            script.type = 'module';
            (document.head||document.documentElement).appendChild(script);
        }
    }

    function hookClient() {
        if (document.head) {
            throw new Error('Head already exists - make sure to enable instant script injection');
        }

        if (isFirefox) {
            document.addEventListener("beforescriptexecute", firefoxOverride, true);
        } else {
            new MutationObserver((_, observer) => {
                const clientjsScriptTag = document.querySelector('script[src*="client.js"]');
                if (clientjsScriptTag) {
                    clientjsScriptTag.removeAttribute('src');
                    clientjsScriptTag.textContent = scriptText;
                }
            }).observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    hookClient();
    window.addEventListener('load', (e) => {
        document.initGenLite = initGenLite;

        let doc = (document as any)
        doc.client.set('document.client.originalStartScene', doc.client.get('qS'));
        doc.client.set('qS', function () {
            document.client.originalStartScene();
            setTimeout(document.initGenLite, 100);
        });
    });

})();
