import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toggleModal } from '../../store/actions/ui.actions';

interface IProps {
  modalKey: string;
  title: string;
  content: ReactNode;
}

export const DefaultModal = ({ modalKey, title, content }: IProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const modal = useSelector<any, any>(state => state.uiReducer.modal);

  const dispatch = useDispatch();

  useEffect(() => {
    //watches for changes on modal object (coming from our state!)

    if (modal.key === modalKey && modal.isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [modalKey,modal]);

  const onBackdropClick = async () => {
    //close modal
    await dispatch(toggleModal(modalKey, false));
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        onBackdropClick={() => onBackdropClick()}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{title}</h2>
            {content}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);
