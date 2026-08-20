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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
export default function Signup() {
    var _this = this;
    var params = new URLSearchParams(window.location.search);
    var preselectedRole = params.get("role") || "";
    var _a = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: preselectedRole,
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var toast = useToast().toast;
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (formData.password !== formData.confirmPassword) {
                        toast({
                            title: "Password Mismatch",
                            description: "Passwords do not match",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    if (!formData.role) {
                        toast({
                            title: "Role Required",
                            description: "Please select your role",
                            variant: "destructive",
                        });
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch('/api/auth/signup', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: formData.email,
                                password: formData.password,
                                role: formData.role,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    toast({
                        title: "Account Created",
                        description: "Your account has been created successfully!",
                    });
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 1500);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    error = _a.sent();
                    toast({
                        title: "Signup Failed",
                        description: error.message || "Failed to create account",
                        variant: "destructive",
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Something went wrong. Please try again.",
                        variant: "destructive",
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-leaf text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Eco-ED</h1>
          <p className="text-gray-600">Create your account and start your environmental learning journey</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First name" value={formData.firstName} onChange={function (e) { return handleInputChange("firstName", e.target.value); }} required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last name" value={formData.lastName} onChange={function (e) { return handleInputChange("lastName", e.target.value); }} required/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={function (e) { return handleInputChange("email", e.target.value); }} required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select value={formData.role} onValueChange={function (value) { return handleInputChange("role", value); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center">
                      <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center">
                      <i className="fas fa-chalkboard-teacher mr-2 text-green-600"></i>
                      Teacher
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" value={formData.password} onChange={function (e) { return handleInputChange("password", e.target.value); }} required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={function (e) { return handleInputChange("confirmPassword", e.target.value); }} required/>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (<>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating account...
                </>) : ("Create Account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button onClick={function () { return window.location.href = '/login'; }} className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button onClick={function () { return window.location.href = '/'; }} className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </button>
          </div>
        </Card>
      </div>
    </div>);
}
