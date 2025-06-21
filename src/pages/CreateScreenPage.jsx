import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";

export function CreateScreenPage() {
  const [formData, setFormData] = useState({
    screen_id: "",
    name: "",
    description: "",
    file: "",
    node: "",
    status: "pending",
  });
  const [requirements, setRequirements] = useState([]);
  const [selectedReqs, setSelectedReqs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reqSearchTerm, setReqSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("Requirements").select("*");
        if (error) throw error;
        setRequirements(data);
      } catch (err) {
        setError("요구사항을 불러오는 데 실패했습니다: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectRequirement = (req) => {
    setSelectedReqs((prev) => new Set(prev).add(req.id));
    setReqSearchTerm("");
    setIsDropdownVisible(false);
  };

  const handleRemoveRequirement = (reqId) => {
    setSelectedReqs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reqId);
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: pageData, error: pageError } = await supabase
        .from("Pages")
        .insert([formData])
        .select("id")
        .single();

      if (pageError) throw pageError;
      const newPageId = pageData.id;

      if (selectedReqs.size > 0) {
        const pageRequirementsData = Array.from(selectedReqs).map((reqId) => ({
          page_id: newPageId,
          requirement_id: reqId,
        }));
        const { error: joinError } = await supabase
          .from("PageRequirements")
          .insert(pageRequirementsData);
        if (joinError) throw joinError;
      }

      alert("새 화면이 성공적으로 생성되었습니다.");
      navigate("/");
    } catch (err) {
      setError("화면 생성에 실패했습니다: " + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchResults = requirements.filter(
    (req) =>
      reqSearchTerm &&
      req.overview.toLowerCase().includes(reqSearchTerm.toLowerCase()) &&
      !selectedReqs.has(req.id)
  );

  const selectedReqsData = requirements.filter((req) =>
    selectedReqs.has(req.id)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>새 화면 생성</CardTitle>
          <CardDescription>
            새로운 화면 정보를 입력하고 관련된 요구사항을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="screen_id">화면 ID</Label>
                <Input
                  id="screen_id"
                  value={formData.screen_id}
                  onChange={handleInputChange}
                  placeholder="SCR-00X"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">화면명</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="예: 사용자 로그인 페이지"
                  required
                />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="화면에 대한 간단한 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Figma 파일 키</Label>
                <Input
                  id="file"
                  value={formData.file}
                  onChange={handleInputChange}
                  placeholder="Figma URL의 파일 키 부분"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="node">Figma 노드 ID</Label>
                <Input
                  id="node"
                  value={formData.node}
                  onChange={handleInputChange}
                  placeholder="Figma URL의 노드 ID 부분"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>요구사항 선택</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] rounded-md border border-input p-2">
                {selectedReqsData.map((req) => (
                  <Badge key={req.id} variant="secondary">
                    {req.overview}
                    <button
                      type="button"
                      className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => handleRemoveRequirement(req.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {req.overview}</span>
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="relative">
                <Input
                  type="search"
                  placeholder="요구사항 검색..."
                  value={reqSearchTerm}
                  onChange={(e) => setReqSearchTerm(e.target.value)}
                  onFocus={() => setIsDropdownVisible(true)}
                  onBlur={() =>
                    setTimeout(() => setIsDropdownVisible(false), 150)
                  }
                />
                {isDropdownVisible && reqSearchTerm && (
                  <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
                    <CardContent className="p-2">
                      {loading && <p className="p-2 text-sm">로딩 중...</p>}
                      {searchResults.length > 0 ? (
                        searchResults.map((req) => (
                          <div
                            key={req.id}
                            className="p-2 rounded-md hover:bg-accent cursor-pointer"
                            onMouseDown={() => handleSelectRequirement(req)}
                          >
                            <p className="text-sm font-medium">
                              {req.overview}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="p-2 text-sm text-muted-foreground">
                          검색 결과가 없습니다.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "화면 생성"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
