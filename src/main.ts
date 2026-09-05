import {
    Setting,
    Editor,
    MarkdownView,
    MarkdownFileInfo,
    Modal,
    Notice,
    Plugin,
} from 'obsidian';

// TODO: style the help modal
// TODO: handle modifier

interface KeyMap {
    [key: string]: string;
}

export default class KeybindGroup extends Plugin {
    mainKeymap: KeyMap = {
        "f": "switcher:open",
        "3": "workspace:split-vertical",
        "2": "workspace:split-horizontal",
        "1": "workspace:close-others",        
    };
    public invokeCommandId(id: string) {
        this.app.commands.executeCommandById(id);
    }
    async onload() {
        // === this gives all commands id ===
        // console.log(Object.values(this.app.commands.commands).map((e) => e.id));
        
        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'open-which-key',
            name: 'Open Which Key (main)',
            callback: () => {
                new WhichKey(this, this.mainKeymap).open();
            },
        });
    }

    onunload() {}
}



class WhichKey extends Modal {
    keymap: KeyMap;
    plugin: KeybindGroup;
    handleKey;

    constructor(plugin: KeybindGroup, keymap: KeyMap) {
        super(plugin.app);        
        this.plugin = plugin;
        this.keymap = keymap;
    }

    render() {
	this.setTitle('Which Key');
	
	const container = this.contentEl;
	container.addClasses(['container']);

	// Create grid container
	const group = container.createDiv('group');

	const header = group.createEl('h1');
	header.setText("Editing")
	const list = group.createEl('ul');
	// Data rows
	Object.entries(this.keymap).forEach(([k, c], index) => {
	    const li = list.createEl('li');
	    const key = li.createEl('code');	    
	    const text = li.createEl('span');
	    key.setText(k);
	    text.setText(c);
	});    	
    }
    onOpen() {
	this.render();
        const { contentEl } = this;
        
        this.handleKey = (evt: KeyboardEvent) => {
            evt.preventDefault();
            evt.stopPropagation();
            let cmd = this.keymap[evt.key];
            if (cmd !== undefined) {
                this.plugin.invokeCommandId(cmd);
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
