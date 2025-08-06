import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Apple, ChevronRight, Github, Linkedin, Search } from "lucide-react";

const socialButtons = [
  { icon: Github, label: "GitHub" },
  { icon: Search, label: "Google" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Apple, label: "Apple" },
];

const paginationDots = [false, false, true];

export default function Desktop(): JSX.Element {
  return (
    <div className="bg-[#101012] w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* Main Panels Container */}
      <div className="flex w-full h-full px-4 py-8 gap-4">
        {/* Left Pane - 55% */}
        <div className="w-[55%] rounded-[16.96px] overflow-hidden relative">
          <img
            className="w-full h-full object-cover"
            alt="Login art"
            src="/assets/login-art.png"
          />
          <div className="absolute bottom-0 left-0 w-full h-[427px] bg-gradient-to-b from-transparent to-[#151223] rounded-b-[16.96px]">
            <div className="text-center text-[#e7e7ef] text-[28.3px] leading-[38.2px] mt-[261px] font-semibold">
              Power Your Business with Smart AI Workflows
            </div>
            <div className="flex justify-center gap-[15.55px] mt-6">
              {paginationDots.map((active, index) => (
                <div
                  key={index}
                  className={`w-[38.16px] h-[5.65px] rounded-[7.07px] ${
                    active ? "bg-white" : "bg-[#3a3b45]"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            className="absolute top-[25px] left-[80%] bg-[#ffffff26] rounded-full backdrop-blur-[25.41px] text-white px-4 py-2 flex items-center gap-2"
          >
            <span>Back to Website</span>
            <ChevronRight className="w-4 h-4 transform -rotate-90" />
          </Button>
        </div>

        {/* Right Pane - 45% */}
        <div className="w-[45%] bg-[#f7f5f2] rounded-[16.96px] border border-[#d3d7e3] flex flex-col items-center justify-center font-sf-pro relative px-6 py-10">
          <img
            className="absolute top-6 left-6 w-[97px] h-6 opacity-70"
            alt="Zi cloud logo"
            src="/assets/logo.png"
          />

          <div className="w-full max-w-[274.16px] space-y-[33.92px] mt-20">
            <div className="text-center space-y-[19.78px]">
              <div className="text-[25.4px] font-semibold text-[#0b1420]">
                Welcome to Zi Cloud!
              </div>
              <p className="text-[14.1px] text-[#313957]">
                Unlock new levels of productivity, accuracy, and efficiency with
                AI-powered automation
              </p>
            </div>

            <div className="space-y-[16.96px]">
              <div className="flex gap-2 justify-center">
                {socialButtons.map((button, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-white border border-[#d3d7e3] rounded-full flex items-center justify-center"
                  >
                    <button.icon className="w-4 h-4 text-black" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-[#294956] text-[11.3px]">Or</span>
                <Separator className="flex-1" />
              </div>
            </div>

            <div className="space-y-[16.96px]">
              <div className="space-y-1">
                <Label className="text-[11.3px] text-[#0b1420]">
                  Email <span className="text-[#ff5050]">*</span>
                </Label>
                <Input
                  placeholder="example@email.com"
                  className="w-full h-[35px] bg-[#f6faff] text-[11.3px] rounded-[8.48px] border border-[#d3d7e3]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11.3px] text-[#0b1420]">
                  Password <span className="text-[#ff5050]">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full h-[35px] bg-[#f6faff] text-[11.3px] rounded-[8.48px] border border-[#d3d7e3]"
                />
              </div>

              <Button variant="link" className="text-[11.3px] text-link p-0">
                Forgot Password?
              </Button>

              <Button className="w-full h-auto bg-gradient-to-l from-[#404e9d] to-[#e35a2b] rounded-full py-3 text-white font-semibold text-[14.1px]">
                Sign in
              </Button>
            </div>

            <p className="text-center text-[11.3px] text-[#313957] pt-6">
              By signing up for a Appliflows account, you agree to our{" "}
              <Button
                variant="link"
                className="text-black underline p-0 text-[11.3px]"
              >
                Privacy Policy
              </Button>{" "}
              and{" "}
              <Button
                variant="link"
                className="text-black underline p-0 text-[11.3px]"
              >
                Terms of Services
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
