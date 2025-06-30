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
import { supabase } from "@/lib/supabase"; // supabase 클라이언트 import
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY; // .env에 저장
const FIGMA_TOKEN = import.meta.env.VITE_FIGMA_TOKEN;

// 더미 데이터 일부 유지 (추천 API)
const mockApiData = {
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
};

async function fetchClaudeBaseCode({ systemPrompt, userContentArray }) {
  const response = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userContentArray,
        },
      ],
    }),
  });
  const data = await response.json();
  const match = data.content[0]?.text?.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : data.content[0]?.text?.trim();
}

async function getFigmaImageBase64({ fileId, nodeId, figmaApiKey }) {
  // 1. Figma API로 진짜 이미지 URL 얻기
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png`;
  const response = await fetch(url, {
    headers: { "X-Figma-Token": figmaApiKey },
  });
  const data = await response.json();
  const imageUrl = data.images[nodeId];
  if (!imageUrl) throw new Error("Figma 이미지 URL을 가져올 수 없습니다.");

  // 2. 이미지 URL을 fetch해서 base64 변환
  const imgRes = await fetch(imageUrl);
  const blob = await imgRes.blob();
  if (!blob.type.startsWith("image/"))
    throw new Error("이미지 파일이 아닙니다.");

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return { base64, mediaType: blob.type };
}

export function ScreenDevelopmentAssistant() {
  const { screenId } = useParams();
  const [screenData, setScreenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [figmaConnected, setFigmaConnected] = useState(true);
  const [generatedCode, setGeneratedCode] = useState("");
  const [figmaImageUrl, setFigmaImageUrl] = useState("");

  useEffect(() => {
    const fetchScreenData = async () => {
      if (!screenId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. 'Pages' 테이블에서 화면 정보 조회
        const { data: pageData, error: pageError } = await supabase
          .from("Pages")
          .select("id, screen_id, description, file, node")
          .eq("screen_id", screenId)
          .single();

        if (pageError) throw pageError;
        if (!pageData) throw new Error("화면 정보를 찾을 수 없습니다.");

        // 2. 'PageRequirements' 조인 테이블에서 'requirement_id' 조회
        const { data: pageReqData, error: pageReqError } = await supabase
          .from("PageRequirements")
          .select("requirement_id")
          .eq("page_id", pageData.id);

        if (pageReqError) throw pageReqError;

        const requirementIds = pageReqData.map((r) => r.requirement_id);

        // 3. 'Requirements' 테이블에서 기능 명세 조회
        let functionalSpec = { overview: "", requirements: [], acceptance: [] };
        if (requirementIds.length > 0) {
          const { data: reqData, error: reqError } = await supabase
            .from("Requirements")
            .select("overview, context")
            .in("id", requirementIds);

          if (reqError) throw reqError;

          if (reqData && reqData.length > 0) {
            functionalSpec = {
              overview: reqData[0].overview,
              requirements: reqData,
            };
          }
        }

        // 4. 최종 데이터 조합
        setScreenData({
          screenId: pageData.screen_id,
          screenName: pageData.description,
          figmaFileId: pageData.file,
          figmaNodeId: pageData.node,
          figmaUrl: `https://www.figma.com/file/${pageData.file}?node-id=${pageData.node}`,
          functionalSpec: functionalSpec,
          recommendedApis: mockApiData.recommendedApis, // 임시 데이터 사용
        });
      } catch (err) {
        console.error("Error fetching screen data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenData();
  }, [screenId]);

  const handleGenerateBaseCode = async () => {
    setIsGenerating(true);
    setGeneratedCode("");
    const { base64, mediaType } = await getFigmaImageBase64({
      fileId: screenData.figmaFileId,
      nodeId: screenData.figmaNodeId,
      figmaApiKey: FIGMA_TOKEN,
    });
    console.log(mediaType);
    try {
      const systemPrompt = `
        당신은 프론트엔드 개발을 위한 AI 코드 생성 도우미입니다.
        아래의 Figma 화면 정보와 기능 명세를 참고하여, 바로 붙여넣어 사용할 수 있는 React 컴포넌트 코드를 생성하세요.
        - 코드에는 반드시 JSX와 Tailwind CSS를 사용하세요.
        - 폼 검증, API 연동, 반응형 레이아웃 등 명세에 포함된 기능을 최대한 반영하세요.
        - 불필요한 설명이나 주석 없이, 코드만 반환하세요.
        
      `.trim();

      const userContentArray = [
        {
          type: "text",
          text: `
            첨부된 Figma 이미지를 참고하여 화면 디자인을 참고하세요.
            화면명: ${screenData.screenName}
            기능 명세:
            ${screenData.functionalSpec.requirements
              .map((req, i) => `- ${req.overview}: ${req.context}`)
              .join("\n")}
                  `.trim(),
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64,
          },
        },
      ];

      const code = await fetchClaudeBaseCode({
        systemPrompt,
        userContentArray,
      });
      setGeneratedCode(code);
    } catch (err) {
      setGeneratedCode("// 코드 생성 실패: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshFigma = () => {
    alert("Figma 디자인을 새로고침했습니다.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">화면 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">오류: {error}</p>
      </div>
    );
  }

  if (!screenData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          요청한 화면({screenId})을 찾을 수 없습니다.
        </p>
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
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Figma className="w-5 h-5" />
              <span>Figma 디자인</span>
            </CardTitle>
            <CardDescription>
              실시간으로 Figma 디자인 변경사항이 반영됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {screenData && (
              <FigmaImage
                fileId={screenData.figmaFileId}
                nodeId={screenData.figmaNodeId}
                setFigmaImageUrl={setFigmaImageUrl}
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
        <Card className="h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>베이스 코드 생성</span>
            </CardTitle>
            <CardDescription>
              AI가 Figma 디자인과 기능 명세를 바탕으로 베이스 코드를 생성합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {generatedCode ? (
              <div className="rounded-lg border bg-muted p-4 overflow-x-auto">
                <SyntaxHighlighter language="javascript" style={docco}>
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
            ) : (
              <>
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
              </>
            )}
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
                <ul className="space-y-4">
                  {screenData.functionalSpec.requirements.map((req) => (
                    <li key={req.id} className="space-y-1">
                      <h4 className="font-medium flex items-start space-x-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span>{req.overview}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground pl-5">
                        {req.context}
                      </p>
                    </li>
                  ))}
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
