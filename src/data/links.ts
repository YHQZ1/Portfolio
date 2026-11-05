import type { IconType } from "react-icons";
import { FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode, SiGmail } from "react-icons/si";

export interface SocialLink {
  name: string;
  icon: IconType;
  url: string;
}

export type SpecialLink =
  | { name: string; icon: IconType; type: "copy"; value: string }
  | { name: string; icon: IconType; type: "internal"; to: string };

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/uttkarsh-ruparel/",
  },
  {
    name: "X",
    icon: FaXTwitter,
    url: "https://x.com/yhqz01",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/YHQZ1",
  },
  {
    name: "LeetCode",
    icon: SiLeetcode,
    url: "https://leetcode.com/u/yhqz/",
  },
];

export const specialLinks: SpecialLink[] = [
  {
    name: "Discord",
    icon: FaDiscord,
    type: "copy",
    value: "YHQZ#3185",
  },
  {
    name: "Email Me",
    icon: SiGmail,
    type: "internal",
    to: "/contact",
  },
];
