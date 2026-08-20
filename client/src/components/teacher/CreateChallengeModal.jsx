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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
export default function CreateChallengeModal(_a) {
    var _this = this;
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _b = useState({
        title: '',
        description: '',
        category: '',
        duration: '',
        points: '',
        requiresPhoto: false,
        requiresReflection: false,
        requiresData: false,
    }), formData = _b[0], setFormData = _b[1];
    var createMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest('POST', '/api/challenges', data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
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
        onError: function (error) {
            if (isUnauthorizedError(error)) {
                toast({
                    title: "Unauthorized",
                    description: "You are logged out. Logging in again...",
                    variant: "destructive",
                });
                setTimeout(function () {
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
    var handleSubmit = function (e) {
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
    return (<Dialog open={open} onOpenChange={onOpenChange}>
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
            <Input id="title" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} placeholder="Enter challenge title" required data-testid="input-challenge-title"/>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea id="description" value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }} placeholder="Describe the challenge objectives and requirements" rows={4} required data-testid="input-challenge-description"/>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (Days) *
              </Label>
              <Input id="duration" type="number" min="1" max="365" value={formData.duration} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { duration: e.target.value })); }} placeholder="30" required data-testid="input-challenge-duration"/>
            </div>
            
            <div>
              <Label htmlFor="points" className="text-sm font-medium text-gray-700">
                Points Reward *
              </Label>
              <Input id="points" type="number" min="10" max="1000" step="10" value={formData.points} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { points: e.target.value })); }} placeholder="100" required data-testid="input-challenge-points"/>
            </div>
          </div>
          
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Challenge Category *
            </Label>
            <Select value={formData.category} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { category: value })); }}>
              <SelectTrigger data-testid="select-challenge-category">
                <SelectValue placeholder="Select a category"/>
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
                <Checkbox id="requiresPhoto" checked={formData.requiresPhoto} onCheckedChange={function (checked) { return setFormData(__assign(__assign({}, formData), { requiresPhoto: !!checked })); }} data-testid="checkbox-requires-photo"/>
                <Label htmlFor="requiresPhoto">Photo evidence required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="requiresReflection" checked={formData.requiresReflection} onCheckedChange={function (checked) { return setFormData(__assign(__assign({}, formData), { requiresReflection: !!checked })); }} data-testid="checkbox-requires-reflection"/>
                <Label htmlFor="requiresReflection">Written reflection required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="requiresData" checked={formData.requiresData} onCheckedChange={function (checked) { return setFormData(__assign(__assign({}, formData), { requiresData: !!checked })); }} data-testid="checkbox-requires-data"/>
                <Label htmlFor="requiresData">Data tracking required</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={function () { return onOpenChange(false); }} data-testid="button-cancel-challenge">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-create-challenge-submit">
              {createMutation.isPending ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}
