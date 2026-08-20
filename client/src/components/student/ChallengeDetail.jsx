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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function ChallengeDetail(_a) {
    var _this = this;
    var challenge = _a.challenge, participation = _a.participation, onBack = _a.onBack;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _b = useState({
        content: "",
        photoUrl: "",
        data: "",
    }), submissionData = _b[0], setSubmissionData = _b[1];
    var _c = useMutation({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var res, msg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/challenges/".concat(challenge.id, "/join"), {
                            method: "POST",
                            credentials: "include",
                        })];
                    case 1:
                        res = _b.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json().catch(function () { return ({}); })];
                    case 2:
                        msg = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.message) || res.statusText;
                        throw new Error(msg);
                    case 3: return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Joined challenge", description: "You can now submit your work for this challenge!" });
            queryClient.invalidateQueries({ queryKey: ["/api/challenges/student"] });
            queryClient.invalidateQueries({ queryKey: ["/api/challenges/active"] });
            // Refresh the page to show the joined state
            window.location.reload();
        },
        onError: function (err) {
            toast({ title: "Join failed", description: String((err === null || err === void 0 ? void 0 : err.message) || err), variant: "destructive" });
        },
    }), joinChallenge = _c.mutate, isJoining = _c.isPending;
    var _d = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var res, msg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/submissions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                                challengeId: challenge.id,
                                content: data.content,
                                photoUrl: data.photoUrl,
                                data: data.data ? JSON.parse(data.data) : null,
                            }),
                        })];
                    case 1:
                        res = _b.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json().catch(function () { return ({}); })];
                    case 2:
                        msg = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.message) || res.statusText;
                        throw new Error(msg);
                    case 3: return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Submission sent", description: "Your challenge submission has been submitted for review." });
            queryClient.invalidateQueries({ queryKey: ["/api/challenges/student"] });
            onBack();
        },
        onError: function (err) {
            toast({ title: "Submission failed", description: String((err === null || err === void 0 ? void 0 : err.message) || err), variant: "destructive" });
        },
    }), submitChallenge = _d.mutate, isSubmitting = _d.isPending;
    var handleSubmit = function (e) {
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
    var getCategoryIcon = function (category) {
        var icons = {
            "waste-reduction": "fas fa-recycle",
            "energy-conservation": "fas fa-bolt",
            "water-conservation": "fas fa-tint",
            "biodiversity": "fas fa-leaf",
            "climate-action": "fas fa-globe",
            "sustainable-transport": "fas fa-bicycle",
        };
        return icons[category] || "fas fa-tasks";
    };
    var getCategoryColor = function (category) {
        var colors = {
            "waste-reduction": "bg-green-100 text-green-600",
            "energy-conservation": "bg-yellow-100 text-yellow-600",
            "water-conservation": "bg-blue-100 text-blue-600",
            "biodiversity": "bg-emerald-100 text-emerald-600",
            "climate-action": "bg-purple-100 text-purple-600",
            "sustainable-transport": "bg-orange-100 text-orange-600",
        };
        return colors[category] || "bg-gray-100 text-gray-600";
    };
    return (<div className="student-theme">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4" data-testid="button-back-to-challenges">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Challenges
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={"px-3 py-1 rounded-full text-sm font-medium ".concat(getCategoryColor(challenge.category))}>
                <i className={"".concat(getCategoryIcon(challenge.category), " mr-1")}></i>
                {challenge.category.replace("-", " ").replace(/\b\w/g, function (l) { return l.toUpperCase(); })}
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
                    <i className={"fas fa-check text-green-600 ".concat(challenge.requiresReflection ? '' : 'opacity-30')}></i>
                    <span className={challenge.requiresReflection ? '' : 'text-gray-400'}>
                      Written reflection or description
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className={"fas fa-check text-green-600 ".concat(challenge.requiresPhoto ? '' : 'opacity-30')}></i>
                    <span className={challenge.requiresPhoto ? '' : 'text-gray-400'}>
                      Photo evidence
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className={"fas fa-check text-green-600 ".concat(challenge.requiresData ? '' : 'opacity-30')}></i>
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
                <i className={"fas ".concat(participation ? 'fa-paper-plane text-green-600' : 'fa-plus-circle text-blue-600')}></i>
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
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={function () { return joinChallenge(); }} disabled={isJoining}>
                    {isJoining ? (<>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Joining...
                      </>) : (<>
                        <i className="fas fa-plus mr-2"></i>
                        Join Challenge
                      </>)}
                  </Button>
                </div>) : (
        // Submission Form
        <form onSubmit={handleSubmit} className="space-y-4">
                {/* Written Reflection */}
                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Written Reflection *
                  </Label>
                  <Textarea id="content" value={submissionData.content} onChange={function (e) { return setSubmissionData(__assign(__assign({}, submissionData), { content: e.target.value })); }} placeholder="Describe your experience, what you learned, and how it impacted you..." rows={4} required data-testid="textarea-reflection"/>
                </div>

                {/* Photo Upload */}
                {challenge.requiresPhoto && (<div>
                    <Label htmlFor="photoUrl" className="text-sm font-medium text-gray-700">
                      Photo Evidence
                    </Label>
                    <Input id="photoUrl" type="url" value={submissionData.photoUrl} onChange={function (e) { return setSubmissionData(__assign(__assign({}, submissionData), { photoUrl: e.target.value })); }} placeholder="Paste your photo URL here" data-testid="input-photo-url"/>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your photo to an image hosting service and paste the URL here
                    </p>
                  </div>)}

                {/* Data Tracking */}
                {challenge.requiresData && (<div>
                    <Label htmlFor="data" className="text-sm font-medium text-gray-700">
                      Data Tracking
                    </Label>
                    <Textarea id="data" value={submissionData.data} onChange={function (e) { return setSubmissionData(__assign(__assign({}, submissionData), { data: e.target.value })); }} placeholder='Enter your data as JSON, e.g., {"measurement": "5kg", "location": "home"}' rows={3} data-testid="textarea-data"/>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter any measurements or data you collected in JSON format
                    </p>
                  </div>)}

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-student-primary hover:bg-student-dark text-white" disabled={isSubmitting} data-testid="button-submit-challenge">
                  {isSubmitting ? (<>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Submitting...
                    </>) : (<>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Submit Challenge
                    </>)}
                </Button>
              </form>)}
            </CardContent>
          </Card>

          {/* Progress Card */}
          {participation && (<Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-student-primary mb-1">
                    {participation.progress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-student-primary h-2 rounded-full transition-all duration-300" style={{ width: "".concat(participation.progress, "%") }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {participation.progress === 100 ? "Completed!" : "In Progress"}
                  </p>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>);
}
