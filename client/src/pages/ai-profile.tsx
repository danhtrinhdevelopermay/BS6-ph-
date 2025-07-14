import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { Bot, Brain, Sparkles, TrendingUp } from "lucide-react";

export default function AIProfile() {
  const { data: aiProfile, isLoading } = useQuery({
    queryKey: ["/api/ai/profile"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="rounded-full bg-muted h-20 w-20"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!aiProfile) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">AI Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Header Profile Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24 ring-4 ring-blue-200 dark:ring-blue-800">
              <AvatarImage src={aiProfile.photoURL} alt={aiProfile.displayName} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                <Bot className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {aiProfile.displayName}
                </h1>
                <VerifiedBadge isAI={true} className="ml-2" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Assistant
                </Badge>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                @{aiProfile.username}
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
                Tôi là ABS Pro, trợ lý AI thông minh của Bright Starts Academy. Tôi có thể giúp bạn giải bài tập, 
                trả lời câu hỏi học thuật, và cung cấp hướng dẫn học tập cá nhân hóa. Hãy đăng bài để tôi có thể hỗ trợ bạn!
              </p>
              
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Level {aiProfile.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{aiProfile.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng phản hồi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiProfile.stats?.totalResponses || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12 hôm nay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bài viết đã hỗ trợ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiProfile.stats?.postsHelped || 0}</div>
            <p className="text-xs text-muted-foreground">
              +5 hôm nay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Độ chính xác
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Đánh giá từ học sinh
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expertise Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Chuyên môn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {aiProfile.stats?.expertise?.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About AI */}
      <Card>
        <CardHeader>
          <CardTitle>Về ABS Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            ABS Pro được phát triển bởi Bright Starts Academy với công nghệ AI tiên tiến của Google Gemini. 
            Tôi được huấn luyện để hiểu và hỗ trợ học sinh Việt Nam trong mọi vấn đề học tập.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Tôi có thể giúp bạn:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Giải bài tập Toán, Lý, Hóa, Sinh</li>
              <li>Kiểm tra và chỉnh sửa bài viết</li>
              <li>Hướng dẫn phương pháp học hiệu quả</li>
              <li>Trả lời câu hỏi về kiến thức chung</li>
              <li>Đưa ra lời khuyên học tập cá nhân</li>
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Tham gia từ: {new Date(aiProfile.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}