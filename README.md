# chrome-web-share

> A lightweight React share button for mobile web with [Web Share API](https://developers.google.com/web/updates/2016/09/navigator-share) integration, native intent support and modal fallback.

## Features

1. [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#Browser_compatibility)
1. Share Modal Fallback for browsers lacking support
1. Share via Whatsapp, FB, Twitter, E-Mail or copy to clipboard

## Installation

```
npm install chrome-web-share --save
```

```
yarn add chrome-web-share
```

## Basic Usage

**JSX**
```jsx
import ShareBtn from 'chrome-web-share';

<ShareBtn
  shareUrl={url}
  disabled={['whatsApp']]
  shareText={text}
  className='my-class-name'
  buttonText='Share Profile'
/>
```

**CSS**
```css
@import "chrome-web-share/dist/ShareBtn";
```

## Options

### &lt;ShareBtn/&gt; Component

prop|default|description
----|-------|-----------
shouldCloseOnEscape|false|Whether or not the fallback modal should close when the user hits the escape key on desktop
disabled|[]|An array of button names to be disabled
className|''|Custom classname, you can style your button with this
[fbAppId](https://developers.facebook.com/docs/apps/register)|''|Required if you are planning on sharing to Facebook
[fbDisplayType](https://developers.facebook.com/docs/sharing/reference/share-dialog)|'touch'|The type of share window that will be launched to support different devices. E.g. mobile, tablet, or desktop.
shareUrl|''|The URL you want to share
shareMessage|''|The Text before the URL (E.g. Hey checkout this awesome thing I'm sharing!!)
buttonText| Share |The text that will appear for the share button
onButtonClick| () => {} |A callback function when the share button gets clicked
onCopySuccess| () => {} |A callback function that fires when the user has copied some text, also contains the text
sharedBy| (medium) => {console.log('shared via ', medium)}|A callback function when user clicks on any share medium from share modal

### Button Names
> Used for disabling a button with the `disabled` prop.

Can also be imported using the included util. E.g.

```javascript
import { BUTTON_TYPES } from 'chrome-web-share'
```

- WhatsApp
- Facebook
- Twitter
- Gmail
- Copy

### Development
```
git clone https://github.com/martinwheeler/chrome-web-share
cd chrome-web-share
yarn install
yarn storybook
```

Open an issue before opening a PR.

### License
MIT
