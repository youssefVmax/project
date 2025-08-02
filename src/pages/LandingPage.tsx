import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Database, 
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive sales analytics and performance tracking"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sales Forecasting",
      description: "AI-powered predictions for better business decisions"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description: "Track customer data and manage relationships effectively"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Management",
      description: "Secure and organized data entry and storage"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security for your business data"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Live data synchronization and instant notifications"
    }
  ];

  return (
    <FullPageContainer>
      <SpaceBackground>
        <Moon />
        <Stars>
          {[...Array(50)].map((_, i) => (
            <Star key={i} delay={i * 0.1} />
          ))}
        </Stars>
        <ShootingStars>
          {[...Array(3)].map((_, i) => (
            <ShootingStar key={i} delay={i * 2} />
          ))}
        </ShootingStars>
        <FloatingRocks>
          {[...Array(8)].map((_, i) => (
            <Rock key={i} delay={i * 0.5} />
          ))}
        </FloatingRocks>
      </SpaceBackground>

      {/* Navigation */}
      <Navigation>
        <Logo>
          <BarChart3 className="w-8 h-8" />
          <span>FlashX Analytics</span>
        </Logo>
        <SignInButton onClick={() => navigate('/login')}>
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </SignInButton>
      </Navigation>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle data-text="FLASH X BUSINESS ANALYTICS">
            FLASH X BUSINESS ANALYTICS
          </HeroTitle>
          
          <HeroSubtitle>
            Powerful sales analytics, customer insights, and predictive modeling 
            to drive our business forward with data-driven decisions.
          </HeroSubtitle>

          <HeroButton onClick={() => navigate('/login')}>
            <span>Show the analysis</span>
            <ArrowRight className="w-5 h-5" />
          </HeroButton>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesTitle data-text="EVERYTHING YOU NEED">
          EVERYTHING YOU NEED
        </FeaturesTitle>
        <FeaturesSubtitle>
          Comprehensive tools and features to manage your business analytics 
          and drive growth through data-driven insights.
        </FeaturesSubtitle>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </FullPageContainer>
  );
};

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

const HeroSection = styled.section`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
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
  font-size: 1.25rem;
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
`;

export default LandingPage; 