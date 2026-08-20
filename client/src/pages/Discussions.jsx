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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
export default function Discussions() {
    var _this = this;
    var queryClient = useQueryClient();
    var toast = useToast().toast;
    var _a = useState(""), title = _a[0], setTitle = _a[1];
    var _b = useState(""), content = _b[0], setContent = _b[1];
    var _c = useQuery({
        queryKey: ["/api/forum/posts"],
    }), _d = _c.data, forumPosts = _d === void 0 ? [] : _d, isLoading = _c.isLoading;
    var _e = useMutation({
        mutationFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var res, msg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/forum/posts", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ title: title, content: content }),
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
            setTitle("");
            setContent("");
            queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
            toast({ title: "Discussion posted", description: "Your discussion is now live." });
        },
        onError: function (err) {
            toast({ title: "Failed to post", description: String((err === null || err === void 0 ? void 0 : err.message) || err), variant: "destructive" });
        },
    }), createPost = _e.mutate, isPending = _e.isPending;
    return (<div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussions</h1>
        <p className="text-gray-600">Start a conversation or join one below</p>
      </div>

      {/* Composer */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Start a new discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={title} onChange={function (e) { return setTitle(e.target.value); }}/>
          <Textarea placeholder="Share your thoughts..." value={content} onChange={function (e) { return setContent(e.target.value); }} rows={5}/>
          <div className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!title || !content || isPending} onClick={function () { return createPost(); }} data-testid="button-submit-discussion">
              {isPending ? "Posting..." : "Post Discussion"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent discussions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (<div className="text-center py-8 text-gray-500">Loading...</div>) : forumPosts.length === 0 ? (<div className="text-center py-12">
              <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-500">Be the first to start a conversation!</p>
            </div>) : (<div className="space-y-6">
              {forumPosts.map(function (post) {
                var _a, _b;
                return (<div key={post.id} className="border-b pb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {((_b = (_a = post.user) === null || _a === void 0 ? void 0 : _a.firstName) === null || _b === void 0 ? void 0 : _b.charAt(0)) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">
                          {post.user.firstName ? "".concat(post.user.firstName, " ").concat(post.user.lastName || "").trim() : "Anonymous"}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Unknown"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="hover:text-green-600">
                          <i className="fas fa-thumbs-up mr-1"></i>{post.likes} likes
                        </button>
                        <button className="hover:text-green-600">
                          <i className="fas fa-comment mr-1"></i>{post.replyCount || 0} replies
                        </button>
                      </div>
                    </div>
                  </div>
                </div>);
            })}
            </div>)}
        </CardContent>
      </Card>
    </div>);
}
