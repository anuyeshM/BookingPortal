import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import CallAPI from '../../commons/callAPI';
import Config from '../../commons/config';
import PushAlert from '../../commons/notification';
import MobileLogin from './subcomponent/mobileLogin';
import TitleText from '../../elements/text/title';
import PasswordInput from '../../elements/input/passwordInput';
import PrimaryButton from '../../elements/button/primary';
import './login.css';
import PasswordInputAuth from '../../elements/input/PasswordInputAuth';
import PrimaryAuth from '../../elements/button/PrimaryAuth';
import eye from '../../assets/images/eye.png'
import eyeHide from '../../assets/images/eyeHide.png'
export default function ForgotPassword(props) {
  const history = useHistory();
  const apiConfig = useMemo(() => Config.api, []);
  const [accountId, setAccountId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [isResetAllowed, setResetAllowed] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [retypedPassword, setRetypedPassword] = useState('');
  const [counter, setCounter] = useState(0)
  const [passwordShown, setPasswordShown] = useState(true);
  const [seconds, setSeconds] = React.useState(10);
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const initiatePasswordReset = (params) => {
    setResetAllowed(true);
    setAccountId(params.data && params.data.userId);
    setTokenId(params.data && params.data.accessToken);
  };
  const submitPasswordChange = async () => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!<>@#\$%\^&\*)\(+=?_-])(?=.{8,})");
     setCounter(counter + 1)
  if(counter<=2){
          if(strongRegex.test(newPassword)) {
       if (newPassword !== retypedPassword) {
        PushAlert.warning('Passwords do not match!');
      } else {
        let apiResponse = await CallAPI.post(
          apiConfig.updatePassword,
          {
            accountId,
            password: newPassword,
          },
          tokenId
        );
          let responseObj = await apiResponse.json();
          PushAlert.info(responseObj.message || responseObj.status);
        history.push('/login');
      }
    } else {
      PushAlert.warning('Your password must be at least 8 characters and A mixture of both uppercase and lowercase letters and Inclusion of at least one special character, from ! @ # $ % ^ & * ( ) - _ = + ?');
    } 
           }else{
    PushAlert.warning('wait for 30 minutes');
         }
      };
     return (
    <div data-id="login-page" className="lp">
      <div className="login-form">
        <div className="login-view-area">
          <div className="login-title">Service Portal</div>
          <div className="pr-content">
            {isResetAllowed ? (
              <div className="pr-reset">
                <div className="inline wrapper">
                  <TitleText className="input-text">New:</TitleText>
                  <PasswordInputAuth
                  type={passwordShown ? "password" : "text"}
                  onPaste={(e)=>{
                    e.preventDefault()
                    return false;
                  }} onCopy={(e)=>{
                    e.preventDefault()
                    return false;
                  }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                   <PrimaryAuth
                    bgColor='blue'
                    width='-1rem'
                    fontColor='#000000'
                    onClick={togglePassword}
                  >
                    <img alt='eye' src={eye} id="show" width='20rem' style={{ display: (passwordShown ? 'none' : 'block') }}/>
                    <img alt='eyeHides' src={eyeHide} id="hide" width='20rem' style={{ display: (passwordShown ? 'block' : 'none') }}/>
                  </PrimaryAuth>
                </div>
                <div className="inline wrapper">
                  <TitleText className="input-text">Confirm:</TitleText>
                  <PasswordInput 
                  onPaste={(e)=>{
                    e.preventDefault()
                    return false;
                  }} onCopy={(e)=>{
                    e.preventDefault()
                    return false;
                  }}
                  value={retypedPassword} onChange={(e) => setRetypedPassword(e.target.value)} />
                </div>
                <div className="lp-submit">
                  <PrimaryButton bgColor="blue" width="10rem" fontColor="#fff" onClick={submitPasswordChange}>
                    Submit
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <div className="pr-validation">
                <MobileLogin isTentative={true} nextActions={initiatePasswordReset} validationApi={apiConfig.loginWithPwd} callback={initiatePasswordReset} />
                <div className="lp-goback">
                  <PrimaryButton bgColor="blue" width="9rem" fontColor="#fff" onClick={(e) => history.push('/login/email')}>
                    Go Back
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
