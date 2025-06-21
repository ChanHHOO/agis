import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 import

const getStatusBadge = (status) => {
  const statusConfig = {
    completed: {
      label: "완료",
      variant: "default",
      className: "bg-green-600 hover:bg-green-700",
    },
    "in-progress": {
      label: "진행중",
      variant: "secondary",
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    pending: {
      label: "대기",
      variant: "outline",
      className: "text-muted-foreground",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export function MainPage() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Pages")
          .select("id, screen_id, description, status, name");

        if (error) {
          throw error;
        }

        setScreens(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching screens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const filteredScreens = screens.filter(
    (screen) =>
      screen.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.screen_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">화면 개발 관리</h1>
          <p className="text-muted-foreground">
            프론트엔드 개발이 필요한 화면 목록을 관리하고 진행상황을 확인하세요.
          </p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />새 화면 생성
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="화면 ID 또는 이름으로 검색..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>화면 목록</CardTitle>
          <CardDescription>
            개발이 필요한 화면들의 진행상황을 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center">로딩 중...</p>
          ) : error ? (
            <p className="text-destructive text-center">오류: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>화면 ID</TableHead>
                  <TableHead>화면명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>진행상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScreens.length > 0 ? (
                  filteredScreens.map((screen) => (
                    <TableRow key={screen.id}>
                      <TableCell className="font-medium">
                        {screen.screen_id}
                      </TableCell>
                      <TableCell>{screen.name}</TableCell>
                      <TableCell>{screen.description}</TableCell>
                      <TableCell>{getStatusBadge(screen.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/screen-assistant/${screen.screen_id}`}
                            className="flex items-center space-x-1"
                          >
                            <Settings className="w-4 h-4" />
                            <span>개발 도우미</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
