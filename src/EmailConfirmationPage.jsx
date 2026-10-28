import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import queueWordmark from './assets/Images/Queue.png'
import brandLogo from './assets/Images/logo.png'
import busScene from './assets/Images/Download App (10) 1.png'
import './EmailConfirmationPage.css'

const roleLabels = {
  driver: 'Driver',
  passenger: 'Passenger',
}

const pendingConfirmations = new Map()

function verifyEmailToken(supabase, tokenHash, confirmationType) {
  if (pendingConfirmations.has(tokenHash)) {
    return pendingConfirmations.get(tokenHash)
  }

  const request = supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: confirmationType,
  })
  pendingConfirmations.set(tokenHash, request)
  request.then(
    () => pendingConfirmations.delete(tokenHash),
    () => pendingConfirmations.delete(tokenHash),
  )

  return request
}

function EmailConfirmationPage() {
  const params = new URLSearchParams(window.location.search)
  const tokenHash = params.get('token_hash')
  const confirmationType = params.get('type')
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)
  const hasConfirmationToken = Boolean(tokenHash && ['email', 'signup'].includes(confirmationType))
  const [verification, setVerification] = useState(null)
  const status = !hasSupabaseConfig
    ? 'configuration-error'
    : !hasConfirmationToken
      ? 'invalid-link'
      : verification?.status ?? 'checking'
  const account = verification?.account

  useEffect(() => {
    let isCurrent = true
    window.history.replaceState(null, '', window.location.pathname)

    if (!hasSupabaseConfig || !hasConfirmationToken) return undefined

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    async function confirmEmail() {
      const { data, error } = await verifyEmailToken(supabase, tokenHash, confirmationType)

      if (!isCurrent) return

      const role = data.user?.user_metadata?.role
      const fullName = data.user?.user_metadata?.full_name

      if (error || !data.user || !roleLabels[role] || !fullName) {
        setVerification({ status: 'verification-error' })
        return
      }

      setVerification({ status: 'confirmed', account: { role, fullName } })
    }

    confirmEmail().catch(() => {
      if (isCurrent) setVerification({ status: 'verification-error' })
    })

    return () => {
      isCurrent = false
    }
  }, [confirmationType, hasConfirmationToken, hasSupabaseConfig, supabaseAnonKey, supabaseUrl, tokenHash])

  const title = status === 'confirmed'
    ? `Welcome to Queue-rious, ${account.fullName}`
    : 'Confirm your email | Queue-rious'

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <main className="email-confirmation-page" data-role={status === 'confirmed' ? account.role : 'pending'}>
      <div className="confirmation-wrap">
        <a className="confirmation-brand" href="/" aria-label="Queue-rious home">
          <span className="confirmation-brand-mark" aria-hidden="true">
            <img src={brandLogo} alt="" />
          </span>
          <span className="brand-wordmark" aria-hidden="true">
            <img src={queueWordmark} alt="" />
          </span>
        </a>

        {status === 'confirmed' && account.role === 'passenger' && (
          <figure className="passenger-visual">
            <img src={busScene} alt="A Queue-rious bus waiting at a transit stop" />
            <span className="passenger-confetti" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </span>
            <figcaption>YOUR NEXT RIDE STARTS HERE</figcaption>
          </figure>
        )}

        <section className="confirmation-content" aria-live="polite" aria-busy={status === 'checking'}>
          {status === 'checking' && (
            <>
              <span className="confirmation-symbol is-loading" aria-hidden="true">…</span>
              <p className="confirmation-eyebrow">One moment</p>
              <h1>Confirming your email</h1>
              <p className="confirmation-message">We’re verifying your link securely.</p>
            </>
          )}

          {status === 'confirmed' && (
            <>
              <span className="confirmation-symbol" aria-hidden="true">✓</span>
              {account.role === 'passenger' ? (
                <>
                  <p className="confirmation-eyebrow">Your passenger account is ready</p>
                  <h1>Welcome aboard, {account.fullName}!</h1>
                  <p className="confirmation-message">You’re all set. Find a seat, choose your pickup, and let the city unfold one stop at a time.</p>
                  <a className="confirmation-button" href="/">Explore Queue-rious</a>
                </>
              ) : (
                <>
                  <p className="confirmation-eyebrow">Driver account · verified</p>
                  <h1>Account confirmed, {account.fullName}.</h1>
                  <p className="confirmation-message">Email verification is complete. Your driver account is ready for its assigned-route workflow.</p>
                  <dl className="driver-status-grid">
                    <div><dt>ACCOUNT STATUS</dt><dd>Verified</dd></div>
                    <div><dt>ACCOUNT ROLE</dt><dd>Driver</dd></div>
                  </dl>
                  <a className="confirmation-button" href="/">Return to Queue-rious</a>
                </>
              )}
            </>
          )}

          {status === 'configuration-error' && (
            <ConfirmationError
              title="Confirmation is not configured yet"
              message="The Supabase connection is missing. Please contact the app administrator for help."
            />
          )}

          {status === 'invalid-link' && (
            <ConfirmationError
              title="This confirmation link is incomplete"
              message="Open the latest confirmation email and use its link. Confirmation links can only be used once."
            />
          )}

          {status === 'verification-error' && (
            <ConfirmationError
              title="We couldn’t confirm your email"
              message="This link may have expired or already been used. Request a new confirmation email and try again."
            />
          )}
        </section>

        <p className="confirmation-footer">Fixed routes. Easier rides.</p>
      </div>
    </main>
  )
}

function ConfirmationError({ title, message }) {
  return (
    <>
      <span className="confirmation-symbol is-error" aria-hidden="true">!</span>
      <p className="confirmation-eyebrow">Email confirmation</p>
      <h1>{title}</h1>
      <p className="confirmation-message">{message}</p>
      <a className="confirmation-button" href="/">Return to Queue-rious</a>
    </>
  )
}

export default EmailConfirmationPage