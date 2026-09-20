import { App, PluginSettingTab, Setting, Modal } from 'obsidian';
import KeybindGroup, { KeyMap } from './main';

export interface KeybindGroupSettings {
    groups: {[key: string]: {desc: string; keymap: KeyMap;}};
}

export const DEFAULT_SETTINGS: KeybindGroupSettings = {
    groups: { 
        "Main": {
        desc: "Main keymap",
        keymap: {
                "C-f": {id: "switcher:open", name: "Open Switcher"},
                "3": {id: "workspace:split-vertical", name: "Split Workspace Vertically"},
                "2": {id: "workspace:split-horizontal", name: "Split Workspace Horizontally"},
                "1": {id: "workspace:close-others", name: "Close Other Workspaces"},
                "o": {id: "editor:focus-bottom", name: "Focus Bottom Editor"},
                "b": {id: "app:toggle-left-sidebar", name: "Toggle Left Sidebar"},
                "l": {id: "editor:insert-tag", name: "Insert Tag"}
            }
        },
    },
};

export class KeybindGroupSettingTab extends PluginSettingTab {
    plugin: KeybindGroup;

    constructor(app: App, plugin: KeybindGroup) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setHeading()
            .setName('Keybind Group')
            .setDesc("A group is a command that you can bind to obsidian hotkeys")
            .addButton((button) => {
                button
                    .setButtonText('Add new group')
                    .onClick(() => {
                        new AddGroupModal(this.plugin).open();
                    });
            });
        this.displayListCmd(containerEl);

    }

    displayListCmd(containerEl: HTMLElement): void {
        for (let [name, detail] of Object.entries(this.plugin.settings.groups)) {
            let {desc, keymap} = detail;
            new Setting(containerEl)
            .setName(name)
            .setDesc(desc)
            .addButton((button) => {
                button
                    .setButtonText('Modify')
                    .onClick(() => {})
            })
            .addExtraButton((button) => {
                button
                    .setIcon('trash')
                    .setTooltip('Delete group')
                    /*.onClick(() => {
                        new DeleteGroupModal(this.plugin).open();
                    })*/
            });
        }
    }
}

class AddGroupModal extends Modal {
    plugin: KeybindGroup;

    constructor(plugin: KeybindGroup) {
        super(plugin.app);        
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        this.setTitle('Modify Group');
        let groupDetail = contentEl.createDiv('modify-group-modal');
        new Setting(groupDetail)
            .setName("Group Name")
            .addText((input) => {
                input.setPlaceholder('Editor Keybind Group');
            })
        new Setting(groupDetail)
            .setName("Description")
            .addText((input) => {
                input.setPlaceholder('Keybind for editing markdown');
            })
        new Setting(contentEl)
            .setName("Keybindings")
            .setDesc("Keybind that active on command")
            .setHeading()
            .addButton((b) => {
                b.setButtonText("Add new keybind")
            });
        let listKeybindDiv = contentEl.createDiv('list-keybind');
        new Setting(listKeybindDiv)
            .setName("C-b")
            .setDesc("Quick Buffer")
            .addExtraButton((button) => {
                button
                    .setIcon('trash')
                    .setTooltip('Delete keybind')
                    /*.onClick(() => {
                        new DeleteGroupModal(this.plugin).open();
                    })*/
            });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
