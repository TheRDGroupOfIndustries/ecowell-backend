"use client";

import { ChangeEvent, FormEvent, useState } from "react";
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
import { emailPattern, passwordPattern } from "./LoginForm";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  // console.log(emailOrPhone);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(true);
  const [otp, setOtp] = useState("");
  const [checkOtpCode, setCheckOtpCode] = useState("");

  const [otpBtn, setOtpBtn] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
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

  const handleGetOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!name) {
      return toast.error("Please provide new admin name!");
    }
    if (!name || !emailOrPhone) {
      if (isEmail) {
        if (!email || !password) {
          return toast.error("Please provider valid email and password!");
        }
      } else {
        return toast.error("Please provide admin email or phone number!");
      }
    }
    if (!termsChecked) {
      return toast.error("Terms & Conditions should be checked!");
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: emailOrPhone,
          isEmail,
        }),
      });

      if (res.status === 400) {
        if (isEmail) {
          toast.error(`${email} is already registered!`);
        } else {
          toast.error(`${emailOrPhone} is already registered!`);
        }
      } else if (res.status === 201) {
        const otpCheck = await res.json();
        setCheckOtpCode(otpCheck);
        setOtpBtn(true);
        setOtpSuccess(true);
        if (isEmail) {
          toast.info(`OTP has been sent to your ${email}, check your email!`);
        } else {
          toast.info(
            `OTP has been sent to your ${emailOrPhone}, check your phone!`
          );
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleAdminAuthRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !emailOrPhone || !otp) {
      return toast.error("Please fill all the fields!");
    }
    // if (password !== confirmPassword) {
    //   return toast.error("Passwords does not match!");
    // }

    setSubmitting(true);

    const register = async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            phone_number: emailOrPhone,
            isEmail,
            otp,
            checkOtpCode,
          }),
        });

        if (res.status === 400) {
          if (isEmail) {
            throw new Error(`${email} is already registered!`);
          } else {
            throw new Error(`${emailOrPhone} is already registered!`);
          }
        }

        if (res.status === 200) {
          setSuccess(true);
          router.push("/en/auth/login");
          router.refresh();
          return "Registered successfully!";
        } else {
          throw new Error("Something went wrong, please try again!");
        }
      } catch (error) {
        throw error;
      } finally {
        setSubmitting(false);
      }
    };

    toast.promise(register(), {
      pending: "Registering...",
      success: "Registered successfully!",
      error: "Something went wrong, please try again!",
      // error: (error: any) => error.message || 'An error occurred.',
    });
  };

  return (
    <Form
      className="form-horizontal auth-form"
      onSubmit={handleAdminAuthRegister}
    >
      <FormGroup>
        <Input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          disabled={otpBtn}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="text"
          name="email"
          placeholder="Enter email or phone"
          required
          value={emailOrPhone}
          onChange={handleEmailOrPhone}
          disabled={otpBtn}
        />
      </FormGroup>
      {!otpSuccess && (
        <>
          {isEmail && (
            <FormGroup>
              <InputGroup>
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePassword}
                  placeholder="Password"
                />
                <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye /> : <EyeOff />}
                </InputGroupText>
              </InputGroup>
            </FormGroup>
          )}
          <div className="form-terms">
            <Label className="d-block">
              <Input
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
              />{" "}
              I agree the Terms & Conditions
            </Label>
          </div>
        </>
      )}
      <div className="form-button">
        {!otpBtn || !otpSuccess ? (
          <Button
            type="button"
            onClick={handleGetOtp}
            disabled={otpBtn || sendingOtp || otpSuccess}
          >
            {sendingOtp
              ? "Sending OTP..."
              : otpSuccess
              ? "Check your E-mail!"
              : "Send OTP"}
          </Button>
        ) : (
          <>
            <FormGroup>
              <Input
                type="text"
                placeholder="Enter OTP"
                disabled={disableBtn || submitting || success}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
                }
                required
                className="input-style animate-slide-down"
              />
            </FormGroup>
            <Button
              type="submit"
              disabled={disableBtn || submitting || success}
            >
              {submitting
                ? "Registering..."
                : success
                ? "Registered Successfully!"
                : "Sign Up"}
            </Button>
          </>
        )}
      </div>
      {/* <div className="form-footer">
        <span>Or Sign up with Google</span>
        <SocialMediaIcons />
      </div> */}
    </Form>
  );
};

export default RegisterForm;
