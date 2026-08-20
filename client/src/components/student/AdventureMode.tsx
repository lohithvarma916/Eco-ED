import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Chapter, UserProgressWithDetails } from "@shared/schema";

export default function AdventureMode() {
  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters"],
  });

  const { data: userProgress = [] } = useQuery<UserProgressWithDetails[]>({
    queryKey: ["/api/progress"],
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adventure Mode</h1>
        <p className="text-gray-600">Embark on environmental missions and unlock new chapters</p>
      </div>
      
      {/* Story Progress */}
      <Card className="p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Your Environmental Journey</h2>
            <p className="text-gray-600">Level 7 • 1,250 XP</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="progress-ring w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#4ade80"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="226.19"
                strokeDashoffset="37.8"
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">83%</span>
            </div>
          </div>
        </div>
        
        {/* Chapter Progress */}
        <div className="space-y-6">
          {chapters.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-map text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adventure content coming soon</h3>
              <p className="text-gray-500">Check back later for exciting environmental adventures!</p>
            </div>
          ) : (
            <>
              {/* Completed Chapter Example */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Chapter 1: Eco Awakening</h3>
                  <p className="text-gray-600">Learn the basics of environmental science</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span>
                    <span className="text-sm text-gray-500">+200 XP earned</span>
                  </div>
                </div>
              </div>
              
              {/* Completed Chapter Example */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Chapter 2: Water Wisdom</h3>
                  <p className="text-gray-600">Explore water cycles and conservation</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Completed</span>
                    <span className="text-sm text-gray-500">+250 XP earned</span>
                  </div>
                </div>
              </div>
              
              {/* Current Chapter Example */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <i className="fas fa-tree text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Chapter 3: Forest Guardians</h3>
                  <p className="text-gray-600">Protect biodiversity and ecosystems</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">In Progress (2/5)</span>
                    <Button 
                      className="bg-student-primary hover:bg-student-dark text-white px-4 py-1 rounded-full text-sm"
                      data-testid="button-continue-chapter"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Locked Chapter Example */}
              <div className="flex items-center space-x-4 opacity-50">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-lock text-gray-500 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Chapter 4: Climate Champions</h3>
                  <p className="text-gray-600">Fight climate change with action</p>
                  <div className="mt-2">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Locked</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
      
      {/* Current Mission */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border">
        <h2 className="text-xl font-semibold mb-4">Current Mission</h2>
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
              alt="Biodiversity research"
              className="w-24 h-18 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Mission: Biodiversity Survey</h3>
              <p className="text-gray-600 mb-4">
                Document 5 different species in your local area and research their role in the ecosystem.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-500">Progress: 2/5 species found</span>
                <span className="text-sm text-green-600 font-semibold">+150 XP reward</span>
              </div>
              <Button 
                className="bg-student-primary hover:bg-student-dark text-white"
                data-testid="button-submit-findings"
              >
                Submit Findings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
