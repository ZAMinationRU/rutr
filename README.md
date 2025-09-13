# Translations

This repository contains the translation mappings for **Voidware Client**.
Each file in [`/locales/`](./locales) contains the text strings for a specific language.

* [`Languages.json`](./Languages.json) lists all available languages and their metadata.
* Each translation file is named using the [IETF BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag).

# Contributing

* Use `en.json` as the **template** for adding new translations.
* File names **must** match the official language tag (e.g. `fr.json`, `de.json`, `zh-Hans.json`).
* Update `Languages.json` with the new language’s metadata when adding a translation.
* Create a Pull Request (PR) to submit your changes.
* Please keep PRs clean and focused — spam will be closed.

# Web UI

We will later provide a **web interface** for translators who prefer not to edit JSON directly.
Until then, you can edit JSON files directly on GitHub.

# Testing in Game

You can test your translation locally by placing the `.json` file in your executor’s workspace folder and running this **before** loading Voidware Client:

```lua
shared.environment = "translator_env"
shared.TargetLanguage = "fr"
shared.language = {
    ["fr"] = {
        NativeName = "Français",
        EnglishName = "French"
    }
}
```

> Missing translations will be printed in the Developer Console (F9 or `/console`).

# Language Info

> \[!IMPORTANT]
> Each entry in `Languages.json` must define:
>
> * **LanguageTag** → The official IETF BCP 47 tag (e.g. `fr`, `de`, `zh-Hans`).
> * **NativeName** → The language’s name in its own script (e.g. *Français*).
> * **EnglishName** → The English name of the language (e.g. *French*).

Example for French in `Languages.json`:

```json
{
  "fr": {
    "LanguageTag": "fr",
    "NativeName": "Français",
    "EnglishName": "French"
  }
}
```
