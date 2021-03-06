import _ from "lodash";
import { autobind } from "core-decorators";
import React, { PureComponent } from "react";
import Visibility from "./visibility";
import {
  DEFAULT_FUNCTION,
  DEFAULT_STRING,
  KEYCODE_ESCAPE,
  BUTTON_TYPES
} from "./utils";

@autobind
class PopupModal extends PureComponent {
  static defaultProps = {
    disabled: [BUTTON_TYPES.EMAIL],
    modelOpen: false,
    shareUrl: "",
    shareMessage: "",
    fbAppId: "",
    fbDisplayType: "touch",
    onCopySuccess: () => {},
    copyText: "Copy to clipboard"
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
    const copyTarget = document.querySelector(
      e.currentTarget.dataset.copytarget || null
    );

    if (copyTarget && copyTarget.select) {
      copyTarget.select();

      try {
        document.execCommand("copy");
        copyTarget.blur();

        onCopySuccess(copyTarget.value);
      } catch (err) {
        alert("Your device does not support copying, please copy manually.");
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
      ? "https://play.google.com/store/apps/details?id=com.whatsapp"
      : /iPad|iPhone|iPod/i.test(userAgent)
      ? "https://itunes.apple.com/app/id310633997"
      : "https://api.whatsapp.com/send?text=" +
        encodeURIComponent(this.messageAndLink);

    // Checks to see if whatsapp share launched otherwise lets show the user a donwload link for whatsapp
    setTimeout(() => {
      let end = new Date().getTime();
      if (
        (this.visibility && this.visibility.isHidden()) ||
        end - start >= delay * 2
      )
        return;

      window.open(link, "_blank");
    }, delay);
  }

  handleFacebookShare() {}

  handleTwitterShare() {}

  handleEmailShare() {}

  setVisibilityRef(node) {
    this.visibility = node;
  }

  render() {
    const {
      shareMessage,
      shareUrl,
      fbAppId,
      fbDisplayType,
      emailAddress,
      copyText
    } = this.props;

    const gmailLink = `https://mail.google.com/mail/u/0/?view=cm&ui=2&tf=0&fs=1&su=${shareMessage}&body=${shareUrl}`;
    const emailLink = `mailto:${emailAddress}?body=${shareMessage}`;
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareMessage
    )}&url=${encodeURIComponent(shareUrl)}`;
    const facebookLink = `https://www.facebook.com/dialog/share?app_id=${fbAppId}&display=${fbDisplayType}&href=${encodeURIComponent(
      shareUrl
    )}`;

    return (
      <div className="share-popup">
        {this.props.modelOpen && <Visibility ref={this.setVisibilityRef} />}

        {!this.isShareDisabled(BUTTON_TYPES.WHATSAPP) && (
          <a
            className="sp-tab"
            href={`whatsapp://send?text=${encodeURIComponent(
              this.messageAndLink
            )}`}
            onClick={this.handleWhatsAppShare}
          >
            <div className="icon whatsapp" />
            <span className="shareMessage">WhatsApp</span>
          </a>
        )}
        {!this.isShareDisabled(BUTTON_TYPES.FACEBOOK) && (
          <a
            className="sp-tab"
            href={facebookLink}
            onClick={this.handleFacebookShare}
            target="_blank"
          >
            <div className="icon fb" />
            <span className="shareMessage">Facebook</span>
          </a>
        )}
        {!this.isShareDisabled(BUTTON_TYPES.TWITTER) && (
          <a
            className="sp-tab"
            href={twitterLink}
            onClick={this.handleTwitterShare}
            target="_blank"
          >
            <div className="icon twitter" />
            <span className="shareMessage">Twitter</span>
          </a>
        )}
        {!this.isShareDisabled(BUTTON_TYPES.GMAIL) && (
          <a
            className="sp-tab"
            href={gmailLink}
            onClick={this.handleEmailShare}
            target="_blank"
          >
            <div className="icon gmail" />
            <span className="shareMessage">Mail</span>
          </a>
        )}
        {!this.isShareDisabled(BUTTON_TYPES.EMAIL) && emailAddress && (
          <a className="sp-tab" href={emailLink}>
            <div className="icon gmail" />
            <span className="shareMessage">E-Mail</span>
          </a>
        )}
        {!this.isShareDisabled(BUTTON_TYPES.COPY) && (
          <div
            className="sp-tab copy"
            onClick={this.handleCopyLink}
            data-copytarget="#shareUrl"
          >
            <div className="copy-input">
              <input type="text" id="shareUrl" value={shareUrl} readOnly />
            </div>
            <div className="copy-button">
              <div className="icon copy" />
              <span className="shareMessage">{copyText}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

@autobind
class Button extends PureComponent {
  static defaultProps = {
    shareUrl: DEFAULT_STRING,
    shareMessage: DEFAULT_STRING,
    onButtonClick: DEFAULT_FUNCTION
  };

  constructor(props) {
    super(props);

    this.state = {
      modelOpen: false
    };

    if (props.shouldCloseOnEscape) {
      document.addEventListener("keyup", e => {
        if (e.keyCode === KEYCODE_ESCAPE) {
          this.setState({ modelOpen: false });
        }
      });
    }
  }

  toggleShare() {
    const {
      onButtonClick,
      shareMessage,
      shareUrl,
      disableWebShareAPI
    } = this.props;
    const { modelOpen } = this.state;

    if (!modelOpen && onButtonClick) {
      onButtonClick();
    }

    if (navigator && !!navigator.share && !disableWebShareAPI) {
      navigator
        .share({
          title: shareMessage,
          text: shareMessage + shareUrl,
          url: shareUrl
        })
        .then(() => console.log("Successful share"))
        .catch(error => console.log("Error sharing:", error));
    } else {
      document.body.style.overflow = !modelOpen ? "hidden" : "auto";
      this.setState({ modelOpen: !modelOpen });
    }
  }

  render() {
    const {
      className,
      children,
      disabled,
      shareUrl,
      shareMessage,
      onCopySuccess,
      fbAppId,
      emailAddress,
      copyText
    } = this.props;
    const { modelOpen } = this.state;

    const popupProps = {
      disabled,
      shareUrl,
      shareMessage,
      onCopySuccess,
      fbAppId,
      emailAddress,
      copyText
    };

    return (
      <div className={className}>
        <div className={"share-btn"} onClick={this.toggleShare}>
          {children}
        </div>
        <div className={`share-modal ${modelOpen ? "open" : ""}`}>
          <div className="overlay" onClick={this.toggleShare} />
          <PopupModal
            {...popupProps}
            toggleShare={this.toggleShare}
            modelOpen={this.state.modelOpen}
          />
        </div>
      </div>
    );
  }
}

export default Button;
