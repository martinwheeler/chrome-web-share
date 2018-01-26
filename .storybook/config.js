import { configure } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

import '../src/ShareButton.scss'

setOptions({
  name: 'chrome-web-share',
  url: 'https://github.com/martinwheeler/chrome-web-share',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: false,
});

function loadStories () {
  require('../stories/Share.story.js');
}

configure(loadStories, module);
