import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Eye, Settings } from 'lucide-react'

// 더미 데이터
const mockScreens = [
  {
    screenId: 'SCR-001',
    requirementId: 'REQ-001',
    screenName: '사용자 로그인 페이지',
    progressStatus: 'completed',
    description: '사용자 인증을 위한 로그인 화면'
  },
  {
    screenId: 'SCR-002',
    requirementId: 'REQ-002',
    screenName: '대시보드 메인 화면',
    progressStatus: 'in-progress',
    description: '사용자 대시보드 및 주요 지표 표시'
  },
  {
    screenId: 'SCR-003',
    requirementId: 'REQ-003',
    screenName: '프로젝트 목록 페이지',
    progressStatus: 'pending',
    description: '프로젝트 목록 조회 및 관리'
  },
  {
    screenId: 'SCR-004',
    requirementId: 'REQ-004',
    screenName: '사용자 프로필 설정',
    progressStatus: 'in-progress',
    description: '사용자 개인정보 및 설정 관리'
  },
  {
    screenId: 'SCR-005',
    requirementId: 'REQ-005',
    screenName: '알림 센터',
    progressStatus: 'pending',
    description: '시스템 알림 및 메시지 관리'
  }
]

const getStatusBadge = (status) => {
  const statusConfig = {
    completed: { label: '완료', variant: 'default', className: 'bg-green-100 text-green-800' },
    'in-progress': { label: '진행중', variant: 'secondary', className: 'bg-blue-100 text-blue-800' },
    pending: { label: '대기', variant: 'outline', className: 'bg-gray-100 text-gray-800' }
  }
  
  const config = statusConfig[status] || statusConfig.pending
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

export function MainPage() {
  const [screens] = useState(mockScreens)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">화면 개발 관리</h1>
          <p className="text-muted-foreground">
            프론트엔드 개발이 필요한 화면 목록을 관리하고 진행상황을 확인하세요.
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>새 화면 추가</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>화면 목록</CardTitle>
          <CardDescription>
            개발이 필요한 화면들의 진행상황을 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>화면 ID</TableHead>
                <TableHead>요구사항 ID</TableHead>
                <TableHead>화면명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>진행상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screens.map((screen) => (
                <TableRow key={screen.screenId}>
                  <TableCell className="font-medium">{screen.screenId}</TableCell>
                  <TableCell>{screen.requirementId}</TableCell>
                  <TableCell className="font-medium">{screen.screenName}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {screen.description}
                  </TableCell>
                  <TableCell>{getStatusBadge(screen.progressStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="flex items-center space-x-1"
                      >
                        <Link to={`/screen-assistant/${screen.screenId}`}>
                          <Settings className="w-4 h-4" />
                          <span>개발</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="flex items-center space-x-1"
                      >
                        <Link to={`/review/${screen.screenId}`}>
                          <Eye className="w-4 h-4" />
                          <span>리뷰</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 화면</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screens.length}</div>
            <p className="text-xs text-muted-foreground">개발 대상 화면 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {screens.filter(s => s.progressStatus === 'in-progress').length}
            </div>
            <p className="text-xs text-muted-foreground">현재 개발중인 화면</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {screens.filter(s => s.progressStatus === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">개발 완료된 화면</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

