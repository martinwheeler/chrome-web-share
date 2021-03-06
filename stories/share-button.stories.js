import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, array, text } from '@storybook/addon-knobs/react';

import ShareBtn from '../src';
import { BUTTON_TYPES } from '../src/utils';
import '../src/ShareButton.scss';

const stories = storiesOf('Share Button', module);

stories.addDecorator(withKnobs);

stories
    .add('default', () => {
        const knobProps = {
            disabled: array('disabled', [ BUTTON_TYPES.WHATSAPP ]),
            fbAppId: text('FB App ID', ''),
            shareUrl: text('Link', 'https://lana.global'),
            shareMessage: text('Message', 'test'),
            buttonText: text('Button Text', 'Share'),
            className: text('className', 'ib')
        };

        return (
            <ShareBtn
                {...knobProps}
            />
        )
    });
