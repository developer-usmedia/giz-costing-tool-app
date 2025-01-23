# GIZ- Costing Tool App

Google Cloud Project: airy-web-417014

## Url's

| Environment | URL                                                        |
| ----------- | ---------------------------------------------------------- |
| Local       | <http://localhost:4200>                                    |
| Staging     | <https://staging-dot-airy-web-417014.ey.r.appspot.com/> |
| Production  | <https://costing-tool.nachhaltige-agrarlieferketten.org/>  |


## Requirements

Node version 22

If you use angular cli:
[Angular CLI](https://github.com/angular/angular-cli) version 17.2.2

## Installation

```
# install required packages.
npm ci

# Setup env variables.
cp .env.sample .env

```

## Running the app

The app is available in English and Spanish. Angular Localization is used to accomplish this.  
When serving the app you have to chose in which language to serve.  
On production there is a server which redirects you to the right language (TODO)

```
  npm start
```

Running the app using the spanish translation:

```
  npm start-es
```

## Translations

We're using [Angular Localization](https://angular.io/guide/i18n-overview) for the translations.  
When you add a text that should be translated: either use the i18n attribute in html or $localize in ts to define it should be translated.  
Make sure you also add 'meaning' so angular can use this to determine the right id's and also to make it clear what it's for.  
The default locale is en-US and the language is english.

### Update translations

When you've added a new translatable string run

```
    npm run extract-i18n
```

This will generate a new source json & xlf file. Make sure you copy the new translations to all translation files (for now just es) and translate the content.  
Sometimes angular changes the ID for a translation (for example if the meaning is changed): make sure to also update the id's for the other translations.  
The XLF file is used a reference. In this file you can see where a string is used.

Test the translations using the separate start tasks for each language.  
If a translation is missing you will see a warning during start/build for the missing translation.  
You can use the id in the warning message to check the source file on where this translation is.

### Links:

-   [The Ultimate Guide to Angular Localization](https://phrase.com/blog/posts/angular-localization-i18n/)
-   [Angular Internationalization guide](https://angular.io/guide/i18n-overview)
-   [Prepare component for translation](https://angular.io/guide/i18n-common-prepare)
