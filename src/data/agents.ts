export interface Agent {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  name: string;
  email: string;
  salesTarget: number;
  team?: string;
  joinDate: string;
  isActive: boolean;
}

// Mock agent data - in a real app, this would come from a database
export const agents: Agent[] = [
  {
    id: 'agent1',
    username: 'agent1',
    password: 'password123', // In production, never store plaintext passwords
    name: 'John Doe',
    email: 'john@example.com',
    salesTarget: 50000,
    team: 'Sales Team A',
    joinDate: '2023-01-15',
    isActive: true
  },
  {
    id: 'agent2',
    username: 'agent2',
    password: 'password123',
    name: 'Jane Smith',
    email: 'jane@example.com',
    salesTarget: 60000,
    team: 'Sales Team B',
    joinDate: '2023-02-20',
    isActive: true
  }
];

// Function to find agent by username and password (for login)
export const authenticateAgent = (username: string, password: string): Agent | null => {
  return agents.find(
    agent => agent.username === username && agent.password === password && agent.isActive
  ) || null;
};

// Function to get agent by ID
export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id && agent.isActive);
};

// Function to get all agents (for admin view)
export const getAllAgents = (): Agent[] => {
  return agents.filter(agent => agent.isActive);
};
