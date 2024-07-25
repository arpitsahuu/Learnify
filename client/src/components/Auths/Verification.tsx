import { styles } from "@/app/styles/style";
import { useActivationMutation, useSendMailQuery, } from "../../Store/auth/authApi";
import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const { refetch: resendMail, isFetching: isSendingMail } = useSendMailQuery(undefined, { skip: true }); // Initialize useSendMailQuery
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const [minutes,setminutes] = useState(1);
  const [seconds,setseconds] = useState(59);
  const [activeSendMain, setActiveSendMain] = useState(false);


  useEffect(() => {
    const interval = setInterval(()=>{
      if(seconds >0){
        setseconds(seconds -1);
      }
      if(seconds === 0){
        if(minutes === 0){
          clearInterval(interval)
          setActiveSendMain(true);
        } else{
          setseconds(59);
          setminutes(minutes -1);
        }
      }
    },1000)
  
    return () => {
      clearInterval(interval)
    }
  }, [seconds])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        console.log(errorData.data.message)
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log("An error occured:", error);
      }
    }
  }, [isSuccess, error,setRoute,setInvalidError]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    console.log("call")
    const verificationNumber = Object.values(verifyNumber).join("");
    console.log(verificationNumber)
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const resendOTPHandler = async () => {
    try {
      await resendMail();
      toast.success("OTP has been resent to your email.");
      setseconds(59);
      setminutes(1);
      setActiveSendMain(false)
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around mb-7">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#0000004a]"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="w-full flex justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          Verify OTP
        </button>
      </div>
      {/* <br /> */}
      <div className="w-full flex justify-between mt-3 px-2 ">
        <h3 className="text-gray-700 font-normal text-sm">Time Remaining {minutes}:{seconds}</h3>
        <button className={` underline  text-sm  font-semibold ${ !activeSendMain && "!cursor-no-drop opacity-[0.6]"} `} onClick={resendOTPHandler}>Resend OTP</button>

      </div>
      
      <h5 className="text-center pt- font-Poppins text-[14px] text-gray-800 dark:text-white mt-8">
        Go back to sign in?{" "}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
