import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Coins, Gift, CheckCircle } from "lucide-react";
import type { Reward, UserReward } from "@shared/schema";

export default function StudentRewards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("available");

  // Fetch user points
  const { data: userPoints = { points: 0 } } = useQuery<{ points: number }>({
    queryKey: ["/api/user/points"],
  });

  // Fetch available rewards
  const { data: availableRewards = [], isLoading: isLoadingAvailable } = useQuery<Reward[]>({
    queryKey: ["/api/rewards/active"],
  });

  // Fetch user's redeemed rewards
  const { data: userRewards = [], isLoading: isLoadingRedeemed } = useQuery<(UserReward & { reward: Reward })[]>({
    queryKey: ["/api/rewards/user"],
  });

  // Redeem reward mutation
  const { mutate: redeemReward, isPending: isRedeeming } = useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await fetch(`/api/rewards/${rewardId}/redeem`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to redeem reward");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/points"] });
      toast({ title: "Success", description: "Reward redeemed successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to redeem reward" 
      });
    },
  });

  const handleRedeem = (reward: Reward) => {
    if (userPoints.points < reward.pointsRequired) {
      toast({ 
        title: "Insufficient Points", 
        description: `You need ${reward.pointsRequired} points but only have ${userPoints.points}` 
      });
      return;
    }
    redeemReward(reward.id);
  };

  const canRedeem = (reward: Reward) => userPoints.points >= reward.pointsRequired;

  if (isLoadingAvailable || isLoadingRedeemed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-student-primary">Rewards</h2>
        <div className="flex items-center gap-2 bg-student-light p-3 rounded-lg">
          <Coins className="w-5 h-5 text-student-primary" />
          <span className="font-semibold text-student-primary">
            {userPoints.points} Points
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="redeemed">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableRewards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Gift className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Rewards Available</h3>
                <p className="text-gray-500 text-center">
                  Check back later for new rewards from your teachers!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRewards.map((reward) => (
                <Card key={reward.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <Badge 
                        variant={canRedeem(reward) ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3" />
                        {reward.pointsRequired} pts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{reward.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <a 
                        href={reward.rewardLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline truncate"
                      >
                        View Details
                      </a>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem(reward) || isRedeeming}
                      variant={canRedeem(reward) ? "default" : "secondary"}
                    >
                      {isRedeeming ? "Redeeming..." : canRedeem(reward) ? "Redeem Reward" : "Insufficient Points"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4">
          {userRewards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Rewards Redeemed Yet</h3>
                <p className="text-gray-500 text-center">
                  Start earning points by completing challenges and redeem your first reward!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userRewards.map((userReward) => (
                <Card key={userReward.id} className="relative border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {userReward.reward.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Redeemed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{userReward.reward.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <a 
                        href={userReward.reward.rewardLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline truncate"
                      >
                        Access Reward
                      </a>
                    </div>

                    <div className="text-xs text-gray-500">
                      Redeemed on {userReward.redeemedAt ? new Date(userReward.redeemedAt).toLocaleDateString() : '—'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
