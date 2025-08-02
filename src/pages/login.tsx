import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Form = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

     // Demo user credentials (in a real app, this would be handled by a backend)
   const demoUsers = [
     { email: 'admin@space.com', password: 'admin123' }
   ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Reduced delay for faster response
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if user exists
    const user = demoUsers.find(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && 
      u.password === formData.password
    );

    if (user) {
      // Use the auth context to login
      login(formData.email);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FullPageContainer>
      <SpaceBackground>
        <Moon />
        <Stars>
          {[...Array(25)].map((_, i) => (
            <Star key={i} delay={i * 0.2} />
          ))}
        </Stars>
        <ShootingStars>
          {[...Array(2)].map((_, i) => (
            <ShootingStar key={i} delay={i * 3} />
          ))}
        </ShootingStars>
        <FloatingRocks>
          {[...Array(4)].map((_, i) => (
            <Rock key={i} delay={i * 1} />
          ))}
        </FloatingRocks>
      </SpaceBackground>
      
      <BackButton onClick={() => navigate('/')}>
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </BackButton>

             <LoginContainer>
         <WelcomeMessage>
           <WelcomeText data-text="WELCOME TO ANALYTIC SPACE">WELCOME TO ANALYTIC SPACE</WelcomeText>
         </WelcomeMessage>
         <GlitchFormWrapper>
           <form className="glitch-card" onSubmit={handleSubmit}>
            <div className="card-header">
              <div className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                  <path d="M12 11.5a3 3 0 0 0 -3 2.824v1.176a3 3 0 0 0 6 0v-1.176a3 3 0 0 0 -3 -2.824z" />
                </svg>
                <span>FlashX_ANALYTICS</span>
              </div>
              <div className="card-dots"><span /><span /><span /></div>
            </div>
            <div className="card-body">
              {error && (
                <div className="error-message">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="form-group">
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder=" "
                />
                <label htmlFor="email" className="form-label" data-text="EMAIL_ADDRESS">EMAIL_ADDRESS</label>
              </div>
              
                             <div className="form-group">
                 <input 
                   type={showPassword ? "text" : "password"}
                   id="password" 
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                   required 
                   placeholder=" "
                 />
                 <label htmlFor="password" className="form-label" data-text="PASSWORD">PASSWORD</label>
                 <button
                   type="button"
                   onClick={togglePasswordVisibility}
                   className="password-toggle"
                 >
                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
               </div>
              
              <button 
                data-text={isLoading ? "CONNECTING..." : "INITIATE_CONNECTION"} 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                <span className="btn-text">
                  {isLoading ? "CONNECTING..." : "INITIATE_CONNECTION"}
                </span>
              </button>
              
            </div>
          </form>
        </GlitchFormWrapper>
      </LoginContainer>
    </FullPageContainer>
  );
}

const FullPageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #0d0d0d 25%,
    #0a0a0a 50%,
    #050505 75%,
    #000000 100%
  );
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpaceBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const Moon = styled.div`
  position: absolute;
  top: 10%;
  right: 10%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #00f2ea 0%, #00d4cc 50%, #00b8b0 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 50px rgba(0, 242, 234, 0.5),
    0 0 100px rgba(0, 242, 234, 0.3),
    inset -10px -10px 20px rgba(0, 0, 0, 0.3);
  animation: moonGlow 4s ease-in-out infinite alternate;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 30px;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 60px;
    left: 70px;
    width: 15px;
    height: 15px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }

  @keyframes moonGlow {
    0% { 
      box-shadow: 
        0 0 50px rgba(0, 242, 234, 0.5),
        0 0 100px rgba(0, 242, 234, 0.3);
    }
    100% { 
      box-shadow: 
        0 0 80px rgba(0, 242, 234, 0.7),
        0 0 150px rgba(0, 242, 234, 0.4);
    }
  }
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Star = styled.div<{ delay: number }>`
  position: absolute;
  width: 2px;
  height: 2px;
  background: #00f2ea;
  border-radius: 50%;
  animation: twinkle 3s infinite;
  animation-delay: ${props => props.delay}s;

  &:nth-child(odd) {
    width: 3px;
    height: 3px;
    background: #a855f7;
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
  }

  &:nth-child(3n) {
    width: 1px;
    height: 1px;
    background: #00f2ea;
    box-shadow: 0 0 5px rgba(0, 242, 234, 0.6);
  }

  &:nth-child(1) { top: 5%; left: 10%; }
  &:nth-child(2) { top: 15%; left: 80%; }
  &:nth-child(3) { top: 25%; left: 20%; }
  &:nth-child(4) { top: 35%; left: 70%; }
  &:nth-child(5) { top: 45%; left: 30%; }
  &:nth-child(6) { top: 55%; left: 90%; }
  &:nth-child(7) { top: 65%; left: 15%; }
  &:nth-child(8) { top: 75%; left: 85%; }
  &:nth-child(9) { top: 85%; left: 25%; }
  &:nth-child(10) { top: 95%; left: 75%; }
  &:nth-child(11) { top: 10%; left: 50%; }
  &:nth-child(12) { top: 20%; left: 40%; }
  &:nth-child(13) { top: 30%; left: 60%; }
  &:nth-child(14) { top: 40%; left: 35%; }
  &:nth-child(15) { top: 50%; left: 65%; }
  &:nth-child(16) { top: 60%; left: 45%; }
  &:nth-child(17) { top: 70%; left: 55%; }
  &:nth-child(18) { top: 80%; left: 25%; }
  &:nth-child(19) { top: 90%; left: 35%; }
  &:nth-child(20) { top: 12%; left: 75%; }
  &:nth-child(21) { top: 22%; left: 85%; }
  &:nth-child(22) { top: 32%; left: 15%; }
  &:nth-child(23) { top: 42%; left: 95%; }
  &:nth-child(24) { top: 52%; left: 5%; }
  &:nth-child(25) { top: 62%; left: 25%; }
  &:nth-child(26) { top: 72%; left: 35%; }
  &:nth-child(27) { top: 82%; left: 45%; }
  &:nth-child(28) { top: 92%; left: 55%; }
  &:nth-child(29) { top: 8%; left: 65%; }
  &:nth-child(30) { top: 18%; left: 75%; }
  &:nth-child(31) { top: 28%; left: 85%; }
  &:nth-child(32) { top: 38%; left: 95%; }
  &:nth-child(33) { top: 48%; left: 5%; }
  &:nth-child(34) { top: 58%; left: 15%; }
  &:nth-child(35) { top: 68%; left: 25%; }
  &:nth-child(36) { top: 78%; left: 35%; }
  &:nth-child(37) { top: 88%; left: 45%; }
  &:nth-child(38) { top: 98%; left: 55%; }
  &:nth-child(39) { top: 6%; left: 65%; }
  &:nth-child(40) { top: 16%; left: 75%; }
  &:nth-child(41) { top: 26%; left: 85%; }
  &:nth-child(42) { top: 36%; left: 95%; }
  &:nth-child(43) { top: 46%; left: 5%; }
  &:nth-child(44) { top: 56%; left: 15%; }
  &:nth-child(45) { top: 66%; left: 25%; }
  &:nth-child(46) { top: 76%; left: 35%; }
  &:nth-child(47) { top: 86%; left: 45%; }
  &:nth-child(48) { top: 96%; left: 55%; }
  &:nth-child(49) { top: 4%; left: 65%; }
  &:nth-child(50) { top: 14%; left: 75%; }

  @keyframes twinkle {
    0%, 100% { 
      opacity: 0.3; 
      transform: scale(1);
      box-shadow: 0 0 5px currentColor;
    }
    50% { 
      opacity: 1; 
      transform: scale(1.2);
      box-shadow: 0 0 15px currentColor;
    }
  }
`;

const ShootingStars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ShootingStar = styled.div<{ delay: number }>`
  position: absolute;
  width: 2px;
  height: 2px;
  background: #00f2ea;
  border-radius: 50%;
  animation: shootingStar 3s linear infinite;
  animation-delay: ${props => props.delay}s;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, #00f2ea, transparent);
  }

  &:nth-child(1) {
    top: 20%;
    right: 0;
    animation-duration: 2s;
  }

  &:nth-child(2) {
    top: 60%;
    right: 0;
    animation-duration: 2.5s;
  }

  &:nth-child(3) {
    top: 80%;
    right: 0;
    animation-duration: 1.8s;
  }

  @keyframes shootingStar {
    0% {
      transform: translateX(0) rotate(315deg);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translateX(-1000px) rotate(315deg);
      opacity: 0;
    }
  }
`;

const FloatingRocks = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Rock = styled.div<{ delay: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #00f2ea, #a855f7);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 10px rgba(0, 242, 234, 0.5);

  &:nth-child(1) { top: 10%; left: 5%; }
  &:nth-child(2) { top: 30%; left: 90%; }
  &:nth-child(3) { top: 50%; left: 10%; }
  &:nth-child(4) { top: 70%; left: 80%; }
  &:nth-child(5) { top: 20%; left: 60%; }
  &:nth-child(6) { top: 40%; left: 20%; }
  &:nth-child(7) { top: 60%; left: 70%; }
  &:nth-child(8) { top: 80%; left: 40%; }

  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
      box-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
    }
    50% { 
      transform: translateY(-20px) rotate(180deg);
      box-shadow: 0 0 20px rgba(0, 242, 234, 0.8);
    }
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  z-index: 2;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  z-index: 2;
`;

const WelcomeText = styled.h1`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #00f2ea;
  text-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
  position: relative;
  animation: welcomeGlow 3s ease-in-out infinite alternate;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      #0a0a0a 0%,
      #0d0d0d 25%,
      #0a0a0a 50%,
      #050505 75%,
      #000000 100%
    );
  }

  &::before {
    color: #a855f7;
    animation: welcomeGlitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    animation-delay: 2s;
    animation-iteration-count: infinite;
  }

  &::after {
    color: #00f2ea;
    animation: welcomeGlitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
    animation-delay: 2s;
    animation-iteration-count: infinite;
  }

  @keyframes welcomeGlow {
    0% {
      text-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
    }
    100% {
      text-shadow: 
        0 0 20px rgba(0, 242, 234, 0.8),
        0 0 30px rgba(0, 242, 234, 0.6),
        0 0 40px rgba(0, 242, 234, 0.4);
    }
  }

  @keyframes welcomeGlitch {
    0% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
    20% {
      transform: translate(-3px, 2px);
      clip-path: inset(50% 0 20% 0);
    }
    40% {
      transform: translate(2px, -1px);
      clip-path: inset(20% 0 60% 0);
    }
    60% {
      transform: translate(-2px, 1px);
      clip-path: inset(80% 0 5% 0);
    }
    80% {
      transform: translate(1px, -2px);
      clip-path: inset(30% 0 45% 0);
    }
    100% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
  }
`;

const GlitchFormWrapper = styled.div`
  /* --- Root Variables for the component --- */
  --bg-color: #0d0d0d;
  --primary-color: #00f2ea;
  --secondary-color: #a855f7;
  --text-color: #e5e5e5;
  --font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  --glitch-anim-duration: 0.5s;

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family);
  background-color: transparent;

  /* --- Card Structure --- */
     .glitch-card {
     background-color: var(--bg-color);
     width: 100%;
     max-width: 880px;
     border: 2px solid rgba(0, 242, 234, 0.2);
     box-shadow:
       0 0 20px rgba(0, 242, 234, 0.1),
       inset 0 0 10px rgba(0, 0, 0, 0.5);
     overflow: hidden;
     margin: 1rem;
   }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.5em 1em;
    border-bottom: 1px solid rgba(0, 242, 234, 0.2);
  }

  .card-title {
    color: var(--primary-color);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .card-title svg {
    width: 1.2em;
    height: 1.2em;
    stroke: var(--primary-color);
  }

  .card-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #333;
    margin-left: 5px;
  }

     .card-body {
     padding: 3rem;
     min-height: 400px;
   }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    backdrop-filter: blur(10px);
  }

  /* --- Form Elements --- */
     .form-group {
     position: relative;
     margin-bottom: 2.5rem;
   }

  .form-label {
    position: absolute;
    top: 0.75em;
    left: 0;
    font-size: 1rem;
    color: var(--primary-color);
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .form-group input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(0, 242, 234, 0.3);
    padding: 0.75em 0;
    font-size: 1rem;
    color: var(--text-color);
    font-family: inherit;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus {
    border-color: var(--primary-color);
  }

  .form-group input:focus + .form-label,
  .form-group input:not(:placeholder-shown) + .form-label {
    top: -1.2em;
    font-size: 0.8rem;
    opacity: 1;
  }

  .form-group input:focus + .form-label::before,
  .form-group input:focus + .form-label::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
  }

  .form-group input:focus + .form-label::before {
    color: var(--secondary-color);
    animation: glitch-anim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .form-group input:focus + .form-label::after {
    color: var(--primary-color);
    animation: glitch-anim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
  }

  @keyframes glitch-anim {
    0% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
    20% {
      transform: translate(-5px, 3px);
      clip-path: inset(50% 0 20% 0);
    }
    40% {
      transform: translate(3px, -2px);
      clip-path: inset(20% 0 60% 0);
    }
    60% {
      transform: translate(-4px, 2px);
      clip-path: inset(80% 0 5% 0);
    }
    80% {
      transform: translate(4px, -3px);
      clip-path: inset(30% 0 45% 0);
    }
    100% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
  }

     /* --- Password Toggle Button --- */
   .password-toggle {
     position: absolute;
     right: 0;
     top: 50%;
     transform: translateY(-50%);
     background: none;
     border: none;
     color: rgba(0, 242, 234, 0.6);
     cursor: pointer;
     padding: 4px;
     border-radius: 4px;
     transition: all 0.2s ease;
     z-index: 2;

     &:hover {
       color: var(--primary-color);
       background: rgba(0, 242, 234, 0.1);
     }
   }

  /* --- Button Styling --- */
     .submit-btn {
     width: 100%;
     padding: 1.2em;
     margin-top: 2rem;
    background-color: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
    overflow: hidden;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .submit-btn:hover:not(:disabled),
  .submit-btn:focus:not(:disabled) {
    background-color: var(--primary-color);
    color: var(--bg-color);
    box-shadow: 0 0 25px var(--primary-color);
    outline: none;
  }

  .submit-btn:active {
    transform: scale(0.97);
  }

  /* --- Glitch Effect for Button --- */
  .submit-btn .btn-text {
    position: relative;
    z-index: 1;
    transition: opacity 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) .btn-text {
    opacity: 0;
  }

  .submit-btn::before,
  .submit-btn::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    background-color: var(--primary-color);
    transition: opacity 0.2s ease;
  }

  .submit-btn:hover:not(:disabled)::before,
  .submit-btn:focus:not(:disabled)::before {
    opacity: 1;
    color: var(--secondary-color);
    animation: glitch-anim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .submit-btn:hover:not(:disabled)::after,
  .submit-btn:focus:not(:disabled)::after {
    opacity: 1;
    color: var(--bg-color);
    animation: glitch-anim var(--glitch-anim-duration)
      cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
  }

  /* --- Demo Credentials --- */
     .demo-credentials {
     margin-top: 2.5rem;
     padding: 1.5rem;
    background: rgba(0, 242, 234, 0.1);
    border: 1px solid rgba(0, 242, 234, 0.2);
    border-radius: 8px;
  }

  .demo-title {
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .demo-list {
    color: var(--text-color);
    font-size: 0.7rem;
    line-height: 1.4;
    opacity: 0.8;
  }

  .demo-list div {
    margin-bottom: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .form-group input:focus + .form-label::before,
    .form-group input:focus + .form-label::after,
    .submit-btn:hover::before,
    .submit-btn:focus::before,
    .submit-btn:hover::after,
    .submit-btn:focus::after {
      animation: none;
      opacity: 0;
    }

    .submit-btn:hover .btn-text {
      opacity: 1;
    }
  }
`;

export default Form;
