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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export default function StudentSidebar(_a) {
    var _this = this;
    var _b, _c;
    var user = _a.user, activeSection = _a.activeSection, onSectionChange = _a.onSectionChange;
    var levelProgress = (user === null || user === void 0 ? void 0 : user.experience) ? ((user.experience % 1000) / 1000) * 100 : 0;
    var nextLevelXP = Math.ceil(((user === null || user === void 0 ? void 0 : user.experience) || 0) / 1000) * 1000;
    return (<aside className="w-64 bg-card shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-student-primary to-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-leaf text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-gray-900">Eco-ED</span>
        </div>
        <div className="mt-4 p-3 bg-student-light rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-student-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {((_b = user === null || user === void 0 ? void 0 : user.firstName) === null || _b === void 0 ? void 0 : _b.charAt(0)) || ((_c = user === null || user === void 0 ? void 0 : user.email) === null || _c === void 0 ? void 0 : _c.charAt(0)) || 'S'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm" data-testid="text-student-name">
                {(user === null || user === void 0 ? void 0 : user.firstName) ? "".concat(user.firstName, " ").concat(user.lastName || '').trim() : (user === null || user === void 0 ? void 0 : user.email) || 'Student'}
              </p>
              <p className="text-xs text-gray-600">Level {(user === null || user === void 0 ? void 0 : user.level) || 1} Eco-Warrior</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Progress</span>
              <span data-testid="text-experience-progress">
                {(user === null || user === void 0 ? void 0 : user.experience) || 0} / {nextLevelXP} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-2"/>
          </div>
        </div>
      </div>
      
      <nav className="p-6 space-y-2">
        <button onClick={function () { return onSectionChange('dashboard'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'dashboard'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-dashboard">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </button>
        
        <button onClick={function () { return onSectionChange('challenges'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'challenges'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-challenges">
          <i className="fas fa-tasks"></i>
          <span>Challenges</span>
        </button>
        
        <button onClick={function () { return onSectionChange('adventure'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'adventure'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-adventure">
          <i className="fas fa-map"></i>
          <span>Adventure Mode</span>
        </button>
        
        <button onClick={function () { return onSectionChange('leaderboard'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'leaderboard'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-leaderboard">
          <i className="fas fa-trophy"></i>
          <span>Leaderboard</span>
        </button>
        
        <button onClick={function () { return onSectionChange('community'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'community'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-community">
          <i className="fas fa-comments"></i>
          <span>Community</span>
        </button>
        
        <button onClick={function () { return onSectionChange('rewards'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'rewards'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-rewards">
          <i className="fas fa-gift"></i>
          <span>Rewards</span>
        </button>
        
        <button onClick={function () { return onSectionChange('profile'); }} className={"w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ".concat(activeSection === 'profile'
            ? 'bg-student-light text-student-primary'
            : 'text-gray-600 hover:bg-student-light hover:text-student-primary')} data-testid="button-nav-profile">
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Button variant="outline" className="w-full" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch('/api/auth/logout', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            window.location.href = '/';
                        }
                        else {
                            console.error('Logout failed');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Logout error:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }} data-testid="button-logout">
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </Button>
      </div>
    </aside>);
}
