import {
    Setting,
    Editor,
    MarkdownView,
    MarkdownFileInfo,
    Modal,
    Notice,
    Plugin,
} from 'obsidian';

// Remember to rename these classes and interfaces!
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
        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: 'replace-selected',
            name: 'Replace selected content',
            editorCallback: (
                editor: Editor,
                _ctx: MarkdownView | MarkdownFileInfo,
            ) => {
                editor.replaceSelection('Sample editor command');
            },
        });
        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand({
            id: 'open-modal-complex',
            name: 'Open modal (complex)',
            checkCallback: (checking: boolean) => {
                // Conditions to check
                const markdownView =
                    this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    // If checking is true, we're simply "checking" if the command can be run.
                    // If checking is false, then we want to actually perform the operation.
                    if (!checking) {
                        new WhichKey(this, this.mainKeymap).open();
                    }

                    // This command will only show up in Command Palette when the check function returns true
                    return true;
                }
                return false;
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
    
    onOpen() {
        this.setTitle("Which Key");
        const { contentEl } = this;
        const list = contentEl.createEl("ul");
        Object.entries(this.keymap)
            .forEach(([k, c]) => list.createEl("li").setText(`${k} -> ${c}`));
        
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
