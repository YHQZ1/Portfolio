import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useSound } from "../context/useSound";
import { usePageMeta, type PageMeta } from "../hooks/usePageMeta";
import { socialLinks, specialLinks } from "../data/links";
import { CONTACT_EMAIL, CONTACT_MAIL_HREF } from "../data/site";
import Container from "../components/ui/Container";
import LinkRow from "../components/ui/LinkRow";
import ScrollProgress from "../components/layout/ScrollProgress";
import { FiArrowRight, FiCheck, FiCopy } from "react-icons/fi";

const PAGE_META: PageMeta = {
  title: "Contact | Uttkarsh Ruparel",
  description:
    "Get in touch with Uttkarsh Ruparel about backend engineering roles, collaborations or questions.",
  path: "/contact",
};

const fieldClass =
  "w-full border-0 border-b border-line-strong bg-transparent py-3 text-lg text-fg transition-colors duration-200 placeholder:text-faint hover:border-faint focus:border-fg focus:outline-none";

const labelClass = "eyebrow mb-1 block";

export default function Contact() {
  usePageMeta(PAGE_META);
  const form = useRef<HTMLFormElement>(null);
  const { play } = useSound();
  const [copied, setCopied] = useState(false);
  const discord = specialLinks.find((link) => link.type === "copy");
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const isFormValid =
    formData.user_name.trim() &&
    formData.user_email.trim() &&
    formData.message.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.user_name,
          email: formData.user_email,
          subject: formData.subject,
          message: formData.message,
          website,
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setSubmitStatus("success");
      play("success");
      setFormData({ user_name: "", user_email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg">
      <ScrollProgress />

      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="mb-8 eyebrow">Contact</p>
            <h1 className="text-4xl leading-[1.12] font-extralight tracking-tighter text-balance text-fg sm:text-5xl">
              Have a role, a project or a question?{" "}
              <span className="text-faint">Send it over.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-[1.8] text-muted">
              Send a message here, or reach me directly on any of these.
            </p>

            <ul className="mt-10 border-t border-line">
              <li>
                <LinkRow
                  label="Email"
                  href={CONTACT_MAIL_HREF}
                  hint={CONTACT_EMAIL}
                  hideHintOnMobile
                />
              </li>
              {socialLinks.map(({ name, url }) => (
                <li key={name}>
                  <LinkRow label={name} href={url} />
                </li>
              ))}
              {discord && discord.type === "copy" && (
                <li>
                  <LinkRow
                    label="Discord"
                    hint={copied ? "Copied" : "Copy handle"}
                    icon={
                      copied ? (
                        <FiCheck className="shrink-0 text-lg" />
                      ) : (
                        <FiCopy className="shrink-0 text-lg" />
                      )
                    }
                    onClick={() => {
                      navigator.clipboard.writeText(discord.value);
                      play("copy");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1400);
                    }}
                  />
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <p className="mb-8 eyebrow">Send a message</p>

            <form className="space-y-10" ref={form} onSubmit={sendEmail}>
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="user_name" className={labelClass}>
                  Your Name
                </label>
                <input
                  id="user_name"
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="user_email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="user_email"
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${fieldClass} resize-none`}
                  rows={5}
                  required
                  placeholder="Type your message here..."
                />
              </div>

              {submitStatus === "success" && (
                <p
                  role="status"
                  className="border-l-2 border-fg pl-4 text-base leading-[1.7] text-fg"
                >
                  Thank you for your message! I'll get back to you soon.
                </p>
              )}

              {submitStatus === "error" && (
                <p
                  role="alert"
                  className="border-l-2 border-fg pl-4 text-base leading-[1.7] text-muted"
                >
                  Sorry, your message didn't go through. Please try again in a
                  moment, or email me directly at{" "}
                  <a
                    href={CONTACT_MAIL_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg underline underline-offset-4"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className="inline-flex cursor-pointer items-center border border-fg px-8 py-3.5 text-sm text-fg transition-colors duration-200 hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:border-line-strong disabled:text-faint disabled:hover:bg-transparent disabled:hover:text-faint"
              >
                {isSubmitting ? "Sending..." : "Send message"}
                <FiArrowRight className="ml-3" />
              </button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}
