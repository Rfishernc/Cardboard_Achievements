import React from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import './notification.scss';

class notification extends React.Component {
  render() {
    return(
      <div className='notification'>
        <div className="p-3 my-2 rounded">
          <Toast>
            <ToastHeader>
              Reactstrap
            </ToastHeader>
            <ToastBody>
              This is a toast on a white background — check it out!
            </ToastBody>
          </Toast>
        </div>
      </div>
    );
  }
}

export default notification;