interface AvatarConfig {
  defaultAvatar: string;
  maleAvatar: string;
  femaleAvatar: string;
  teamLogos: { [key: string]: string };
}

// Configuration for avatar and logo paths
const avatarConfig: AvatarConfig = {
  defaultAvatar: '/assets/avatars/default-avatar.png',
  maleAvatar: '/assets/avatars/male-avatar.png',
  femaleAvatar: '/assets/avatars/female-avatar.png',
  teamLogos: {
    // Map team names to their logo paths
    'alpha': '/assets/logos/alpha.png',
    'beta': '/assets/logos/beta.png',
    'gamma': '/assets/logos/gamma.png',
    'delta': '/assets/logos/delta.png',
    // Add more team logos as needed
  }
};

/**
 * Get the appropriate avatar URL for an agent
 * @param gender - 'male', 'female', or undefined for default
 * @returns URL to the avatar image
 */
export const getAgentAvatar = (gender?: 'male' | 'female'): string => {
  if (gender === 'male') return avatarConfig.maleAvatar;
  if (gender === 'female') return avatarConfig.femaleAvatar;
  return avatarConfig.defaultAvatar;
};

/**
 * Get team logo URL
 * @param teamName - Name of the team (case-insensitive)
 * @returns URL to the team logo or default avatar if not found
 */
export const getTeamLogo = (teamName: string): string => {
  if (!teamName) return avatarConfig.defaultAvatar;
  const normalizedTeamName = teamName.toLowerCase().trim();
  return avatarConfig.teamLogos[normalizedTeamName] || avatarConfig.defaultAvatar;
};

/**
 * Get a placeholder avatar with initials
 * @param name - Full name of the person
 * @param bgColor - Background color (default: random)
 * @returns Object with text (initials) and color
 */
export const getInitialsAvatar = (name: string, bgColor?: string) => {
  // Generate initials
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Generate a consistent color based on name if not provided
  if (!bgColor) {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
    ];
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    bgColor = colors[colorIndex];
  }

  return {
    text: initials,
    color: bgColor
  };
};
