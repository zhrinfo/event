import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, setUserRoles, type LoginData } from '../services/authService';

// Icons
function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function IconLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </svg>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: { 
    minHeight: '100dvh', 
    display: 'grid', 
    placeItems: 'center', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 24,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  card: { 
    width: '100%', 
    maxWidth: 440, 
    background: 'rgba(255, 255, 255, 0.95)', 
    backdropFilter: 'blur(10px)',
    borderRadius: 20, 
    border: '1px solid rgba(255, 255, 255, 0.2)', 
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.08)', 
    padding: '40px 36px',
    position: 'relative',
    overflow: 'hidden'
  },
  cardDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  },
  title: { 
    margin: 0, 
    marginBottom: 8, 
    fontSize: 32, 
    fontWeight: 700, 
    color: '#1a202c', 
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    margin: 0,
    marginBottom: 32,
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    fontWeight: 400
  },
  titleIcon: { 
    display: 'flex', 
    justifyContent: 'center', 
    marginBottom: 16,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    width: 64,
    height: 64,
    borderRadius: '50%',
    alignItems: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
  },
  form: { 
    display: 'grid', 
    gap: 20 
  },
  formGroup: { 
    display: 'grid', 
    gap: 8 
  },
  label: { 
    fontSize: 14, 
    fontWeight: 600, 
    color: '#2d3748',
    marginBottom: 4
  },
  inputWrapper: { 
    position: 'relative' 
  },
  inputIcon: { 
    position: 'absolute', 
    top: '50%', 
    left: 16, 
    transform: 'translateY(-50%)', 
    color: '#a0aec0', 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    pointerEvents: 'none',
    transition: 'color 0.2s ease'
  },
  input: { 
    width: '100%', 
    boxSizing: 'border-box', 
    padding: '14px 16px 14px 48px', 
    borderRadius: 12, 
    border: '2px solid #e2e8f0', 
    background: '#fff', 
    caretColor: '#667eea', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    transition: 'all 0.2s ease', 
    fontSize: 15, 
    outline: 'none',
    fontWeight: 500
  },
  inputFocus: { 
    border: '2px solid #667eea', 
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-1px)'
  },
  button: { 
    marginTop: 12, 
    width: '100%', 
    padding: '16px 14px', 
    borderRadius: 12, 
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: '#fff', 
    fontWeight: 600, 
    fontSize: 15, 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  buttonHover: { 
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 25px rgba(102, 126, 234, 0.35)'
  },
  buttonActive: {
    transform: 'translateY(0)'
  },
  message: { 
    marginTop: 16, 
    fontSize: 14, 
    padding: '14px 16px', 
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  link: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  },
  linkHover: {
    color: '#764ba2'
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [focus, setFocus] = useState({ email: false, password: false });
  const [hoverBtn, setHoverBtn] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const [hoverLinks, setHoverLinks] = useState({ forgot: false, register: false });
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const isSuccess = message?.toLowerCase().includes('succ') ?? false;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setErrors([]);

    if (!form.email || !form.password) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const loginData: LoginData = { email: form.email, password: form.password };
      const res = await login(loginData);

      if (res?.data?.token) {
        // Stocker les informations de base
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('id', res.data.userId.toString());
        
        // Gérer les rôles - le backend envoie un tableau de rôles
        const roles = Array.isArray(res.data.roles) ? res.data.roles : [res.data.role];
        setUserRoles(roles);
        
        setMessage('Connexion réussie! Redirection...');
        
        // Rediriger selon le rôle
        setTimeout(() => {
          if (roles.includes('ROLE_ADMIN')) {
            navigate('/dashboard');
          } else {
            navigate('/events');
          }
        }, 1500);
      } else {
        setMessage('Identifiants invalides.');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage('Email ou mot de passe incorrect.');
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erreur réseau. Réessayez.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardDecoration} />
        <div style={styles.titleIcon}>
          <IconLogo style={{ color: 'white' }} />
        </div>
        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.subtitle}>Accédez à votre compte</p>
        
        <form onSubmit={onSubmit} noValidate style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Email
              <div style={styles.inputWrapper}>
                <span style={{ ...styles.inputIcon, color: focus.email ? '#667eea' : '#a0aec0' }} aria-hidden>
                  <IconMail />
                </span>
                <input
                  style={{ ...styles.input, ...(focus.email ? styles.inputFocus : undefined) }}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  onFocus={() => setFocus((s) => ({ ...s, email: true }))}
                  onBlur={() => setFocus((s) => ({ ...s, email: false }))}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </label>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Mot de passe
              <div style={styles.inputWrapper}>
                <span style={{ ...styles.inputIcon, color: focus.password ? '#667eea' : '#a0aec0' }} aria-hidden>
                  <IconLock />
                </span>
                <input
                  style={{ ...styles.input, ...(focus.password ? styles.inputFocus : undefined) }}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  onFocus={() => setFocus((s) => ({ ...s, password: true }))}
                  onBlur={() => setFocus((s) => ({ ...s, password: false }))}
                  placeholder="••••••••"
                  required
                />
              </div>
            </label>
          </div>

         

          {message && (
            <p
              style={{
                ...styles.message,
                color: isSuccess ? '#0f5132' : '#842029',
                background: isSuccess ? '#d1e7dd' : '#f8d7da',
                border: '1px solid',
                borderColor: isSuccess ? '#badbcc' : '#f5c2c7',
              }}
            >
              {isSuccess ? '✓' : '⚠'} {message}
            </p>
          )}
          
          {errors.length > 0 && (
            <div
              style={{
                ...styles.message,
                color: '#842029',
                background: '#f8d7da',
                border: '1px solid #f5c2c7',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠</span>
                <span style={{ fontWeight: 600 }}>Erreurs :</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', marginTop: 4 }}>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            style={{ 
              ...styles.button, 
              ...(hoverBtn ? styles.buttonHover : undefined),
              ...(activeBtn ? styles.buttonActive : undefined)
            }}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            onMouseDown={() => setActiveBtn(true)}
            onMouseUp={() => setActiveBtn(false)}
          >
            Se connecter
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 14, color: '#718096', textAlign: 'center' }}>
          Pas de compte ?{' '}
          <Link 
            to="/register" 
            style={{ ...styles.link, ...(hoverLinks.register ? styles.linkHover : undefined) }}
            onMouseEnter={() => setHoverLinks(l => ({ ...l, register: true }))}
            onMouseLeave={() => setHoverLinks(l => ({ ...l, register: false }))}
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}