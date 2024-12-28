"use client";

import { ChangeEvent, FormEvent, useState } from "react";
// import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { useAppSelector } from "@/Redux/Hooks";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import SocialMediaIcons from "./SocialMediaIcons";

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginForm = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassWord, setShowPassWord] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailOrPhone = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setEmailOrPhone(inputValue);
    setEmail("");

    if (emailPattern.test(inputValue)) {
      setIsEmail(true);
      setEmail(inputValue);
      toast.success("Valid email");
      setDisableBtn(false);
    } else {
      setIsEmail(false);
      if (/^\d+$/.test(inputValue) && inputValue.length <= 10) {
        inputValue = inputValue.replace(/[^\d]/g, "").slice(0, 10);
        setEmailOrPhone(inputValue);
        setDisableBtn(false);
      } else {
        // toast.error("Invalid input");
        setDisableBtn(true);
      }
    }
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
    const validations = [
      { condition: inputValue.trim() === "", message: "Password is required." },
      {
        condition: !/(?=.*[a-z])/.test(inputValue),
        message: "Include at least one lowercase letter.",
      },
      {
        condition: !/(?=.*[A-Z])/.test(inputValue),
        message: "Include at least one uppercase letter.",
      },
      {
        condition: !/(?=.*\d)/.test(inputValue),
        message: "Include at least one digit.",
      },
      {
        condition: !/(?=.*[@$!%*?&])/.test(inputValue),
        message: "Include at least one special character (@$!%*?&).",
      },
      {
        condition: inputValue.length < 8,
        message: "Password must be at least 8 characters long.",
      },
      {
        condition: !passwordPattern.test(inputValue),
        message: "Invalid password",
      },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast.error(validation.message);
        setDisableBtn(true);
        return;
      }
    }

    toast.success("Valid password!");
    setDisableBtn(false);
  };

  const handleAdminAuthLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailOrPhone) {
      if (isEmail) {
        if (!email || !password) {
          return toast.error("Please enter your email and password!");
        }
      } else {
        return toast.error("Please enter your phone number!");
      }
      // return toast.error("Please provide credentials!");
    }

    setSubmitting(true);
    const login = async () => {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: isEmail ? email : "",
          phone_number: !isEmail ? emailOrPhone : "",
          otp,
          password,
        });
        console.log("res:", res);

        if (res?.error) {
          if (res.error === "OTP_SENT") {
            toast.info("OTP sent to your phone. Please enter the OTP.");
            setShowOtpInput(true);
            setSubmitting(false);
            setDisableBtn(false);
            return;
          }
          console.log(res.error);
          setSubmitting(false);
          throw new Error("User doesn't exist or Invalid e-mail or password!");
        }

        if (res?.url) {
          console.log(res?.url);

          setSubmitting(true);
          setSuccess(true);
          router.replace("/");
          // Cookies.set("token", JSON.stringify(true));
          router.push(`${process.env.PUBLIC_URL}/${i18LangStatus}/dashboard`);
          return "Logged in successfully!";
        } else {
          setSubmitting(false);
          throw new Error("Something went wrong, please try again!");
        }
      } catch (error) {
        setSubmitting(false);
        throw error;
      }
    };
    toast.promise(login(), {
      pending: "Logging in...",
      success: "Logged in successfully!",
      error: "Something went wrong, please try again!",
      // error: (error: any) => error.message || 'An error occurred.',
    });
  };

  return (
    <Form className="form-horizontal auth-form" onSubmit={handleAdminAuthLogin}>
      <FormGroup>
        <Label className="form-label" for="emailOrPhone">
          E-mail or Phone Number
        </Label>
        <Input
          required
          onChange={handleEmailOrPhone}
          type={isEmail ? "email" : "text"}
          value={emailOrPhone}
          placeholder="E-mail or Phone Number"
        />
      </FormGroup>
      {isEmail && (
        <FormGroup>
          <Label className="form-label" for="password">
            Password
          </Label>
          <InputGroup onClick={() => setShowPassWord(!showPassWord)}>
            <Input
              required
              onChange={handlePassword}
              type={showPassWord ? "text" : "password"}
              value={password}
              placeholder="Password"
            />
            <InputGroupText>
              {showPassWord ? <Eye /> : <EyeOff />}
            </InputGroupText>
          </InputGroup>
        </FormGroup>
      )}
      {showOtpInput && (
        <FormGroup>
          <Label className="form-label" for="otp">
            Enter OTP
          </Label>
          <Input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
            }
          />
        </FormGroup>
      )}
      {/* <div className="form-terms">
        <div className="custom-control custom-checkbox me-sm-2">
          <Label className="d-block">
            <Input className="checkbox_animated" id="chk-ani2" type="checkbox" />
            Reminder Me
            <span className="pull-right">
              <Button color="transparent" className="forgot-pass p-0">
                lost your password
              </Button>
            </span>
          </Label>
        </div>
      </div> */}
      <div className="form-button">
        <Button
          color="primary"
          type="submit"
          disabled={disableBtn || submitting || success}
        >
          {submitting ? "Logging in..." : success ? "Logged in" : "Login"}
        </Button>
      </div>
      <div className="form-footer">
        <span>Or Login up with Google</span>
        <SocialMediaIcons />
      </div>
    </Form>
  );
};

export default LoginForm;
