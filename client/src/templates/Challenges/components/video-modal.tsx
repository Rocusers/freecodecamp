import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { closeModal } from '../redux/actions';
import { Modal } from '@freecodecamp/ui';
import { isVideoModalOpenSelector } from '../redux/selectors';
import callGA from '../../../analytics/call-ga';

interface VideoModalProps {
  closeVideoModal: () => void;
  isOpen?: boolean;
  t: (attribute: string) => string;
  videoUrl?: string;
}

const mapStateToProps = (state: unknown) => ({
  isOpen: isVideoModalOpenSelector(state) as boolean
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ closeVideoModal: () => closeModal('video') }, dispatch);

function VideoModal({
  closeVideoModal,
  isOpen,
  t,
  videoUrl
}: VideoModalProps): JSX.Element {
  if (isOpen) {
    callGA({ event: 'pageview', pagePath: '/completion-modal' });
  }
  return (
    <Modal onClose={closeVideoModal} size='large' open={isOpen as boolean}>
      <Modal.Header showCloseButton={true}>
        {t('buttons.watch-video')}
      </Modal.Header>
      <Modal.Body>
          <iframe
            data-playwright-test-label='video-modal-video-player-iframe'
            frameBorder='0'
            height='500px'
            width='100%'
            src={videoUrl}
            title={t('buttons.watch-video')}
          />
        <p>{t('learn.scrimba-tip')}</p>
      </Modal.Body>
    </Modal>
  );
}

VideoModal.displayName = 'VideoModal';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(VideoModal));
