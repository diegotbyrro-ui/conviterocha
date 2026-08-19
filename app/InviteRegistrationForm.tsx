'use client';

import { FormEvent, useEffect, useState } from 'react';

type InviteInfo = {
  name: string;
  profile: string;
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

export default function InviteRegistrationForm() {
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

    if (code.length < 10) {
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
        setInviteInfo(null);
        setInviteCode('');
        setInviteMessage('');
        setFormStartedAt(Date.now());
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

  function reset() {
    setDone(false);
    setMessage('');
    setInviteMessage('');
    setInviteCode('');
    setInviteInfo(null);
    setFormStartedAt(Date.now());
  }

  if (done) {
    return (
      <div className="successState">
        <div className="successIcon">✓</div>
        <span className="eyebrow">CADASTRO CONCLUÍDO</span>
        <h3>
          Nos vemos
          <br />
          no stand da Rocha.
        </h3>
        <p>Seu cadastro foi recebido. Nossa equipe comercial estará pronta para receber você no Salão do Imóvel.</p>
        <button onClick={reset}>Cadastrar outro corretor</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="hpField" aria-hidden="true">
        <label>
          Site
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="formTitle">
        <span>CADASTRO DE CORRETOR</span>
        <strong>Valide seu convite para continuar.</strong>
      </div>

      <div className={`inviteGate ${inviteInfo ? 'inviteGate--valid' : ''}`}>
        <label>
          Código de convite
          <div className="inviteCodeRow">
            <input
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
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="RCH-XXXX-XXXX-XXXX-XXXX"
              maxLength={23}
            />
            <button
              className="inviteValidateButton"
              type="button"
              onClick={validateInvite}
              disabled={inviteChecking}
            >
              {inviteChecking ? 'Validando...' : inviteInfo ? 'Validado' : 'Validar'}
            </button>
          </div>
        </label>

        {!inviteInfo && (
          <small className="inviteHelp">
            Digite o código enviado pela Rocha ou pela sua imobiliária.
          </small>
        )}

        {inviteMessage && <p className="inviteError">{inviteMessage}</p>}

        {inviteInfo && (
          <div className="inviteValid">
            <span>✓ CONVITE VALIDADO</span>
            <strong>{inviteInfo.name}</strong>
            <small>{inviteInfo.profile}</small>
          </div>
        )}
      </div>

      {message && <p className="error">{message}</p>}

      {inviteInfo && (
        <div className="inviteUnlocked">
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
            <span>Autorizo o contato da Rocha Empreendimentos por telefone, WhatsApp ou e-mail para relacionamento comercial.</span>
          </label>

          <button className="submitButton" disabled={sending}>
            {sending ? 'Enviando...' : 'Confirmar minha presença'} <span>â†—</span>
          </button>

        </div>
      )}
    </form>
  );
}