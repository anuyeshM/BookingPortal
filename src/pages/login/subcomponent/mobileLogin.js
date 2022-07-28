import React, { useState, useMemo, useContext, useEffect, useRef } from 'react';
import AuthContext from '../../../auth/authContext';
import { useHistory } from 'react-router-dom';
import CallAPI from '../../../commons/callAPI';
import Config from '../../../commons/config';
import PushAlert from '../../../commons/notification';
import TitleText from '../../../elements/text/title';
import TextInput from '../../../elements/input/textInput';
import LinkText from '../../../elements/text/link';
import PrimaryButton from '../../../elements/button/primary';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withWidth } from '@material-ui/core';
export default function (props) {
  const history = useHistory();
  const apiConfig = useMemo(() => Config.api, []);
  const appConfig = useMemo(() => Config.appDetails, []);
  const AuthManager = useContext(AuthContext);
  const [isRequestedOTP, setRequestedOTP] = useState(false);
  const [mobileNo, setMobileNo] = useState('+91 ');
  const [validOtp, setValidOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [disable, setDisable] = useState(false);
  const [fontColor, setfontColor] = useState('#FFFFFF');
  const Ref = useRef(null);
  const [timer, setTimer] = useState('00');
        const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        return {
        total, seconds
        };
    }
        const startTimer = (e) => {
        let { total, seconds } 
         = getTimeRemaining(e);
        if (total >= 0) {
              setTimer(
                (seconds > 30 ? seconds : '0' + seconds)
            )
        }
        else {
          setDisable(false)}
          setfontColor('#FFFFFF');
    }
       const clearTimer = (e) => {
          setTimer('30');
          if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
      const getDeadTime = () => {
        let deadline = new Date();
          deadline.setSeconds(deadline.getSeconds() + 30);
        return deadline;
    }
    const onClickReset = () => {
        clearTimer(getDeadTime());
    }
  useEffect(() => {
    props.passIfLoggedIn && props.passIfLoggedIn();
  }, []);
  const requestOtp = async () => {
    setfontColor('#ff3503');
    clearTimer(getDeadTime())
    setDisable(true)
      let apiResponse = await CallAPI.post(apiConfig.generateOtp, {
      contact: mobileNo.replace(/[^0-9]|[\s]/g, ''),
    });
    let responseObj = await apiResponse.json();
    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
      setRequestedOTP(true);
      PushAlert.success(responseObj.message || responseObj.status);
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  };
  const submitOtp = async () => {
    let apiResponse = await CallAPI.patch(
      props.validationApi || apiConfig.loginWithPwd,
      {
        username: mobileNo.replace(/[^0-9]|[\s]/g, ''),
        password: validOtp,
        resource: appConfig.appName
      }
    );
   let responseObj = await apiResponse.json();
      if (200 === +responseObj.status && 'success' === responseObj.type) {
      // set logged in user details to context
      !props.isTentative &&
        AuthManager.initiateLogin(
          responseObj,
          props.callback
            ? () => props.callback(responseObj)
            : () => AuthManager.handleAuthentication(history, '/dashboard')
        );

      // check if next actions to perform
      props.nextActions && props.nextActions(responseObj);
    } else {
      PushAlert.error(responseObj.messaage);
    }
  };
  return (
    <div className='login-otp'>
      {isRequestedOTP ? (
        <div className='inline wrapper'>
          <TitleText className='input-text'>Enter OTP:</TitleText>
          <TextInput
             value={validOtp}
            onChange={(e) => setValidOtp(e.target.value)}
            onKeyUp={(e) =>
              'Enter' === e.key ? submitOtp() : e.preventDefault()
            }
          />
        </div>
      ) : (
        <div className='inline wrapper'>
          <TitleText className='input-text'>Mobile No:</TitleText>
          <TextInput
            value={mobileNo}
            maxLength={14}
            onChange={(e) => setMobileNo(e.target.value)}
            onKeyUp={(e) =>
              'Enter' === e.key ? requestOtp() : e.preventDefault()
            }
          />
        </div>
      )}
      <div className={`login-options ${props.isTentative ? 'hidden' : ''}`}>
      </div>
      <div>
      <div><LinkText
          textAlign='left'
          onClick={(e) => history.push(`/login/email`)}
        >
          Login with Password
        </LinkText></div>
        <div><LinkText
          textAlign='left'
          onClick={(e) => history.push(`/forgotPassword`)}
        >
          Forgot Password?
        </LinkText> 
        </div>
      </div>
      <div>
<div>
      <Button  disabled={disable} fontColor={fontColor} style={{ color: "white", background: "#364984", width:"140px",height:"33px",fontSize:"12px",float:"left"}} onClick={requestOtp}>
        Resend OTP?  {timer}
       </Button>
</div>
<div className='login-action'>
          {isRequestedOTP ? (
          <PrimaryButton fontColor='#fff' onClick={submitOtp}>
            Submit
          </PrimaryButton>
        ) : (
          <PrimaryButton fontColor='#fff' onClick={requestOtp}>
            Request OTP
          </PrimaryButton>
        )}
        </div>
        </div>
        </div> 
  );
}
