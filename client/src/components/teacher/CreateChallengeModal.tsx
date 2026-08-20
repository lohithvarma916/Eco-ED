import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateChallengeModal({ open, onOpenChange }: CreateChallengeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    points: '',
    requiresPhoto: false,
    requiresReflection: false,
    requiresData: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/challenges', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Challenge created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/teacher'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/teacher'] });
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: '',
        points: '',
        requiresPhoto: false,
        requiresReflection: false,
        requiresData: false,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.duration || !formData.points) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      duration: parseInt(formData.duration),
      points: parseInt(formData.points),
      requiresPhoto: formData.requiresPhoto,
      requiresReflection: formData.requiresReflection,
      requiresData: formData.requiresData,
      status: 'active',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Create New Challenge
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Challenge Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter challenge title"
              required
              data-testid="input-challenge-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the challenge objectives and requirements"
              rows={4}
              required
              data-testid="input-challenge-description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (Days) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
                data-testid="input-challenge-duration"
              />
            </div>
            
            <div>
              <Label htmlFor="points" className="text-sm font-medium text-gray-700">
                Points Reward *
              </Label>
              <Input
                id="points"
                type="number"
                min="10"
                max="1000"
                step="10"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                placeholder="100"
                required
                data-testid="input-challenge-points"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Challenge Category *
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger data-testid="select-challenge-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waste-reduction">Waste Reduction</SelectItem>
                <SelectItem value="energy-conservation">Energy Conservation</SelectItem>
                <SelectItem value="water-conservation">Water Conservation</SelectItem>
                <SelectItem value="biodiversity">Biodiversity</SelectItem>
                <SelectItem value="climate-action">Climate Action</SelectItem>
                <SelectItem value="sustainable-transport">Sustainable Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Submission Requirements
            </Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresPhoto"
                  checked={formData.requiresPhoto}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresPhoto: !!checked })}
                  data-testid="checkbox-requires-photo"
                />
                <Label htmlFor="requiresPhoto">Photo evidence required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresReflection"
                  checked={formData.requiresReflection}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresReflection: !!checked })}
                  data-testid="checkbox-requires-reflection"
                />
                <Label htmlFor="requiresReflection">Written reflection required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresData"
                  checked={formData.requiresData}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresData: !!checked })}
                  data-testid="checkbox-requires-data"
                />
                <Label htmlFor="requiresData">Data tracking required</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-challenge"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-teacher-primary hover:bg-teacher-dark text-white"
              data-testid="button-create-challenge-submit"
            >
              {createMutation.isPending ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
