import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, array, text, boolean } from '@storybook/addon-knobs/react';

import ShareBtn from '../src';
import { BUTTON_TYPES } from '../src/utils';
import '../src/ShareButton.scss';

const stories = storiesOf('Share Button', module);

stories.addDecorator(withKnobs);

stories
    .add('default', () => {
        const knobProps = {
            isOpen: boolean('is Open', true),
            disabled: array('disabled', []),
            fbAppId: text('FB App ID', ''),
            shareUrl: text('Link', 'https://lana.global'),
            shareMessage: text('Message', 'Checkout my awesome website!'),
            buttonText: text('Button Text', 'Share'),
            className: text('className', 'ib')
        };

        return (
            <ShareBtn
                {...knobProps}
            />
        )
    });
