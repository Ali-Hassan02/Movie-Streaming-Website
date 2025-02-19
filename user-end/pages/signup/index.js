import { useRef, useState } from 'react';
import styles from '../../styles/Login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Signup() {
  const router = useRouter();
  const { redirect } = router.query; 
  const username = useRef(null)
  const email = useRef(null);
  const password = useRef(null);
  const [errorMessageEmail, setEmailerror] = useState("");
  const [errorMessagePassword, setPassworderror] = useState("");
  const [UserNameerror, setUserNameerror] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  
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

    if(username.current.value === ""){
      setUserNameerror("Enter your username");
    }

    if(email.current.value !== "" && password.current.value !== "" && emailRegex.test(email.current.value)){
      
      const user= {
        username : username.current.value , 
        email: email.current.value ,
        password: password.current.value
      }


      fetch('/api/signup',{
        method:"POST",
        body: JSON.stringify(user),
        headers: {"content-type" : "application/json"}  
      }).then(res=>res.json()).then(data=>{

        if(data.type === 'User Exist'){
          setEmailerror(data.message);
          username.current.value = "";
          email.current.value = "";
          password.current.value = "";
        }

        

        else if (data.type === 'success') {
          username.current.value = "";
          email.current.value = "";
          password.current.value = "";
        
          const redirectUrl = redirect 
            ? `/login?redirect=${redirect}&new_email=${encodeURIComponent(data.user.email)}` 
            : `/login?new_email=${encodeURIComponent(data.user.email)}`; // Pass email as a query parameter
          router.push(redirectUrl);
        }
        
        

        else{
          setEmailerror(data.message);
          email.current.value="";
          password.current.value = "";
        }

      })
    }
  }

  const handlelogin = () => {
    router.push('/login')
  }
  return (
    <div className="w-full h-screen bg-white">
      <div className={styles.centeredImage}>
      <img src="/imdb-logo.png" alt="IMDB Logo" />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.longNarrowBox}>
          <h2 className={styles.Portalheading}>Sign Up</h2>
          <form className={styles.formStyle}>
            {/* Username */}
            <label className={styles.formLabel}>Username</label>
              <input type="text" className={styles.formInput} ref={username} autoComplete="off" onChange={(e)=>{setUserNameerror("")}}
              style={{ border: UserNameerror.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
              {UserNameerror.length > 0  && <p className={styles.errorMessage} >{UserNameerror}</p>}
            
            {/* Emaillllll */}
            <label className={styles.formLabel}>Email</label>
            <input type="text" className={styles.formInput} ref={email} autoComplete="off" onChange={(e)=>{setEmailerror("")}}
            style={{ border: errorMessageEmail.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessageEmail.length > 0  && <p className={styles.errorMessage} >{errorMessageEmail}</p>}
            
            {/* Passworddddd */}
            <div className={styles.passwordContainer}>
              <label className={styles.formLabel}>Password</label>
              
            </div>
            <input type="password" className={styles.formInput}  ref={password} autoComplete="off" onChange={(e)=>{setPassworderror("")}}
            style={{ border: errorMessagePassword.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessagePassword.length > 0  && <p className={styles.errorMessage} >{errorMessagePassword}</p>}
            
            {/* Submit Button */}
            <button type="submit" className={styles.submitButton} onClick={handleSubmitClick}>Create</button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a 
                  href="#" 
                  onClick={handlelogin}
                  className="font-semibold hover:underline transition duration-300"
                  style={{ color: "#0073e6" }}
                >
                  LogIn
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}