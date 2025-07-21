// Real-time data store for managing sales entries
export interface SalesEntry {
  id: number;
  agent: string;
  closer: string;
  amount: number;
  program: string;
  server: string;
  month: string;
  date: string;
  commission: number;
  region: string;
  customerType: string;
  status: 'Closed' | 'Pending';
  createdAt: Date;
}

class DataStore {
  private entries: SalesEntry[] = [];
  private listeners: (() => void)[] = [];

  addEntry(entry: Omit<SalesEntry, 'id' | 'createdAt' | 'status'>) {
    const newEntry: SalesEntry = {
      ...entry,
      id: Date.now(),
      status: 'Closed', // All new entries are closed deals
      createdAt: new Date()
    };
    
    this.entries.push(newEntry);
    this.notifyListeners();
    
    // Save to localStorage for persistence
    localStorage.setItem('salesEntries', JSON.stringify(this.entries));
  }

  getEntries(): SalesEntry[] {
    return [...this.entries];
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Load from localStorage on initialization
  loadFromStorage() {
    const stored = localStorage.getItem('salesEntries');
    if (stored) {
      try {
        this.entries = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading stored entries:', error);
      }
    }
  }
}

export const dataStore = new DataStore();

// Initialize on module load
dataStore.loadFromStorage();