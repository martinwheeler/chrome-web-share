import { autobind } from 'core-decorators';
import React, { Component } from 'react';
import Visibility from './visibility';
import * as DEFAULTS from './utils';

@autobind
class SharePopup extends Component {
    constructor(props) {
        super(props);
    }

    static copyClicked(e) {
        const copyTarget = document.querySelector(e.currentTarget.dataset.copytarget || null);

        if (copyTarget && copyTarget.select) {
            copyTarget.select();


            try {
                document.execCommand('copy');
                copyTarget.blur();
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

    fbClicked() {}

    twitterClicked() {}

    gmailClicked() {}

    render() {
        const { disabled } = this.props;
        const text = this.props.text + ' ' + this.props.url;
        const gmailURL = `https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=${this.props.text}&body=Check out this awesome property %0A${this.props.url}`;

        return (
            <div className='share-popup'>
                {this.props.shareModalOpen && <Visibility ref={(node) => {
                    this.visibility = node
                }}/>}
                {!disabled.find(button => button === 'whatsApp') &&
                    <a className='sp-tab' href={`whatsapp://send?text=${text}`} onClick={this.whatsappClicked}>
                        <div className='icon whatsapp'/>
                        <span className='text'>WhatsApp</span>
                    </a>
                }
                {!disabled.find(button => button === 'facebook') &&
                    <a className='sp-tab'
                       href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(this.props.url)}&p[title]=${encodeURIComponent(this.props.text)}`}
                       onClick={this.fbClicked} target='_blank'>
                        <div className='icon fb'/>
                        <span className='text'>Facebook</span>
                    </a>
                }
                {!disabled.find(button => button === 'twitter') &&
                    <a className='sp-tab'
                       href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.props.text)}&url=${encodeURIComponent(this.props.url)}`}
                       onClick={this.twitterClicked} target='_blank'>
                        <div className='icon twitter'/>
                        <span className='text'>Twitter</span>
                    </a>
                }
                {!disabled.find(button => button === 'gmail') &&
                    <a className='sp-tab' href={gmailURL} onClick={this.gmailClicked} target='_blank'>
                        <div className='icon gmail'/>
                        <span className='text'>Mail</span>
                    </a>
                }
                {!disabled.find(button => button === 'copy') &&
                    <div className='sp-tab copy' onClick={SharePopup.copyClicked} data-copytarget='#url'>
                        <div className='copy-input'>
                            <input type='text' id='url' defaultValue={this.props.url} readOnly/>
                        </div>
                        <div className='copy-button'>
                            <div className='icon copy'/>
                            <span className='text'>Copy to clipboard</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

class ShareButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shareModalOpen: false
        };

        this.toggleShare = this.toggleShare.bind(this)
    }

    toggleShare() {
        if (!this.state.shareModalOpen && this.props.onShareButtonClick) {
            this.props.onShareButtonClick();
        }
        if (navigator && navigator.share !== undefined) {
            navigator.share({
                title: this.props.text,
                text: this.props.text + this.props.url,
                url: this.props.url
            }).then(() => console.log('Successful share'))
                .catch(error => console.log('Error sharing:', error))
        } else {
            document.body.style.overflow = !this.state.shareModalOpen ? 'hidden' : 'auto';
            this.setState({shareModalOpen: !this.state.shareModalOpen});
        }
    }

    render() {
        const { className } = this.props;
        return (
            <div className={className}>
                <div className={'share-btn'}>
                    <div onClick={this.toggleShare}>
                        {this.props.displayText}
                    </div>
                    <div className={`share-modal ${this.state.shareModalOpen ? 'open' : ''}`}>
                        <div className='overlay' onClick={this.toggleShare}/>
                        <SharePopup {...this.props} toggleShare={this.toggleShare}
                                    shareModalOpen={this.state.shareModalOpen}/>
                    </div>
                </div>
            </div>
        )
    }
}

ShareButton.propTypes = {
    url: React.PropTypes.string,
    text: React.PropTypes.string,
    displayText: React.PropTypes.string,
    onShareButtonClick: React.PropTypes.func
};

ShareButton.defaultProps = {
    url: DEFAULTS.DEFAULT_STRING,
    text: DEFAULTS.DEFAULT_STRING,
    displayText: 'Share',
    onShareButtonClick: DEFAULTS.DEFAULT_FUNCTION,
};

SharePopup.propTypes = {
    url: React.PropTypes.string,
    text: React.PropTypes.string,
    shareModalOpen: React.PropTypes.bool,
};

export default ShareButton;