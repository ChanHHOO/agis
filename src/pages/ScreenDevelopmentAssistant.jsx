import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Code,
  Figma,
  RefreshCw,
  Download,
  ExternalLink,
  FileText,
  Zap,
} from "lucide-react";
import { FigmaImage } from "@/components/ui/FigmaImage";

// 더미 데이터
const mockScreenData = {
  "SCR-001": {
    screenId: "SCR-001",
    screenName: "사용자 로그인 페이지",
    figmaUrl:
      "https://www.figma.com/file/OaFdNQeV9CabB9sxJoSYTZ/Untitled?type=design&node-id=117-336",
    figmaFileId: "OaFdNQeV9CabB9sxJoSYTZ",
    figmaNodeId: "117:336",
    lastUpdated: "2024-01-15 14:30:00",
    functionalSpec: {
      overview: "사용자가 시스템에 로그인할 수 있는 인터페이스를 제공합니다.",
      requirements: [
        "이메일/사용자명과 비밀번호 입력 필드",
        "로그인 버튼 및 폼 검증",
        "비밀번호 찾기 링크",
        "회원가입 링크",
        "소셜 로그인 옵션 (Google, GitHub)",
        "로그인 상태 유지 체크박스",
      ],
      acceptance: [
        "유효한 자격증명으로 로그인 시 대시보드로 리다이렉트",
        "잘못된 자격증명 시 에러 메시지 표시",
        "빈 필드 제출 시 검증 메시지 표시",
        "비밀번호 찾기 클릭 시 비밀번호 재설정 페이지로 이동",
      ],
    },
    recommendedApis: [
      {
        name: "Authentication API",
        endpoint: "/api/auth/login",
        method: "POST",
        description: "사용자 로그인 인증",
        params: ["email", "password"],
        response: "JWT 토큰 및 사용자 정보",
      },
      {
        name: "Password Reset API",
        endpoint: "/api/auth/reset-password",
        method: "POST",
        description: "비밀번호 재설정 요청",
        params: ["email"],
        response: "재설정 링크 전송 확인",
      },
      {
        name: "Social Login API",
        endpoint: "/api/auth/social",
        method: "POST",
        description: "소셜 로그인 처리",
        params: ["provider", "token"],
        response: "JWT 토큰 및 사용자 정보",
      },
    ],
  },
};

export function ScreenDevelopmentAssistant() {
  const { screenId } = useParams();
  const [screenData, setScreenData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [figmaConnected, setFigmaConnected] = useState(true);

  useEffect(() => {
    if (screenId && mockScreenData[screenId]) {
      setScreenData(mockScreenData[screenId]);
    }
  }, [screenId]);

  const handleGenerateBaseCode = async () => {
    setIsGenerating(true);
    // 실제로는 AI API를 호출하여 코드를 생성
    setTimeout(() => {
      setIsGenerating(false);
      alert("베이스 코드가 생성되었습니다! 다운로드를 시작합니다.");
    }, 3000);
  };

  const handleRefreshFigma = () => {
    alert("Figma 디자인을 새로고침했습니다.");
  };

  if (!screenData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">화면 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            화면 개발 도우미
          </h1>
          <p className="text-muted-foreground">
            {screenData.screenName} ({screenData.screenId})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={figmaConnected ? "default" : "destructive"}>
            {figmaConnected ? "Figma 연결됨" : "Figma 연결 끊김"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Figma 디자인 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Figma className="w-5 h-5" />
              <span>Figma 디자인</span>
            </CardTitle>
            <CardDescription>
              실시간으로 Figma 디자인 변경사항이 반영됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {screenData && (
              <FigmaImage
                fileId={screenData.figmaFileId}
                nodeId={screenData.figmaNodeId}
              />
            )}

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefreshFigma}>
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={screenData.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Figma에서 열기
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 코드 생성 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>베이스 코드 생성</span>
            </CardTitle>
            <CardDescription>
              AI가 Figma 디자인과 기능 명세를 바탕으로 베이스 코드를 생성합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">생성될 코드 구성요소:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React 컴포넌트 구조</li>
                <li>• Tailwind CSS 스타일링</li>
                <li>• 폼 검증 로직</li>
                <li>• API 연동 코드</li>
                <li>• 반응형 디자인</li>
              </ul>
            </div>
            <Separator />
            <Button
              onClick={handleGenerateBaseCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  코드 생성 중...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  베이스 코드 생성
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 탭 */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="spec" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="spec" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>기능 명세서</span>
              </TabsTrigger>
              <TabsTrigger value="apis" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>추천 API</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="spec" className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">개요</h3>
                <p className="text-muted-foreground">
                  {screenData.functionalSpec.overview}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">기능 요구사항</h3>
                <ul className="space-y-2">
                  {screenData.functionalSpec.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">수락 기준</h3>
                <ul className="space-y-2">
                  {screenData.functionalSpec.acceptance.map(
                    (criteria, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">{criteria}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="apis" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">추천 API 목록</h3>
                <div className="grid gap-4">
                  {screenData.recommendedApis.map((api, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{api.name}</h4>
                          <Badge variant="outline">{api.method}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {api.description}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>엔드포인트:</strong>{" "}
                            <code className="bg-muted px-1 rounded">
                              {api.endpoint}
                            </code>
                          </p>
                          <p>
                            <strong>파라미터:</strong> {api.params.join(", ")}
                          </p>
                          <p>
                            <strong>응답:</strong> {api.response}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
