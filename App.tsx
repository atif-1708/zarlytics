
import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import Login from './features/Auth';
import Navigation from './components/Navigation';
import Dashboard from './features/Dashboard';
import Reports from './features/Reports';
import Profile from './features/Profile';
import { 
    BusinessManagement, 
    SalesManagement, 
    ExpenseManagement, 
    UserManagement 
} from './features/AdminManagement';
import { Loader2, CloudSync } from 'lucide-react';

type Tab = 'dashboard' | 'reports' | 'businesses' | 'sales' | 'expenses' | 'users' | 'profile';

const LoadingScreen = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-8">
            <Loader2 size={64} className="text-teal-500 animate-spin opacity-20" />
            <CloudSync size={32} className="text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">Syncing with Cloud</h2>
        <p className="text-slate-400 font-medium">Please wait while ZARlytics secures your connection...</p>
    </div>
);

const MainLayout: React.FC = () => {
  const { currentUser, loading } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (loading) return <LoadingScreen />;
  if (!currentUser) return <Login />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'reports': return <Reports />;
      case 'profile': return <Profile />;
      case 'businesses': return <BusinessManagement />;
      case 'sales': return <SalesManagement />;
      case 'expenses': return <ExpenseManagement />;
      case 'users': return <UserManagement />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 md:ml-64 w-full">
        <div className="p-4 md:p-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
