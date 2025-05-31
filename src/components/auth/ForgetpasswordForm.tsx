import { memo, useCallback, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { toast } from "react-hot-toast";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import OTPInput from "react-otp-input";
import { EyeCloseIcon, EyeIcon } from "../../icons";

type Step = "email" | "otp" | "reset";

const ForgetpasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const handleOnSubmit = useCallback(
    (e: any) => {
      try {
        e.preventDefault();

        if (!form.email) {
          throw new Error("Field is required.");
        }

        if (step === "email" && form.email) {
          setStep("otp");
          toast.success("An Otp has been sent to your email.");
        }

        if (step === "otp" && form.otp) {
          setStep("reset");
          toast.success("Otp has been verified");
        }

        if (step === "reset" && form.password) {
          setStep("email");
          setForm({
            email: "",
            password: "",
            otp: "",
          });
          toast.success("Password updated successfully.");
        }
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [form, step]
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {step === "email" && "Forget Password"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Set new password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step === "email" &&
                "Forgot your password? Enter your email to get an OTP to regain access."}
              {step === "otp" &&
                "We've sent a 4-digit code to your email. Please enter it below to verify."}
              {step === "reset" &&
                "Enter and confirm your new password to complete the reset process."}
            </p>
          </div>
          <div>
            <form onSubmit={handleOnSubmit}>
              <div className="space-y-6">
                {step === "email" && (
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={form.email}
                      type="email"
                      required={true}
                      placeholder="info@gmail.com"
                      onChange={(e) =>
                        setForm((pre) => ({ ...pre, email: e.target.value }))
                      }
                    />
                  </div>
                )}

                {step === "otp" && (
                  <div>
                    <OTPInput
                      value={form.otp}
                      onChange={(e) => setForm((pre) => ({ ...pre, otp: e }))}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      numInputs={4}
                      shouldAutoFocus={true}
                      containerStyle={"!w-full justify-between mb-5"}
                      inputStyle="border !h-16 !w-16 !rounded-lg !outline-blue-500"
                    />
                  </div>
                )}

                {step === "reset" && (
                  <div>
                    <Label htmlFor="password">
                      New password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        min={6}
                        value={form.password}
                        required={true}
                        onChange={(e) =>
                          setForm((pre) => ({
                            ...pre,
                            password: e.target.value,
                          }))
                        }
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <Button
                    disabled={
                      !form.email.trim() ||
                      !form.otp.trim() ||
                      !form.password.trim()
                        ? true
                        : false
                    }
                    className="w-full"
                    size="sm"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ForgetpasswordForm);
