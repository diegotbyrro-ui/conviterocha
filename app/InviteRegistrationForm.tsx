 'use client';

import { FormEvent, useEffect, useState } from 'react';

type InviteInfo = {
  name: string;
  profile: string;
};

type Props = {
  variant?: 'mobile' | 'desktop';
};

function formatInviteCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (compact.startsWith('RCH') && compact.length <= 19) {
    const body = compact.slice(3);
    const chunks = body.match(/.{1,4}/g) || [];
    return ['RCH', ...chunks].join('-').slice(0, 23);
  }
  return value.toUpperCase().slice(0, 23);
}

export default function InviteRegistrationForm({ variant = 'mobile' }: Props) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [inviteChecking, setInviteChecking] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [tracking, setTracking] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    referrer: '',
  });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setTracking({
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      referrer: document.referrer || '',
    });
  }, []);

  async function validateInvite() {
    setInviteMessage('');
    setInviteInfo(null);

    const code = formatInviteCode(inviteCode).trim();
    setInviteCode(code);

    if (code.length < 6) {
      setInviteMessage('Digite o código de convite recebido.');
      return;
    }

    setInviteChecking(true);
    try {
      const res = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ code }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInviteMessage(json.error || 'Código de convite inválido.');
        return;
      }

      setInviteInfo({
        name: json.name,
        profile: json.profile,
      });
      setInviteMessage('');
      setFormStartedAt(Date.now());
    } catch {
      setInviteMessage('Não foi possível validar o código. Tente novamente.');
    } finally {
      setInviteChecking(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inviteInfo) {
      setMessage('Valide seu código de convite antes de continuar.');
      return;
    }

    setSending(true);
    setMessage('');

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          ...data,
          invite_code: inviteCode,
          ...tracking,
          form_started_at: formStartedAt,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setDone(true);
      } else {
        if (res.status === 409 || json.code === 'INVITE_INVALID' || json.code === 'INVITE_FULL') {
          setInviteInfo(null);
        }
        setMessage(json.error || 'Não foi possível concluir seu cadastro.');
      }
    } catch {
      setMessage('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSending(false);
    }
  }

  function closeModal() {
    setMessage('');
    setInviteMessage('');
    setInviteInfo(null);
    setDone(false);
  }

  function reset() {
    setDone(false);
    setMessage('');
    setInviteMessage('');
    setInviteCode('');
    setInviteInfo(null);
    setFormStartedAt(Date.now());
  }

  return (
    <>
      <div className={`referenceCodeControl ${variant === 'desktop' ? 'isDesktop' : 'isMobile'}`}>
        <input
          className="referenceCodeInput"
          name="invite_code"
          value={inviteCode}
          onChange={(event) => {
            setInviteCode(formatInviteCode(event.target.value));
            setInviteInfo(null);
            setInviteMessage('');
            setMessage('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !inviteInfo) {
              event.preventDefault();
              void validateInvite();
            }
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Ex.: ROCHA2024"
          maxLength={23}
          aria-label="Código de convite"
        />

        <button
          type="button"
          className="referenceArrowButton"
          onClick={validateInvite}
          disabled={inviteChecking}
          aria-label="Validar código de convite"
        >
          <span aria-hidden="true">{inviteChecking ? '…' : '→'}</span>
        </button>

        {inviteMessage && <div className="referenceInlineError">{inviteMessage}</div>}
      </div>

      {inviteInfo && !done && (
        <div className="registrationOverlay" role="dialog" aria-modal="true" aria-label="Confirmar presença">
          <div className="registrationCard">
            <button className="registrationClose" type="button" onClick={closeModal} aria-label="Fechar">×</button>

            <div className="registrationHead">
              <span>CONVITE VALIDADO</span>
              <strong>{inviteInfo.name}</strong>
              <small>{inviteInfo.profile}</small>
            </div>

            <form onSubmit={submit}>
              <div className="hpField" aria-hidden="true">
                <label>
                  Site
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {message && <p className="registrationError">{message}</p>}

              <label>
                Nome completo
                <input name="name" required placeholder="Seu nome" />
              </label>

              <div className="twoCols">
                <label>
                  WhatsApp
                  <input name="phone" required placeholder="(82) 99999-9999" />
                </label>
                <label>
                  CRECI
                  <input name="creci" placeholder="Ex.: CRECI 0000" />
                </label>
              </div>

              <label>
                E-mail
                <input name="email" type="email" placeholder="voce@email.com" />
              </label>

              <label>
                Qual produto quer conhecer melhor?
                <select name="interest" defaultValue="">
                  <option value="">Quero conhecer todos</option>
                  <option>Easy Rota do Mar</option>
                  <option>Vistas do Sino</option>
                  <option>Eco Vittá</option>
                </select>
              </label>

              <label>
                Você já comercializa empreendimentos da Rocha?
                <select name="relationship" defaultValue="" required>
                  <option value="">Selecione</option>
                  <option>Sim</option>
                  <option>Ainda não</option>
                </select>
              </label>

              <label className="consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>
                  Autorizo o contato da Rocha Empreendimentos por telefone, WhatsApp ou e-mail para relacionamento comercial.
                </span>
              </label>

              <button className="registrationSubmit" disabled={sending}>
                {sending ? 'Enviando...' : 'Confirmar minha presença'}
              </button>
            </form>
          </div>
        </div>
      )}

      {done && (
        <div className="registrationOverlay" role="dialog" aria-modal="true" aria-label="Presença confirmada">
          <div className="registrationCard registrationSuccess">
            <div className="successCheck">✓</div>
            <span>PRESENÇA CONFIRMADA</span>
            <h3>Nos vemos na Tardezinha com a Rocha.</h3>
            <p>Sua confirmação foi recebida com sucesso.</p>
            <button type="button" onClick={reset}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}
