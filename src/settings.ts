import { App, PluginSettingTab, Setting, Modal } from 'obsidian';
import MyPlugin from './main';

export interface KeybindGroupSettings {
    mySetting: string;
    cmd: string[];
}

export const DEFAULT_SETTINGS: KeybindGroupSettings = {
    mySetting: 'default',
    cmd: ['System keybind', 'Editor keybind'],
};

export class KeybindGroupSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
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
        for (let cmd of this.plugin.settings.cmd) {
            new Setting(containerEl)
            .setName(cmd)
            .setDesc(cmd)
            .addButton((button) => {
                button.setButtonText('Modify')
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
        new Setting(contentEl)
            .setName("Group Name")
            .setHeading()
            .addText((input) => {
                input.setPlaceholder('"Editor Keybind Group"');
            });
        new Setting(contentEl)
            .setName("Keybindings")
            .setHeading()
            .addButton((b) => {
                b.setButtonText("Add new keybind")
            })
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
