import { useState, useRef } from "react";
import { useTheme } from "../context/useTheme";
import { usePageMeta } from "../hooks/usePageMeta";
import emailjs from "@emailjs/browser";

const CONTACT_EMAIL = "rupareluttkarsh2309@gmail.com";
const CONTACT_MAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

const PAGE_META = {
  title: "Contact | Uttkarsh Ruparel",
  description:
    "Get in touch with Uttkarsh Ruparel about backend engineering roles, collaborations or questions.",
  path: "/contact",
};

export default function Contact() {
  usePageMeta(PAGE_META);
  const { darkMode } = useTheme();
  const form = useRef();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const isFormValid =
    formData.user_name.trim() &&
    formData.user_email.trim() &&
    formData.message.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const templateParams = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      subject: formData.subject || `Message from ${formData.user_name}`,
      message: formData.message,
      time: new Date().toLocaleString(),
      reply_to: formData.user_email,
    };

    emailjs
      .send("service_chx8xct", "template_4tbpz39", templateParams, {
        publicKey: "LRGdJCs-rXJbFfUie",
      })
      .then(
        () => {
          setSubmitStatus("success");
          setFormData({
            user_name: "",
            user_email: "",
            subject: "",
            message: "",
          });
        },
        () => {
          setSubmitStatus("error");
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#0a0a0a]" : "bg-[#fafafa]"
      } px-4 sm:px-6`}
    >
      <div className="max-w-[900px] mx-auto pt-20 md:pt-32 lg:pt-40 pb-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <div
          className={`rounded-sm p-6 sm:p-8 border ${
            darkMode
              ? "border-[#1a1a1a] bg-[#0f0f0f]"
              : "border-[#e8e8e8] bg-white"
          }`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extralight mb-4 sm:mb-6 ${
                darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
              } tracking-tight leading-[1.2]`}
            >
              Get In Touch
            </h2>
            <p
              className={`text-lg sm:text-xl md:text-2xl ${
                darkMode ? "text-[#888]" : "text-[#666]"
              }`}
            >
              Have a question or want to work together? Send me a message. Or
              email me directly at{" "}
              <a
                href={CONTACT_MAIL_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline underline-offset-4 transition-none ${
                  darkMode
                    ? "text-[#8ab4f8] hover:text-[#a5c7ff]"
                    : "text-[#4285f4] hover:text-[#3367d6]"
                }`}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <form
            className="space-y-6 sm:space-y-8"
            ref={form}
            onSubmit={sendEmail}
          >
            <div>
              <label
                className={`block mb-3 font-medium text-lg ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                }`}
              >
                Your Name
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-sm border transition-none duration-200 focus:outline-none focus:ring-2 text-lg ${
                  darkMode
                    ? "border-[#2a2a2a] bg-[#0f0f0f] text-[#f5f5f5] placeholder-[#888] hover:border-[#3a3a3a] focus:border-[#8ab4f8] focus:ring-[#8ab4f8] focus:ring-opacity-20"
                    : "border-[#e0e0e0] bg-white text-[#1a1a1a] placeholder-[#666] hover:border-[#d0d0d0] focus:border-[#4285f4] focus:ring-[#4285f4] focus:ring-opacity-20"
                }`}
                required
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                className={`block mb-3 font-medium text-lg ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-sm border transition-none duration-200 focus:outline-none focus:ring-2 text-lg ${
                  darkMode
                    ? "border-[#2a2a2a] bg-[#0f0f0f] text-[#f5f5f5] placeholder-[#888] hover:border-[#3a3a3a] focus:border-[#8ab4f8] focus:ring-[#8ab4f8] focus:ring-opacity-20"
                    : "border-[#e0e0e0] bg-white text-[#1a1a1a] placeholder-[#666] hover:border-[#d0d0d0] focus:border-[#4285f4] focus:ring-[#4285f4] focus:ring-opacity-20"
                }`}
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                className={`block mb-3 font-medium text-lg ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                }`}
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-sm border transition-none duration-200 focus:outline-none focus:ring-2 text-lg ${
                  darkMode
                    ? "border-[#2a2a2a] bg-[#0f0f0f] text-[#f5f5f5] placeholder-[#888] hover:border-[#3a3a3a] focus:border-[#8ab4f8] focus:ring-[#8ab4f8] focus:ring-opacity-20"
                    : "border-[#e0e0e0] bg-white text-[#1a1a1a] placeholder-[#666] hover:border-[#d0d0d0] focus:border-[#4285f4] focus:ring-[#4285f4] focus:ring-opacity-20"
                }`}
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label
                className={`block mb-3 font-medium text-lg ${
                  darkMode ? "text-[#f5f5f5]" : "text-[#1a1a1a]"
                }`}
              >
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-sm border resize-none transition-none duration-200 focus:outline-none focus:ring-2 text-lg ${
                  darkMode
                    ? "border-[#2a2a2a] bg-[#0f0f0f] text-[#f5f5f5] placeholder-[#888] hover:border-[#3a3a3a] focus:border-[#8ab4f8] focus:ring-[#8ab4f8] focus:ring-opacity-20"
                    : "border-[#e0e0e0] bg-white text-[#1a1a1a] placeholder-[#666] hover:border-[#d0d0d0] focus:border-[#4285f4] focus:ring-[#4285f4] focus:ring-opacity-20"
                }`}
                rows="5"
                required
                placeholder="Type your message here..."
              />
            </div>

            {submitStatus === "success" && (
              <div
                className={`p-4 sm:p-6 rounded-sm border transition-none duration-200 text-lg ${
                  darkMode
                    ? "border-[#1a1a1a] bg-[#0f0f0f] text-[#81c995]"
                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#34a853]"
                }`}
              >
                Thank you for your message! I'll get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={`p-4 sm:p-6 rounded-sm border transition-none duration-200 text-lg ${
                  darkMode
                    ? "border-[#1a1a1a] bg-[#0f0f0f] text-[#f28b82]"
                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#ea4335]"
                }`}
              >
                Sorry, your message didn't go through. Please try again in a
                moment, or email me directly at{" "}
                <a
                  href={CONTACT_MAIL_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 sm:py-5 px-8 rounded-sm font-semibold text-white transition-none duration-200 text-lg ${
                darkMode
                  ? isFormValid
                    ? "bg-[#8ab4f8] hover:bg-[#7aa3f0] cursor-pointer"
                    : "bg-[#3a3a3a] cursor-not-allowed opacity-50"
                  : isFormValid
                    ? "bg-[#4285f4] hover:bg-[#3367d6] cursor-pointer"
                    : "bg-[#ccc] cursor-not-allowed opacity-50"
              }`}
              disabled={!isFormValid}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
