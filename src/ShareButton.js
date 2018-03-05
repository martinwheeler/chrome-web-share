import _ from 'lodash';
import Types from 'prop-types';
import { autobind } from 'core-decorators';
import React, { PureComponent } from 'react';
import Visibility from './visibility';
import { DEFAULT_FUNCTION, DEFAULT_STRING, KEYCODE_ESCAPE, BUTTON_TYPES } from './utils';
import { css } from 'glamor';

const whatsAppSvg = require('./assets/whatsapp.svg');
const messengerSvg = require('./assets/messenger.svg');
const facebookSvg = require('./assets/facebook.svg');
const twitterSvg = require('./assets/twitter.svg');
const gmailSvg = require('./assets/gmail.svg');
const copySvg = require('./assets/content_copy.svg');

const iconContainer = css({
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    lineHeight: '40px'
});

const copyButton = css({
    cursor: 'pointer'
});

const iconStyles = {
    width: '30px',
    height: '30px',
    paddingRight: '12px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
};

const whatsAppIconStyles = css({
    backgroundImage: `url(${whatsAppSvg})`,
    ...iconStyles,
});

const smsIconStyles = css({
    backgroundImage: `url(${messengerSvg})`,
    ...iconStyles
});

const facebookIconStyles = css({
    backgroundImage: `url(${facebookSvg})`,
    ...iconStyles
});

const twitterIconStyles = css({
    backgroundImage: `url(${twitterSvg})`,
    ...iconStyles
});

const gmailIconStyles = css({
    backgroundImage: `url(${gmailSvg})`,
    ...iconStyles
});

const copyIconStyles = css({
    backgroundImage: `url(${copySvg})`,
    ...iconStyles
});

@autobind
class Overlay extends PureComponent {
    static propTypes = {
        disabled: Types.array,
        overlayOpen: Types.bool,
        shareUrl: Types.string,
        shareMessage: Types.string,
        fbAppId: Types.string,
        fbDisplayType: Types.string,
        onCopySuccess: Types.func
    };

    static defaultProps = {
        disabled: [],
        overlayOpen: false,
        shareUrl: '',
        shareMessage: '',
        fbAppId: '',
        fbDisplayType: 'touch',
        onCopySuccess: () => {
        }
    };

    get messageAndLink() {
        const { shareUrl, shareMessage } = this.props;
        return `${shareMessage} ${shareUrl}`;
    }

    isShareDisabled(type) {
        const { disabled } = this.props;
        return disabled && _.includes(disabled, type);
    }

    constructor(props) {
        super(props);
    }

    handleCopyLink(e) {
        const { onCopySuccess } = this.props;
        const copyTarget = document.querySelector(e.currentTarget.dataset.copytarget || null);

        if (copyTarget && copyTarget.select) {
            copyTarget.select();

            try {
                document.execCommand('copy');
                copyTarget.blur();

                onCopySuccess(copyTarget.value);
            } catch (err) {
                alert('Your device does not support copying, please copy manually.');
            }
        }
    }

    /**
     * Helper function to open the App Store if the share does not trigger WhatsApp to launch.
     */
    handleWhatsAppShare() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const delay = 1000;
        const start = new Date().getTime();

        let link = /android/i.test(userAgent)
            ? 'https://play.google.com/store/apps/details?id=com.whatsapp'
            : /iPad|iPhone|iPod/i.test(userAgent)
                ? 'https://itunes.apple.com/app/id310633997'
                : 'https://api.whatsapp.com/send?text=' + encodeURIComponent(this.messageAndLink);

        // Checks to see if whatsapp share launched otherwise lets show the user a donwload link for whatsapp
        setTimeout(() => {
            let end = new Date().getTime();
            if ((this.visibility && this.visibility.isHidden()) || (end - start >= delay * 2)) return;

            window.open(link, '_blank');
        }, delay);
    }

    handleFacebookShare() {
    }

    handleTwitterShare() {
    }

    handleEmailShare() {
    }

    setVisibilityRef(node) {
        this.visibility = node;
    }

    render() {
        const {
            shareMessage,
            shareUrl,
            fbAppId,
            fbDisplayType
        } = this.props;

        const gmailLink = `https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=${shareMessage}&body=${shareUrl}`;
        const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
        const facebookLink = `https://www.facebook.com/dialog/share?app_id=${fbAppId}&display=${fbDisplayType}&href=${encodeURIComponent(shareUrl)}`;
        const smsLink = `sms:?body=${encodeURIComponent(this.messageAndLink)}`;

        return (
            <div className='share-popup'>
                {this.props.overlayOpen && <Visibility ref={this.setVisibilityRef}/>}

                {!this.isShareDisabled(BUTTON_TYPES.WHATSAPP) &&
                <a {...iconContainer} href={`whatsapp://send?text=${encodeURIComponent(this.messageAndLink)}`}
                   onClick={this.handleWhatsAppShare}>
                    <span {...whatsAppIconStyles} />
                    <span className='shareMessage'>WhatsApp</span>
                </a>
                }
                {!this.isShareDisabled(BUTTON_TYPES.SMS) &&
                <a href={smsLink} target='_blank' {...iconContainer}>
                    <span {...smsIconStyles} />
                    <span className='shareMessage'>SMS</span>
                </a>
                }
                {!this.isShareDisabled(BUTTON_TYPES.FACEBOOK) &&
                <a {...iconContainer}
                   href={facebookLink}
                   onClick={this.handleFacebookShare} target='_blank'>
                    <span {...facebookIconStyles}/>
                    <span className='shareMessage'>Facebook</span>
                </a>
                }
                {!this.isShareDisabled(BUTTON_TYPES.TWITTER) &&
                <a {...iconContainer}
                   href={twitterLink}
                   onClick={this.handleTwitterShare} target='_blank'>
                    <span {...twitterIconStyles}/>
                    <span className='shareMessage'>Twitter</span>
                </a>
                }
                {!this.isShareDisabled(BUTTON_TYPES.GMAIL) &&
                <a {...iconContainer} href={gmailLink} onClick={this.handleEmailShare} target='_blank'>
                    <span {...gmailIconStyles}/>
                    <span className='shareMessage'>Mail</span>
                </a>
                }
                {!this.isShareDisabled(BUTTON_TYPES.COPY) &&
                <div className='sp-tab copy' onClick={this.handleCopyLink} data-copytarget='#shareUrl'>
                    <div className='copy-input'>
                        <input type='text' id='shareUrl' value={shareUrl} readOnly/>
                    </div>
                    <div {...css(iconContainer, copyButton)}>
                        <span {...copyIconStyles}/>
                        <span className='shareMessage'>Copy to clipboard</span>
                    </div>
                </div>
                }
            </div>
        )
    }
}

const shareButton = css({
   cursor: 'pointer'
});

@autobind
class ShareButton extends PureComponent {
    static propTypes = {
        shareUrl: Types.string,
        shareMessage: Types.string,
        buttonText: Types.string,
        onButtonClick: Types.func,
        onCopySuccess: Types.func,
        fbAppId: Types.string.isRequired
    };

    static defaultProps = {
        shareUrl: DEFAULT_STRING,
        shareMessage: DEFAULT_STRING,
        buttonText: 'Share',
        onButtonClick: DEFAULT_FUNCTION
    };

    constructor(props) {
        super(props);

        this.state = {
            overlayOpen: false
        };

        if (props.shouldCloseOnEscape) {
            document.addEventListener('keyup', (e) => {
                if (e.keyCode === KEYCODE_ESCAPE) {
                    this.setState({ overlayOpen: false });
                }
            });
        }
    }

    toggleShare() {
        const { onButtonClick, shareMessage, shareUrl, isOpen } = this.props;
        const { overlayOpen } = this.state;

        if (!overlayOpen && onButtonClick) {
            onButtonClick();
        }

        if (navigator && navigator.share) {
            navigator.share({
                title: shareMessage,
                text: shareMessage + shareUrl,
                url: shareUrl
            })
                .then(() => console.log('Successful share'))
                .catch(error => console.log('Error sharing:', error))
        } else {
            if (!isOpen) {
                document.body.style.overflow = !overlayOpen ? 'hidden' : 'auto';
                this.setState({ overlayOpen: !overlayOpen });
            }
        }
    }

    render() {
        const {
            className,
            buttonText,
            shouldCloseOnEscape,
            disabled,
            shareUrl,
            shareMessage,
            onCopySuccess,
            fbAppId,
            isOpen
        } = this.props;
        const { overlayOpen } = this.state;

        const overlayProps = {
            disabled,
            shareUrl,
            shareMessage,
            onCopySuccess,
            fbAppId
        };

        return (
            <div className={className}>
                <div {...shareButton} onClick={this.toggleShare}>
                    {buttonText}
                </div>
                <div className={`share-modal ${overlayOpen || isOpen ? 'open' : ''}`}>
                    <div className='overlay' onClick={this.toggleShare}/>
                    <Overlay
                        {...overlayProps}
                        toggleShare={this.toggleShare}
                        overlayOpen={this.state.overlayOpen}
                    />
                </div>
            </div>
        )
    }
}

export default ShareButton;