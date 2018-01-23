import { configure } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

import '../src/ShareButton.scss'

setOptions({
  name: 'React-mobile-share-btn',
  url: 'https://github.com/housinghq/react-mobile-share-btn',
  goFullScreen: false,
  showLeftPanel: false,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: false,
});

function loadStories () {
  require('../stories/Share.story.js');
}

configure(loadStories, module);
