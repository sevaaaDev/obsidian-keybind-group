this is not meant for public use. you can read the code and learn from it, but i dont expect anyone to use it.

# Keybind Group
allow you to have multi sequence keybind and have a help menu that shows the available keybind (similar to emacs which-key)

## How it works
this create a new command called "which-key".
on the obsidian setting, you bind a hotkey to execute which-key command. the which-key command then open a modal. when the modal is opened, it listen to key event and dispatch the appropriate obsidian command for the key based on the keymap.

the limitation of this is you can only have 1 leader key.
