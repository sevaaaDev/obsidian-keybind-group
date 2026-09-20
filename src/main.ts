import {
    Editor,
    MarkdownView,
    MarkdownFileInfo,
    Modal,
    Notice,
    Plugin,
} from 'obsidian';

import {
    DEFAULT_SETTINGS,
    KeybindGroupSettings,
    KeybindGroupSettingTab,
} from './settings'; 

// TODO: make setting page to configure keybind
// TODO: we can store a list of keybind group in setting, to then created a command for each.
// TODO: use suggestmodal to pick command to bind

// to record new keybind
class RecordingModal {}

// to pick command to bind
class CommandPickerModal {}

class KeyData {
    keyChar: string;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    constructor(keyChar: string, shift: boolean, ctrl: boolean, alt: boolean) {
	this.keyChar = keyChar;
	this.shift = shift;
	this.ctrl = ctrl;
	this.alt = alt;
    }

    toString(): string {
	let repr = this.keyChar.toLowerCase();
	if (this.shift) {
	    repr = "S-" + repr;
	}
	if (this.alt) {
	    repr = "M-" + repr;
	}
	if (this.ctrl) {
	    repr = "C-" + repr;
	}
	return repr;
    }
}

export interface KeyMap {
    [key: string]: {
        id: string;
        name: string;
    };
}

export default class KeybindGroup extends Plugin {
    settings!: KeybindGroupSettings; 

    public invokeCommandId(id: string) {
        this.app.commands.executeCommandById(id);
    }
    async onload() {
        
        await this.loadSettings();

        this.addSettingTab(new KeybindGroupSettingTab(this.app, this));

        // for (let cmd of this.settings.cmd) {
        //     this.addCommand({
        //         id: cmd,
        //         name: cmd,
        //         callback: () => {},
        //     });
        // }
        // === this gives all commands id ===
        console.log(Object.values(this.app.commands.commands).map((e) => e.id));

	// WARN: command meant for editing should only be available in certain condition
	// TODO: figure out how to determine which command available
        // this.addCommand({
        //     id: 'open-which-key',
        //     name: 'Open Which Key (main)',
        //     callback: () => {
        //         new WhichKey(this, this.mainKeymap).open();
        //     },
        // });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            (await this.loadData()) as Partial<KeybindGroupSettings>,
        );
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}


class WhichKey extends Modal {
    keymap: KeyMap;
    plugin: KeybindGroup;
    handleKey: (evt: KeyboardEvent) => void;

    constructor(plugin: KeybindGroup, keymap: KeyMap) {
        super(plugin.app);        
        this.plugin = plugin;
        this.keymap = keymap;
    }

    convertEvtToKey(evt: KeyboardEvent) {
	let {key, shiftKey, ctrlKey, altKey} = evt;
	return new KeyData(key, shiftKey, ctrlKey, altKey);
    }

    render() {
	this.setTitle('Which Key');
	
	const container = this.contentEl;
	container.addClasses(['container']);

	const group = container.createDiv('group');

	const header = group.createEl('h1');
	header.setText("Editing")
	
	const list = group.createEl('ul');
	Object.entries(this.keymap).forEach(([k, c], index) => {
	    const li = list.createEl('li');
	    const key = li.createEl('code');	    
	    const text = li.createEl('span');
	    key.setText(k);
	    text.setText(c.name);
	});    	
    }
    onOpen() {
	this.render();
        const { contentEl } = this;
        
        this.handleKey = (evt: KeyboardEvent) => {
	    let key = this.convertEvtToKey(evt);
            evt.preventDefault();
            evt.stopPropagation();
            let cmd = this.keymap[key.toString()];
            if (cmd !== undefined) {
                /* this will close the modal and refocus to editor
                   before executing the command */
                window.setTimeout((() => this.plugin.invokeCommandId(cmd.id)).bind(this));
                this.close();
            }                
        }
        activeDocument.addEventListener('keydown', this.handleKey, {capture:true});
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        activeDocument.removeEventListener('keydown', this.handleKey, {capture:true});
    }
}
