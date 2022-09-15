import React from 'react';
import "./login.styles.css";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import imgLogo from "../../assets/images/logo.png";
import { pages } from '../../constants/strings';
import TextField from '@material-ui/core/TextField';
import { authenticate } from './login.helper';

export default function Login(props) {
    const [values, setValues] = React.useState({
        emailId: '',
        password: '',
        showPassword: false,
    });
    const [errorMessage, setErrorMessage] = React.useState("");
    const handleChange = (prop) => (event) => {
        setErrorMessage("")
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {

        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const onForgotPasswordClick = () => {
        props.updateSelectedPage(pages.FORGOT_PASSWORD)
    }
    const onRegisterClick = () => {
        props.updateSelectedPage(pages.REGISTER)
    }
    const onLoginClick = async () => {
        try {
            props.showLoader("Logging in")
            let token = await authenticate(values.emailId, values.password);
            await localStorage.setItem("isAuthenticated", true);
            await localStorage.setItem("token", token);
            await localStorage.setItem("loginId", values.emailId);
            props.updateSelectedPage(pages.HOME)
            props.hideLoader();
        } catch (e) {
            setErrorMessage("Incorrect Credentials")
            props.hideLoader();
        }
    }
    
    return (
        <>
            <div style={{ 
                    backgroundImage:'url("https://img.freepik.com/premium-photo/twitter-logo-blue-wall-background-with-hard-shadow-space-text-graphics-3d-rendering_494516-1022.jpg")', 
                    backgroundRepeat:'no-repeat', backgroundSize:'cover' }}  className={"d-flex h-100 justify-content-center align-items-center"}>
                <div style={{ width: "30%", maxWidth: 400 }}>
                    <div>
                        <img src={imgLogo} height={200} width={200} />
                    </div>
                    <div>
                        <h2 style={{ fontFamily: "Barlow-Bold",color:"white", marginBottom: 20, textShadow:" 0 0 10px #00000f, 0 0 10px #00000f" }}>Log in to Tweet App</h2>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl  variant="outlined" fullWidth className="formControl">
                            <TextField InputLabelProps={{style : {color : 'white'} }} label="Login ID" variant="outlined"
                                onChange={handleChange('emailId')}
                                error={errorMessage != ""} />
                        </FormControl>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <FormControl variant="outlined" fullWidth>
                            <TextField  InputLabelProps={{style : {color : 'white'} }}  label="Password" variant="outlined"
                                type={values.showPassword ? 'text' : 'password'}
                                onChange={handleChange('password')}
                                error={errorMessage != ""}
                                helperText={errorMessage}
                                InputProps={{
                                    endAdornment:
                                        <>
                                            <InputAdornment position="end" >
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        </>
                                }} />
                        </FormControl>
                    </div>
                    <div>
                        {
                            (values.emailId != "" && values.password != "") ?
                                <button style={{borderColor:"white", borderWidth: 0.5, backgroundColor: "#1DA1F2", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }} onClick={onLoginClick}>Log in</button>
                                : <button style={{borderColor:"black", borderWidth: 0.1, backgroundColor: "#b9dbf0", color: "white", width: "100%", padding: 10, borderRadius: 20, marginBottom: 20 }}>Log in</button>
                        }
                    </div>
                    
                    <div>
                        <a style={{ cursor: "pointer", color: "black" ,textShadow:" 0 0 10px white, 0 0 10px white"  }} className="loginLink" onClick={onForgotPasswordClick}>Forgot Password?</a>
                    </div>
                    <div>
                        <a style={{ cursor: "pointer", color: "black",  textShadow:" 0 0 10px white, 0 0 10px white"  }} className="loginLink" onClick={onRegisterClick}>Sign Up for TweetApp</a>

                    </div>
                </div>
            </div>
        </>
    )

}