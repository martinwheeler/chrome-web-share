// @flow
import Types from 'prop-types';
import { autobind } from 'core-decorators';
import React, { PureComponent } from 'react';
import Visibility from './visibility';
import { DEFAULT_FUNCTION, DEFAULT_STRING, KEYCODE_ESCAPE} from './utils';

@autobind
class PopupModal extends PureComponent<Types> {
    static propTypes = {
        modelOpen: Types.bool,
        shareUrl: Types.string,
        onCopySuccess: Types.func,
        shareMessage: Types.string,
        fbAppId: Types.string,
        fbDisplayType: Types.string
    };

    static defaultProps = {
        shareUrl: '',
        shareMessage: '',
        modelOpen: false,
        fbAppId: '',
        fbDisplayType: 'touch',
        onCopySuccess: () => {}
    };

    constructor(props) {
        super(props);
    }

    copyClicked(e) {
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

    whatsappClicked() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera
        let link = '';
        if (/android/i.test(userAgent)) {
            link = 'https://play.google.com/store/apps/details?id=com.whatsapp'
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            link = 'https://itunes.apple.com/app/id310633997'
        }
        const delay = 1000;
        const start = new Date().getTime();
        setTimeout(() => {
            let end = new Date().getTime();
            if ((this.visibility && this.visibility.isHidden()) || (end - start >= delay * 2)) return;
            window.open(link, '_blank');
        }, delay)
    }

    fbClicked() {
    }

    twitterClicked() {
    }

    gmailClicked() {
    }

    render() {
        const { disabled, shareMessage, shareUrl, fbAppId, fbDisplayType } = this.props;
        const formattedMessage = this.props.shareMessage + ' ' + this.props.shareUrl;
        const gmailURL = `https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=${shareMessage}&body=${shareUrl}`;

        return (
            <div className='share-popup'>
                {this.props.modelOpen && <Visibility ref={(node) => {
                    this.visibility = node
                }}/>}
                {!disabled.find(button => button === 'whatsApp') &&
                <a className='sp-tab' href={`whatsapp://send?shareMessage=${formattedMessage}`} onClick={this.whatsappClicked}>
                    <div className='icon whatsapp'/>
                    <span className='shareMessage'>WhatsApp</span>
                </a>
                }
                {!disabled.find(button => button === 'facebook') &&
                <a className='sp-tab'
                   href={`https://www.facebook.com/dialog/share?app_id=${fbAppId}&display=${fbDisplayType}&href=${encodeURIComponent(shareUrl)}`}
                   onClick={this.fbClicked} target='_blank'>
                    <div className='icon fb'/>
                    <span className='shareMessage'>Facebook</span>
                </a>
                }
                {!disabled.find(button => button === 'twitter') &&
                <a className='sp-tab'
                   href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`}
                   onClick={this.twitterClicked} target='_blank'>
                    <div className='icon twitter'/>
                    <span className='shareMessage'>Twitter</span>
                </a>
                }
                {!disabled.find(button => button === 'gmail') &&
                <a className='sp-tab' href={gmailURL} onClick={this.gmailClicked} target='_blank'>
                    <div className='icon gmail'/>
                    <span className='shareMessage'>Mail</span>
                </a>
                }
                {!disabled.find(button => button === 'copy') &&
                <div className='sp-tab copy' onClick={this.copyClicked} data-copytarget='#shareUrl'>
                    <div className='copy-input'>
                        <input type='text' id='shareUrl' defaultValue={shareUrl} readOnly/>
                    </div>
                    <div className='copy-button'>
                        <div className='icon copy'/>
                        <span className='shareMessage'>Copy to clipboard</span>
                    </div>
                </div>
                }
            </div>
        )
    }
}

@autobind
class Button extends PureComponent {
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
            modelOpen: false
        };

        if (props.shouldCloseOnEscape) {
            document.addEventListener('keyup', (e) => {
                if (e.keyCode === KEYCODE_ESCAPE) {
                    this.setState({ modelOpen: false });
                }
            });
        }
    }

    toggleShare() {
        const { onButtonClick, shareMessage, shareUrl } = this.props;
        const { modelOpen } = this.state;

        if (!modelOpen && onButtonClick) {
            onButtonClick();
        }

        if (navigator && !!navigator.share) {
            navigator.share({
                title: shareMessage,
                text: shareMessage + shareUrl,
                url: shareUrl
            })
                .then(() => console.log('Successful share'))
                .catch(error => console.log('Error sharing:', error))
        } else {
            document.body.style.overflow = !modelOpen ? 'hidden' : 'auto';
            this.setState({ modelOpen: !modelOpen });
        }
    }

    render() {
        const { className, buttonText, shouldCloseOnEscape, disabled, shareUrl, shareMessage, onCopySuccess, fbAppId } = this.props;
        const { modelOpen } = this.state;

        const popupProps = {
            disabled,
            shareUrl,
            shareMessage,
            onCopySuccess,
            fbAppId
        };

        return (
            <div className={className}>
                <div className={'share-btn'} onClick={this.toggleShare}>
                    {buttonText}
                </div>
                <div className={`share-modal ${modelOpen ? 'open' : ''}`}>
                    <div className='overlay' onClick={this.toggleShare}/>
                    <PopupModal
                        {...popupProps}
                        toggleShare={this.toggleShare}
                        modelOpen={this.state.modelOpen}
                    />
                </div>
            </div>
        )
    }
}

export default Button;