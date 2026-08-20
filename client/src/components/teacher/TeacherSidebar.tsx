import { Button } from "@/components/ui/button";

interface TeacherSidebarProps {
  user: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function TeacherSidebar({ user, activeSection, onSectionChange }: TeacherSidebarProps) {
  return (
    <aside className="w-64 bg-card shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teacher-primary to-blue-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-leaf text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-gray-900">Eco-ED</span>
        </div>
        <div className="mt-4 p-3 bg-teacher-light rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teacher-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'T'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm" data-testid="text-teacher-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'Teacher'}
              </p>
              <p className="text-xs text-gray-600">Teacher</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="p-6 space-y-2">
        <button
          onClick={() => onSectionChange('overview')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'overview'
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
          }`}
          data-testid="button-nav-overview"
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Overview</span>
        </button>
        
        <button
          onClick={() => onSectionChange('challenges')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'challenges'
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
          }`}
          data-testid="button-nav-challenges"
        >
          <i className="fas fa-tasks"></i>
          <span>Challenges</span>
        </button>
        
        <button
          onClick={() => onSectionChange('students')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'students'
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
          }`}
          data-testid="button-nav-students"
        >
          <i className="fas fa-users"></i>
          <span>Students</span>
        </button>
        
        <button
          onClick={() => onSectionChange('analytics')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'analytics'
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
          }`}
          data-testid="button-nav-analytics"
        >
          <i className="fas fa-chart-bar"></i>
          <span>Analytics</span>
        </button>
        
        <button
          onClick={() => onSectionChange('community')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            activeSection === 'community'
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
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
              ? 'bg-teacher-light text-teacher-primary'
              : 'text-gray-600 hover:bg-teacher-light hover:text-teacher-primary'
          }`}
          data-testid="button-nav-rewards"
        >
          <i className="fas fa-gift"></i>
          <span>Rewards</span>
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
