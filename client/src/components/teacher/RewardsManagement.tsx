import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, ExternalLink, Coins } from "lucide-react";
import type { Reward } from "@shared/schema";

export default function RewardsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rewardLink: "",
    pointsRequired: "",
  });

  // Fetch teacher's rewards
  const { data: rewards = [], isLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards/teacher"],
  });

  // Create reward mutation
  const { mutate: createReward, isPending: isCreating } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          rewardLink: data.rewardLink,
          pointsRequired: parseInt(data.pointsRequired),
        }),
      });
      if (!res.ok) throw new Error("Failed to create reward");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Success", description: "Reward created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create reward" });
    },
  });

  // Update reward mutation
  const { mutate: updateReward, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title?: string; description?: string; rewardLink?: string; pointsRequired?: number } }) => {
      const res = await fetch(`/api/rewards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update reward");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
      setEditingReward(null);
      resetForm();
      toast({ title: "Success", description: "Reward updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update reward" });
    },
  });

  // Delete reward mutation
  const { mutate: deleteReward, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rewards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete reward");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
      toast({ title: "Success", description: "Reward deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete reward" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      rewardLink: "",
      pointsRequired: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReward) {
      updateReward({
        id: editingReward.id,
        data: {
          title: formData.title,
          description: formData.description,
          rewardLink: formData.rewardLink,
          pointsRequired: Number(formData.pointsRequired),
        },
      });
    } else {
      createReward(formData);
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      rewardLink: reward.rewardLink,
      pointsRequired: reward.pointsRequired.toString(),
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this reward?")) {
      deleteReward(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-teacher-primary">Rewards Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setEditingReward(null);
              }}
              className="bg-teacher-primary hover:bg-teacher-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReward ? "Edit Reward" : "Create New Reward"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Reward Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Extra Credit Assignment"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this reward offers..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="rewardLink">Reward Link</Label>
                <Input
                  id="rewardLink"
                  type="url"
                  value={formData.rewardLink}
                  onChange={(e) => setFormData({ ...formData, rewardLink: e.target.value })}
                  placeholder="https://example.com/reward"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pointsRequired">Points Required</Label>
                <Input
                  id="pointsRequired"
                  type="number"
                  min="1"
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating} className="flex-1">
                  {isCreating || isUpdating ? "Saving..." : editingReward ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rewards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Coins className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Rewards Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Create your first reward to motivate students and recognize their achievements.
            </p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-teacher-primary hover:bg-teacher-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Reward
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <Card key={reward.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
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
                    View Reward
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(reward)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(reward.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
