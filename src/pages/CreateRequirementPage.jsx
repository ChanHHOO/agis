import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function CreateRequirementPage() {
  const [form, setForm] = useState({
    overview: "",
    context: "",
    requirement_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error } = await supabase.from("Requirements").insert([form]);
      if (error) throw error;
      alert("요구사항이 성공적으로 생성되었습니다.");
      navigate("/"); // 메인으로 이동
    } catch (err) {
      setError("요구사항 생성 실패: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>요구사항 생성</CardTitle>
          <CardDescription>새로운 요구사항을 등록하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="requirement_id">요구사항 ID (회사 관리용)</Label>
              <Input
                id="requirement_id"
                value={form.requirement_id}
                onChange={handleChange}
                required
                placeholder="예: REQ-001"
              />
            </div>
            <div>
              <Label htmlFor="overview">요구사항 개요</Label>
              <Input
                id="overview"
                value={form.overview}
                onChange={handleChange}
                required
                placeholder="요구사항의 간단한 설명"
              />
            </div>
            <div>
              <Label htmlFor="context">요구사항 내용</Label>
              <Textarea
                id="context"
                value={form.context}
                onChange={handleChange}
                required
                placeholder="요구사항의 상세 내용"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "요구사항 생성"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
