import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StudentSidebarProps {
  user: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function StudentSidebar({ user, activeSection, onSectionChange }: StudentSidebarProps) {
  const levelProgress = user?.experience ? ((user.experience % 1000) / 1000) * 100 : 0;
  const nextLevelXP = Math.ceil((user?.experience || 0) / 1000) * 1000;
  
  return (
    <aside className="w-64 bg-card shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-student-primary to-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-leaf text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-gray-900">Eco-ED</span>
        </div>
        <div className="mt-4 p-3 bg-student-light rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-student-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm" data-testid="text-student-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'Student'}
              </p>
              <p className="text-xs text-gray-600">Level {user?.level || 1} Eco-Warrior</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Progress</span>
              <span data-testid="text-experience-progress">
                {user?.experience || 0} / {nextLevelXP} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </div>
      </div>
      
      <nav className="p-6 space-y-2">
        <button
          onClick={() => onSectionChange('dashboard')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'dashboard'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-dashboard"
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => onSectionChange('challenges')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'challenges'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-challenges"
        >
          <i className="fas fa-tasks"></i>
          <span>Challenges</span>
        </button>
        
        <button
          onClick={() => onSectionChange('adventure')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'adventure'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-adventure"
        >
          <i className="fas fa-map"></i>
          <span>Adventure Mode</span>
        </button>
        
        <button
          onClick={() => onSectionChange('leaderboard')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'leaderboard'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-leaderboard"
        >
          <i className="fas fa-trophy"></i>
          <span>Leaderboard</span>
        </button>
        
        <button
          onClick={() => onSectionChange('community')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'community'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-community"
        >
          <i className="fas fa-comments"></i>
          <span>Community</span>
        </button>
        
        <button
          onClick={() => onSectionChange('rewards')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'rewards'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-rewards"
        >
          <i className="fas fa-gift"></i>
          <span>Rewards</span>
        </button>
        
        <button
          onClick={() => onSectionChange('profile')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'profile'
              ? 'bg-student-light text-student-primary'
              : 'text-gray-600 hover:bg-student-light hover:text-student-primary'
          }`}
          data-testid="button-nav-profile"
        >
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            try {
              const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (response.ok) {
                window.location.href = '/';
              } else {
                console.error('Logout failed');
              }
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          data-testid="button-logout"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </Button>
      </div>
    </aside>
  );
}
