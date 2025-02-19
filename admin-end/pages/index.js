import { useRef, useState } from 'react';
import styles from '../styles/Login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {

  const email = useRef(null);
  const password = useRef(null);
  const [errorMessageEmail, setEmailerror] = useState("");
  const [errorMessagePassword, setPassworderror] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const router = useRouter();
  
  const handleSubmitClick=(e)=>{
    e.preventDefault();

    if(email.current.value === ""){
      setEmailerror("Enter your Email");
    }
    else{
      if(!emailRegex.test(email.current.value)){
        setEmailerror("Invalid Email Syntax");
      }
    }

    if(password.current.value === ""){
      setPassworderror("Enter your password");
    }

    if(email.current.value !== "" && password.current.value !== "" && emailRegex.test(email.current.value)){
      
      const user= {
        email: email.current.value ,
        password: password.current.value
      }

      fetch('/api/login',{
        method:"POST",
        body: JSON.stringify(user),
        headers: {"content-type" : "application/json"}  
      }).then(res=>res.json()).then(data=>{

        if(data.type === 'email'){
          setEmailerror(data.message);
          password.current.value = "";
        }

        else if(data.type === 'password'){
          setPassworderror(data.message);
          password.current.value = "";
        }

        else if(data.type === 'success'){
          email.current.value="";
          password.current.value = "";
          router.push('/dashboard');
        }

        else{
          setEmailerror(data.message);
          email.current.value="";
          password.current.value = "";
        }

      })
    }
  }

  return (
    <>
      <div className={styles.centeredImage}>
        <img src="/assets/images/imdb-logo.png" alt="IMDB Logo" />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.longNarrowBox}>
          <h2 className={styles.Portalheading}>Admin Portal </h2>
          <form className={styles.formStyle}>
            {/* Emaillllll */}
            <label className={styles.formLabel}>Email</label>
            <input type="text" className={styles.formInput} ref={email}  onChange={(e)=>{setEmailerror("")}}
            style={{ border: errorMessageEmail.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessageEmail.length > 0  && <p className={styles.errorMessage} >{errorMessageEmail}</p>}
            
            {/* Passworddddd */}
            <div className={styles.passwordContainer}>
              <label className={styles.formLabel}>Password</label>
              {/* <Link href="#" className={styles.forgotPassword}>Forgot password?</Link> */}
            </div>
            <input type="password" className={styles.formInput}  ref={password} onChange={(e)=>{setPassworderror("")}}
            style={{ border: errorMessagePassword.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessagePassword.length > 0  && <p className={styles.errorMessage} >{errorMessagePassword}</p>}
            
            {/* Submit Button */}
            <button type="submit" className={styles.submitButton} onClick={handleSubmitClick}>Sign in</button>
          </form>
        </div>
      </div>
    </>
  );
}