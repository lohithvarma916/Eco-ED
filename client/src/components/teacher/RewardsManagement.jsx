var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
export default function RewardsManagement() {
    var _this = this;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _a = useState(false), isCreateOpen = _a[0], setIsCreateOpen = _a[1];
    var _b = useState(null), editingReward = _b[0], setEditingReward = _b[1];
    var _c = useState({
        title: "",
        description: "",
        rewardLink: "",
        pointsRequired: "",
    }), formData = _c[0], setFormData = _c[1];
    // Fetch teacher's rewards
    var _d = useQuery({
        queryKey: ["/api/rewards/teacher"],
    }), _e = _d.data, rewards = _e === void 0 ? [] : _e, isLoading = _d.isLoading;
    // Create reward mutation
    var _f = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/rewards", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                                title: data.title,
                                description: data.description,
                                rewardLink: data.rewardLink,
                                pointsRequired: parseInt(data.pointsRequired),
                            }),
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error("Failed to create reward");
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
            setIsCreateOpen(false);
            resetForm();
            toast({ title: "Success", description: "Reward created successfully!" });
        },
        onError: function () {
            toast({ title: "Error", description: "Failed to create reward" });
        },
    }), createReward = _f.mutate, isCreating = _f.isPending;
    // Update reward mutation
    var _g = useMutation({
        mutationFn: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var res;
            var id = _b.id, data = _b.data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch("/api/rewards/".concat(id), {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify(data),
                        })];
                    case 1:
                        res = _c.sent();
                        if (!res.ok)
                            throw new Error("Failed to update reward");
                        return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
            setEditingReward(null);
            resetForm();
            toast({ title: "Success", description: "Reward updated successfully!" });
        },
        onError: function () {
            toast({ title: "Error", description: "Failed to update reward" });
        },
    }), updateReward = _g.mutate, isUpdating = _g.isPending;
    // Delete reward mutation
    var _h = useMutation({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/rewards/".concat(id), {
                            method: "DELETE",
                            credentials: "include",
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error("Failed to delete reward");
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ["/api/rewards/teacher"] });
            toast({ title: "Success", description: "Reward deleted successfully!" });
        },
        onError: function () {
            toast({ title: "Error", description: "Failed to delete reward" });
        },
    }), deleteReward = _h.mutate, isDeleting = _h.isPending;
    var resetForm = function () {
        setFormData({
            title: "",
            description: "",
            rewardLink: "",
            pointsRequired: "",
        });
    };
    var handleSubmit = function (e) {
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
        }
        else {
            createReward(formData);
        }
    };
    var handleEdit = function (reward) {
        setEditingReward(reward);
        setFormData({
            title: reward.title,
            description: reward.description,
            rewardLink: reward.rewardLink,
            pointsRequired: reward.pointsRequired.toString(),
        });
        setIsCreateOpen(true);
    };
    var handleDelete = function (id) {
        if (confirm("Are you sure you want to delete this reward?")) {
            deleteReward(id);
        }
    };
    if (isLoading) {
        return (<div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rewards...</div>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-teacher-primary">Rewards Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={function () {
            resetForm();
            setEditingReward(null);
        }} className="bg-teacher-primary hover:bg-teacher-dark text-white">
              <Plus className="w-4 h-4 mr-2"/>
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
                <Input id="title" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} placeholder="e.g., Extra Credit Assignment" required/>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }} placeholder="Describe what this reward offers..." required/>
              </div>
              <div>
                <Label htmlFor="rewardLink">Reward Link</Label>
                <Input id="rewardLink" type="url" value={formData.rewardLink} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { rewardLink: e.target.value })); }} placeholder="https://example.com/reward" required/>
              </div>
              <div>
                <Label htmlFor="pointsRequired">Points Required</Label>
                <Input id="pointsRequired" type="number" min="1" value={formData.pointsRequired} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { pointsRequired: e.target.value })); }} placeholder="100" required/>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating} className="flex-1">
                  {isCreating || isUpdating ? "Saving..." : editingReward ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={function () { return setIsCreateOpen(false); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rewards.length === 0 ? (<Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Coins className="w-12 h-12 text-gray-400 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Rewards Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Create your first reward to motivate students and recognize their achievements.
            </p>
            <Button onClick={function () { return setIsCreateOpen(true); }} className="bg-teacher-primary hover:bg-teacher-dark text-white">
              <Plus className="w-4 h-4 mr-2"/>
              Create Your First Reward
            </Button>
          </CardContent>
        </Card>) : (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map(function (reward) { return (<Card key={reward.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Coins className="w-3 h-3"/>
                    {reward.pointsRequired} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">{reward.description}</p>
                
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-500"/>
                  <a href={reward.rewardLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                    View Reward
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={function () { return handleEdit(reward); }} disabled={isUpdating}>
                    <Edit className="w-3 h-3 mr-1"/>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={function () { return handleDelete(reward.id); }} disabled={isDeleting}>
                    <Trash2 className="w-3 h-3 mr-1"/>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>); })}
        </div>)}
    </div>);
}
