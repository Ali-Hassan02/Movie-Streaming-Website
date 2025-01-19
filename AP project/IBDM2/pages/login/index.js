import { useRef, useState , useEffect } from 'react';
import styles from '../../styles/Login.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  
  const email = useRef(null);
  const password = useRef(null);
  const [errorMessageEmail, setEmailerror] = useState("");
  const [errorMessagePassword, setPassworderror] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const router = useRouter();
  const { redirect , new_email } = router.query;
  useEffect(() => {
   
    if (new_email) {
      const decodedEmail = decodeURIComponent(new_email);
      email.current.value = decodedEmail;
      
    }
    
  }, [new_email]);
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
        console.log('here is data' , data)
        if(data.type === 'email'){
          setEmailerror(data.message);
          password.current.value = "";
        }

        else if(data.type === 'password'){
          setPassworderror(data.message);
          password.current.value = "";
        }

        else if(data.type === 'success'){
          console.log('sucess cnsidn cidsuncn ciodsnca cads')
          email.current.value="";
          password.current.value = "";
          if (redirect) {
            router.push(redirect); // Redirect to the original page the user wanted to visit
          } else {
            router.push('/'); // Default to home if no redirect URL exists
          }
        }

        else{
          setEmailerror(data.message);
          email.current.value="";
          password.current.value = "";
        }

      })
    }
  }
  const handleSignUp = () => {
    const redirectUrl = redirect ? redirect : '/'; // Use the redirect URL if available, or default to home
    router.push({
      pathname: '/signup',
      query: { redirect: redirectUrl }, // Add redirect as a query parameter
    });
  };
  

  return (
    <div className="w-full h-screen bg-white">
    
      <div className={styles.centeredImage}>
        <img src="/imdb-logo.png" alt="IMDB Logo" />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.longNarrowBox}>
          <h2 className={styles.Portalheading}>User Login </h2>
          <form className={styles.formStyle}>
            {/* Emaillllll */}
            <label className={styles.formLabel}>Email</label>
            <input type="text" className={styles.formInput} ref={email} autoComplete="off" onChange={(e)=>{setEmailerror("")}}
            style={{ border: errorMessageEmail.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessageEmail.length > 0  && <p className={styles.errorMessage} >{errorMessageEmail}</p>}
            
            {/* Passworddddd */}
            <div className={styles.passwordContainer}>
              <label className={styles.formLabel}>Password</label>
              {/* <Link href="#" className={styles.forgotPassword}>Forgot password?</Link> */}
            </div>
            <input type="password" className={styles.formInput} autoComplete="off" ref={password} onChange={(e)=>{setPassworderror("")}}
            style={{ border: errorMessagePassword.length > 0 ? '1px solid red' : '1px solid #ccc'}}/>
            {errorMessagePassword.length > 0  && <p className={styles.errorMessage} >{errorMessagePassword}</p>}
            
            {/* Submit Button */}
            <button type="submit" className={styles.submitButton} onClick={handleSubmitClick}>Login</button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <a 
                  href="#" 
                  onClick={handleSignUp}
                  className="font-semibold hover:underline transition duration-300"
                  style={{ color: "#0073e6" }}
                >
                  Sign Up
                </a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}