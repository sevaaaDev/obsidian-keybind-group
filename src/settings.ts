import { App, PluginSettingTab, Setting } from 'obsidian';
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
                    /*.onClick(() => {
                        new AddGroupModal(this.plugin).open();
                    })*/
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
