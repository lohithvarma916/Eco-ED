import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Challenge, ChallengeParticipant } from "@shared/schema";

interface ChallengeDetailProps {
  challenge: Challenge;
  participation?: ChallengeParticipant;
  onBack: () => void;
}

export default function ChallengeDetail({ challenge, participation, onBack }: ChallengeDetailProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submissionData, setSubmissionData] = useState({
    content: "",
    photoUrl: "",
    data: "",
  });

  const { mutate: joinChallenge, isPending: isJoining } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/challenges/${challenge.id}/join`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message || res.statusText;
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Joined challenge", description: "You can now submit your work for this challenge!" });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/student"] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/active"] });
      // Refresh the page to show the joined state
      window.location.reload();
    },
    onError: (err: any) => {
      toast({ title: "Join failed", description: String(err?.message || err), variant: "destructive" });
    },
  });

  const { mutate: submitChallenge, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          challengeId: challenge.id,
          content: data.content,
          photoUrl: data.photoUrl,
          data: data.data ? JSON.parse(data.data) : null,
        }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message || res.statusText;
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Submission sent", description: "Your challenge submission has been submitted for review." });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/student"] });
      onBack();
    },
    onError: (err: any) => {
      toast({ title: "Submission failed", description: String(err?.message || err), variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionData.content.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide a written reflection or description.",
        variant: "destructive",
      });
      return;
    }

    submitChallenge(submissionData);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "waste-reduction": "fas fa-recycle",
      "energy-conservation": "fas fa-bolt",
      "water-conservation": "fas fa-tint",
      "biodiversity": "fas fa-leaf",
      "climate-action": "fas fa-globe",
      "sustainable-transport": "fas fa-bicycle",
    };
    return icons[category] || "fas fa-tasks";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "waste-reduction": "bg-green-100 text-green-600",
      "energy-conservation": "bg-yellow-100 text-yellow-600",
      "water-conservation": "bg-blue-100 text-blue-600",
      "biodiversity": "bg-emerald-100 text-emerald-600",
      "climate-action": "bg-purple-100 text-purple-600",
      "sustainable-transport": "bg-orange-100 text-orange-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="student-theme">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
          data-testid="button-back-to-challenges"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Challenges
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(challenge.category)}`}>
                <i className={`${getCategoryIcon(challenge.category)} mr-1`}></i>
                {challenge.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span><i className="fas fa-star mr-1"></i> {challenge.points} points</span>
              <span><i className="fas fa-clock mr-1"></i> {challenge.duration} days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Challenge Description */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-info-circle text-blue-600"></i>
                <span>Challenge Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
              </div>
              
              {/* Requirements */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Submission Requirements:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <i className={`fas fa-check text-green-600 ${challenge.requiresReflection ? '' : 'opacity-30'}`}></i>
                    <span className={challenge.requiresReflection ? '' : 'text-gray-400'}>
                      Written reflection or description
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className={`fas fa-check text-green-600 ${challenge.requiresPhoto ? '' : 'opacity-30'}`}></i>
                    <span className={challenge.requiresPhoto ? '' : 'text-gray-400'}>
                      Photo evidence
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className={`fas fa-check text-green-600 ${challenge.requiresData ? '' : 'opacity-30'}`}></i>
                    <span className={challenge.requiresData ? '' : 'text-gray-400'}>
                      Data tracking
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Challenge or Submission Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className={`fas ${participation ? 'fa-paper-plane text-green-600' : 'fa-plus-circle text-blue-600'}`}></i>
                <span>{participation ? 'Submit Your Work' : 'Join Challenge'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!participation ? (
                // Join Challenge Section
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-leaf text-blue-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Make a Difference?</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Join this challenge and start your environmental journey. You'll earn {challenge.points} points upon completion!
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="fas fa-star text-yellow-500"></i>
                      <span>{challenge.points} points reward</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="fas fa-clock text-blue-500"></i>
                      <span>{challenge.duration} days duration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span>Complete at your own pace</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => joinChallenge()}
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Joining...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Join Challenge
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // Submission Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Written Reflection */}
                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Written Reflection *
                  </Label>
                  <Textarea
                    id="content"
                    value={submissionData.content}
                    onChange={(e) => setSubmissionData({ ...submissionData, content: e.target.value })}
                    placeholder="Describe your experience, what you learned, and how it impacted you..."
                    rows={4}
                    required
                    data-testid="textarea-reflection"
                  />
                </div>

                {/* Photo Upload */}
                {challenge.requiresPhoto && (
                  <div>
                    <Label htmlFor="photoUrl" className="text-sm font-medium text-gray-700">
                      Photo Evidence
                    </Label>
                    <Input
                      id="photoUrl"
                      type="url"
                      value={submissionData.photoUrl}
                      onChange={(e) => setSubmissionData({ ...submissionData, photoUrl: e.target.value })}
                      placeholder="Paste your photo URL here"
                      data-testid="input-photo-url"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your photo to an image hosting service and paste the URL here
                    </p>
                  </div>
                )}

                {/* Data Tracking */}
                {challenge.requiresData && (
                  <div>
                    <Label htmlFor="data" className="text-sm font-medium text-gray-700">
                      Data Tracking
                    </Label>
                    <Textarea
                      id="data"
                      value={submissionData.data}
                      onChange={(e) => setSubmissionData({ ...submissionData, data: e.target.value })}
                      placeholder='Enter your data as JSON, e.g., {"measurement": "5kg", "location": "home"}'
                      rows={3}
                      data-testid="textarea-data"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter any measurements or data you collected in JSON format
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-student-primary hover:bg-student-dark text-white"
                  disabled={isSubmitting}
                  data-testid="button-submit-challenge"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Submit Challenge
                    </>
                  )}
                </Button>
              </form>
              )}
            </CardContent>
          </Card>

          {/* Progress Card */}
          {participation && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-student-primary mb-1">
                    {participation.progress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-student-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${participation.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {participation.progress === 100 ? "Completed!" : "In Progress"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
