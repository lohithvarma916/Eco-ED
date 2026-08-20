import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-leaf text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900">Eco-ED</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/login'}
                data-testid="button-login"
              >
                Login
              </Button>
              <Button
                onClick={() => window.location.href = '/signup'}
                data-testid="button-signup"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
            alt="Environmental education background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn. Act. <span className="text-green-600">Impact.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join the gamified environmental education platform where students and teachers collaborate to create a sustainable future through interactive learning and real-world action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-student-primary hover:bg-student-dark text-white px-8 py-4 text-lg"
                onClick={() => window.location.href = '/signup'}
                data-testid="button-join-student"
              >
                <i className="fas fa-graduation-cap mr-3"></i>
                Join as Student
              </Button>
              <Button
                size="lg"
                className="bg-teacher-primary hover:bg-teacher-dark text-white px-8 py-4 text-lg"
                onClick={() => window.location.href = '/signup'}
                data-testid="button-join-teacher"
              >
                <i className="fas fa-chalkboard-teacher mr-3"></i>
                Join as Teacher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transform Environmental Education</h2>
            <p className="text-xl text-gray-600">Engaging features that make learning about sustainability fun and impactful</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-gamepad text-green-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Gamified Learning</h3>
              <p className="text-gray-600">Earn points, unlock badges, and climb leaderboards while mastering environmental concepts through interactive challenges.</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-book-open text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Story-Driven Adventures</h3>
              <p className="text-gray-600">Progress through captivating environmental narratives with missions, challenges, and discoveries that unlock new content.</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-users text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Collaboration</h3>
              <p className="text-gray-600">Connect with peers, share achievements, and participate in group challenges that create lasting environmental impact.</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-orange-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-World Data</h3>
              <p className="text-gray-600">Contribute to citizen science by submitting environmental observations and tracking your eco-impact over time.</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-trophy text-red-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real Rewards</h3>
              <p className="text-gray-600">Partner with environmental organizations to earn certificates, discounts, and recognition for your sustainable actions.</p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-mobile-alt text-teal-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Mobile Optimized</h3>
              <p className="text-gray-600">Learn anywhere with our responsive design that works seamlessly across desktop, tablet, and mobile devices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
