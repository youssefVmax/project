import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Database, 
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  Eye,
  Lock
} from 'lucide-react';

const LandingPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  const [currentCommand, setCurrentCommand] = useState(0);
  
  const hackerCommands = [
    'root@flashx:~# initializing neural networks...',
    'root@flashx:~# scanning market vulnerabilities...',
    'root@flashx:~# decrypting sales patterns...',
    'root@flashx:~# establishing secure connection...',
    'root@flashx:~# access granted. welcome to the matrix.',
  ];

  useEffect(() => {
    const typeCommand = () => {
      const command = hackerCommands[currentCommand];
      let i = 0;
      const typing = setInterval(() => {
        setTerminalText(command.slice(0, i));
        i++;
        if (i > command.length) {
          clearInterval(typing);
          setTimeout(() => {
            setCurrentCommand((prev) => (prev + 1) % hackerCommands.length);
          }, 2000);
        }
      }, 50);
    };

    typeCommand();
  }, [currentCommand]);

  const features = useMemo(() => [
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "DEEP DATA MINING",
      description: "Penetrate market databases and extract valuable intelligence patterns",
      hackCode: "exploit.sql --target=market_data"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "NEURAL SURVEILLANCE",
      description: "AI-powered behavioral analysis and predictive customer profiling",
      hackCode: "neural.py --mode=surveillance"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "ENCRYPTED INTEL",
      description: "Secure customer data vaults with military-grade encryption protocols",
      hackCode: "encrypt.sh --level=military"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "DATABASE INFILTRATION",
      description: "Access and manipulate business intelligence through secure backdoors",
      hackCode: "backdoor.exe --stealth-mode"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "FIREWALL BYPASS",
      description: "Enterprise-grade security protocols to protect your digital assets",
      hackCode: "firewall.bypass --ghost-protocol"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "REAL-TIME INJECTION",
      description: "Live data streams and instant market manipulation notifications",
      hackCode: "inject.js --realtime --silent"
    }
  ], []);

  const stars = useMemo(() => 
    [...Array(25)].map((_, i) => (
      <Star key={i} delay={i * 0.2} />
    )), []
  );

  const shootingStars = useMemo(() => 
    [...Array(2)].map((_, i) => (
      <ShootingStar key={i} delay={i * 3} />
    )), []
  );

  const floatingRocks = useMemo(() => 
    [...Array(4)].map((_, i) => (
      <Rock key={i} delay={i * 1} />
    )), []
  );

  const matrixChars = useMemo(() => 
    [...Array(15)].map((_, i) => (
      <MatrixChar key={i} delay={i * 0.3} />
    )), []
  );

  return (
    <FullPageContainer>
      <SpaceBackground>
        <Moon />
        <Stars>
          {stars}
        </Stars>
        <ShootingStars>
          {shootingStars}
        </ShootingStars>
        <FloatingRocks>
          {floatingRocks}
        </FloatingRocks>
        <MatrixRain>
          {matrixChars}
        </MatrixRain>
      </SpaceBackground>

      {/* Navigation */}
      <Navigation>
        <Logo>
          <Terminal className="w-8 h-8" />
          <span>FLASHX://NEURAL_NET</span>
        </Logo>
        <SignInButton onClick={() => navigate('/login')}>
          <span>JACK_IN</span>
          <ArrowRight className="w-4 h-4" />
        </SignInButton>
      </Navigation>

      {/* Terminal Interface */}
      <TerminalInterface>
        <TerminalHeader>
          <div>●●●</div>
          <div>root@flashx-mainframe</div>
          <div>SECURE_CONNECTION</div>
        </TerminalHeader>
        <TerminalBody>
          <div className="terminal-line">
            <span className="prompt">┌──(ghost㉿phantom)-[~/flashx]</span>
          </div>
          <div className="terminal-line">
            <span className="prompt">└─$ </span>
            <span className="command">{terminalText}</span>
            <span className="cursor">█</span>
          </div>
        </TerminalBody>
      </TerminalInterface>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle data-text="FLASHX NEURAL ANALYTICS">
            FLASHX NEURAL ANALYTICS
          </HeroTitle>
          
          <HeroSubtitle>
            [CLASSIFIED] PENETRATE MARKET DEFENSES • EXTRACT BUSINESS INTELLIGENCE 
            • MANIPULATE DATA STREAMS • CONTROL THE FINANCIAL MATRIX
          </HeroSubtitle>

          <HeroButton onClick={() => navigate('/login')}>
            <span>INITIATE_HACK.EXE</span>
            <ArrowRight className="w-5 h-5" />
          </HeroButton>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesTitle data-text="EXPLOIT_TOOLKIT.ZIP">
          EXPLOIT_TOOLKIT.ZIP
        </FeaturesTitle>
        <FeaturesSubtitle>
          [ENCRYPTED] Advanced hacking utilities and cyber warfare tools 
          to dominate the digital battlefield and control market intelligence.
        </FeaturesSubtitle>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <HackCode>{feature.hackCode}</HackCode>
              <FeatureIcon>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <StatusIndicator>
                <StatusDot />
                <span>EXPLOIT_READY</span>
              </StatusIndicator>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Hacker Stats */}
      <StatsSection>
        <StatCard>
          <StatNumber>99.9%</StatNumber>
          <StatLabel>PENETRATION_SUCCESS</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>1337</StatNumber>
          <StatLabel>SYSTEMS_BREACHED</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>0x7F</StatNumber>
          <StatLabel>SECURITY_BYPASSED</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>∞</StatNumber>
          <StatLabel>DATA_EXTRACTED</StatLabel>
        </StatCard>
      </StatsSection>
    </FullPageContainer>
  );
});

LandingPage.displayName = 'LandingPage';

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
  overflow-x: hidden;
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

const MatrixRain = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MatrixChar = styled.div<{ delay: number }>`
  position: absolute;
  color: #00ff41;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 14px;
  animation: matrixFall 4s linear infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.7;

  &::before {
    content: '${() => String.fromCharCode(Math.floor(Math.random() * 94) + 33)}';
  }

  &:nth-child(1) { left: 5%; }
  &:nth-child(2) { left: 15%; }
  &:nth-child(3) { left: 25%; }
  &:nth-child(4) { left: 35%; }
  &:nth-child(5) { left: 45%; }
  &:nth-child(6) { left: 55%; }
  &:nth-child(7) { left: 65%; }
  &:nth-child(8) { left: 75%; }
  &:nth-child(9) { left: 85%; }
  &:nth-child(10) { left: 95%; }
  &:nth-child(11) { left: 10%; }
  &:nth-child(12) { left: 20%; }
  &:nth-child(13) { left: 30%; }
  &:nth-child(14) { left: 40%; }
  &:nth-child(15) { left: 50%; }

  @keyframes matrixFall {
    0% {
      transform: translateY(-100vh);
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`;

const Navigation = styled.nav`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 242, 234, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #00f2ea;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
`;

const SignInButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #00f2ea;
  color: #00f2ea;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #00f2ea;
    color: #000;
    box-shadow: 0 0 25px rgba(0, 242, 234, 0.5);
  }
`;

const TerminalInterface = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 2rem auto;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #00f2ea;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 242, 234, 0.3);
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #00f2ea;
  color: #000;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TerminalBody = styled.div`
  padding: 1rem;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.9rem;
  color: #00ff41;
  
  .terminal-line {
    margin-bottom: 0.5rem;
  }
  
  .prompt {
    color: #00f2ea;
  }
  
  .command {
    color: #00ff41;
  }
  
  .cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const HeroSection = styled.section`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #00f2ea;
  text-shadow: 0 0 30px rgba(0, 242, 234, 0.8);
  margin-bottom: 2rem;
`;

const HeroSubtitle = styled.p`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a855f7;
  text-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
  margin-bottom: 3rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const HeroButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid #00f2ea;
  color: #00f2ea;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin: 0 auto;

  &:hover {
    background: #00f2ea;
    color: #000;
    box-shadow: 0 0 30px rgba(0, 242, 234, 0.6);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  position: relative;
  z-index: 2;
  padding: 4rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`;

const FeaturesTitle = styled.h2`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #00f2ea;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0, 242, 234, 0.6);
  position: relative;
  animation: featuresGlow 5s ease-in-out infinite alternate;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    color: #a855f7;
    animation: featuresGlitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    animation-delay: 5s;
    animation-iteration-count: infinite;
  }

  &::after {
    color: #00f2ea;
    animation: featuresGlitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
    animation-delay: 5s;
    animation-iteration-count: infinite;
  }

  @keyframes featuresGlow {
    0% {
      text-shadow: 0 0 15px rgba(0, 242, 234, 0.6);
    }
    100% {
      text-shadow: 
        0 0 25px rgba(0, 242, 234, 0.8),
        0 0 35px rgba(0, 242, 234, 0.6);
    }
  }

  @keyframes featuresGlitch {
    0% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
    20% {
      transform: translate(-2px, 1px);
      clip-path: inset(50% 0 20% 0);
    }
    40% {
      transform: translate(1px, -1px);
      clip-path: inset(20% 0 60% 0);
    }
    60% {
      transform: translate(-1px, 1px);
      clip-path: inset(80% 0 5% 0);
    }
    80% {
      transform: translate(1px, -1px);
      clip-path: inset(30% 0 45% 0);
    }
    100% {
      transform: translate(0);
      clip-path: inset(0 0 0 0);
    }
  }
`;

const FeaturesSubtitle = styled.p`
  font-size: 1.125rem;
  color: #e5e5e5;
  text-align: center;
  margin-bottom: 4rem;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 242, 234, 0.2);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00f2ea, #a855f7);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: rgba(0, 242, 234, 0.5);
    box-shadow: 0 0 30px rgba(0, 242, 234, 0.2);
    transform: translateY(-5px);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const HackCode = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.7rem;
  color: #00ff41;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 65, 0.3);
`;

const FeatureIcon = styled.div`
  color: #00f2ea;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px rgba(0, 242, 234, 0.5));
  }
`;

const FeatureTitle = styled.h3`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 1.25rem;
  font-weight: 600;
  color: #00f2ea;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FeatureDescription = styled.p`
  color: #e5e5e5;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 1rem;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.9rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.8rem;
  color: #00ff41;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #00ff41;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
`;

const StatsSection = styled.section`
  position: relative;
  z-index: 2;
  padding: 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 242, 234, 0.3);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(0, 242, 234, 0.6);
    box-shadow: 0 0 20px rgba(0, 242, 234, 0.3);
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #00f2ea;
  text-shadow: 0 0 15px rgba(0, 242, 234, 0.5);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  font-size: 0.9rem;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
`;

export default LandingPage;