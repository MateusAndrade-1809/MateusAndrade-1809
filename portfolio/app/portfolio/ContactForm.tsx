import { useRef, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Mail,
  Send,
  TriangleAlert,
} from "lucide-react";
import { PROFILE, type Locale } from "./data";
import { sendContact, validateContact } from "./services";

const copy = {
  pt: {
    name: "Seu nome",
    email: "Seu e-mail",
    message: "Sua mensagem",
    nameHint: "Como posso chamar você?",
    emailHint: "voce@exemplo.com",
    messageHint: "Me conte sobre sua ideia, projeto ou oportunidade...",
    consent:
      "Concordo com o uso do meu nome, e-mail e mensagem para responder a este contato.",
    service: "O envio é processado pelo FormSubmit.",
    submit: "Enviar mensagem",
    sending: "Enviando...",
    success: "Mensagem aceita pelo serviço de envio. Obrigado pelo contato!",
    activation:
      "O serviço solicitou a confirmação do endereço de destino. Enquanto isso, você pode falar comigo diretamente por e-mail ou WhatsApp.",
    failure:
      "Não foi possível confirmar o envio. Sua mensagem foi mantida. Tente novamente ou use o e-mail direto.",
    errors: {
      name: "Informe um nome com 2 a 100 caracteres.",
      email: "Informe um e-mail válido.",
      message: "Escreva uma mensagem com 20 a 3.000 caracteres.",
      consent: "Confirme o uso dos dados para este contato.",
    },
    direct: "Usar meu aplicativo de e-mail",
  },
  en: {
    name: "Your name",
    email: "Your email",
    message: "Your message",
    nameHint: "What should I call you?",
    emailHint: "you@example.com",
    messageHint: "Tell me about your idea, project or opportunity...",
    consent:
      "I agree to the use of my name, email and message to respond to this inquiry.",
    service: "Delivery is processed by FormSubmit.",
    submit: "Send message",
    sending: "Sending...",
    success:
      "Message accepted by the sending service. Thank you for getting in touch!",
    activation:
      "The service requested confirmation of the recipient address. In the meantime, you can contact me directly by email or WhatsApp.",
    failure:
      "Delivery could not be confirmed. Your message has been kept. Try again or use the direct email option.",
    errors: {
      name: "Enter a name between 2 and 100 characters.",
      email: "Enter a valid email address.",
      message: "Write a message between 20 and 3,000 characters.",
      consent: "Confirm the use of your data for this inquiry.",
    },
    direct: "Use my email application",
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [fields, setFields] = useState({
    name: "",
    email: "",
    message: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "activation" | "failure"
  >("idle");
  const busy = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const change = (name: string, value: string | boolean) => {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status !== "sending") setStatus("idle");
  };

  return (
    <form
      className="contact-form"
      noValidate
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy.current) return;
        const validation = validateContact(fields);
        setErrors(validation);
        if (Object.keys(validation).length) {
          requestAnimationFrame(() =>
            formRef.current
              ?.querySelector<HTMLElement>("[aria-invalid=true]")
              ?.focus(),
          );
          return;
        }
        busy.current = true;
        setStatus("sending");
        try {
          const result = await sendContact(fields);
          setStatus(result === "activation" ? "activation" : "success");
          if (result === "accepted")
            setFields({
              name: "",
              email: "",
              message: "",
              consent: false,
              website: "",
            });
        } catch {
          setStatus("failure");
        } finally {
          busy.current = false;
        }
      }}
    >
      <div className="form-row">
        {(["name", "email"] as const).map((field) => (
          <div className="form-field" key={field}>
            <label htmlFor={`contact-${field}`}>
              {t[field]} <span aria-hidden="true">*</span>
            </label>
            <input
              id={`contact-${field}`}
              name={field}
              type={field === "email" ? "email" : "text"}
              autoComplete={field}
              maxLength={field === "name" ? 100 : 254}
              required
              value={fields[field]}
              onChange={(event) => change(field, event.target.value)}
              placeholder={field === "name" ? t.nameHint : t.emailHint}
              disabled={status === "sending"}
              aria-invalid={!!errors[field]}
              aria-describedby={errors[field] ? `error-${field}` : undefined}
            />
            {errors[field] && (
              <span className="field-error" id={`error-${field}`}>
                {t.errors[field]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">
          {t.message} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          minLength={20}
          maxLength={3000}
          placeholder={t.messageHint}
          value={fields.message}
          onChange={(event) => change("message", event.target.value)}
          disabled={status === "sending"}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "error-message" : "message-counter"
          }
        />
        <div className="field-meta">
          {errors.message && (
            <span className="field-error" id="error-message">
              {t.errors.message}
            </span>
          )}
          <span id="message-counter">{fields.message.length} / 3.000</span>
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          tabIndex={-1}
          id="contact-website"
          name="website"
          autoComplete="off"
          value={fields.website}
          onChange={(event) => change("website", event.target.value)}
        />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          name="consent"
          checked={fields.consent}
          onChange={(event) => change("consent", event.target.checked)}
          required
          disabled={status === "sending"}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "error-consent" : undefined}
        />
        <span>{t.consent}</span>
      </label>
      {errors.consent && (
        <span className="field-error" id="error-consent">
          {t.errors.consent}
        </span>
      )}
      <div className="submit-row">
        <button
          type="submit"
          className="button primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <Send size={17} />
          )}
          {status === "sending" ? t.sending : t.submit}
        </button>
        <span className="form-service">{t.service}</span>
      </div>
      {(status === "success" ||
        status === "activation" ||
        status === "failure") && (
        <div
          className={`form-feedback ${status}`}
          role={status === "failure" ? "alert" : "status"}
        >
          {status === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <TriangleAlert size={20} />
          )}
          <span>{t[status]}</span>
        </div>
      )}
      <a
        className="text-link"
        href={`mailto:${PROFILE.email}?subject=${encodeURIComponent("Contato pelo portfólio")}&body=${encodeURIComponent(fields.message)}`}
      >
        <Mail size={15} />
        {t.direct}
      </a>
    </form>
  );
}
