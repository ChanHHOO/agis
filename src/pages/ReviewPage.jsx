import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RefreshCw,
  Bug,
  TestTube,
  BarChart3
} from 'lucide-react'

// 더미 테스트 데이터
const mockTestData = {
  'SCR-001': {
    screenId: 'SCR-001',
    screenName: '사용자 로그인 페이지',
    lastTestRun: '2024-01-15 16:45:00',
    summary: {
      total: 12,
      passed: 9,
      failed: 2,
      skipped: 1,
      successRate: 75
    },
    testCases: [
      {
        id: 'TC-001',
        name: '유효한 자격증명으로 로그인',
        status: 'passed',
        duration: '1.2s',
        category: 'Authentication'
      },
      {
        id: 'TC-002',
        name: '잘못된 비밀번호로 로그인 시도',
        status: 'passed',
        duration: '0.8s',
        category: 'Authentication'
      },
      {
        id: 'TC-003',
        name: '빈 이메일 필드 검증',
        status: 'failed',
        duration: '0.5s',
        category: 'Validation',
        error: 'Expected error message not displayed'
      },
      {
        id: 'TC-004',
        name: '비밀번호 찾기 링크 동작',
        status: 'passed',
        duration: '1.0s',
        category: 'Navigation'
      },
      {
        id: 'TC-005',
        name: '소셜 로그인 버튼 표시',
        status: 'passed',
        duration: '0.3s',
        category: 'UI'
      },
      {
        id: 'TC-006',
        name: '반응형 디자인 테스트',
        status: 'failed',
        duration: '2.1s',
        category: 'Responsive',
        error: 'Mobile layout broken on 375px width'
      },
      {
        id: 'TC-007',
        name: '접근성 테스트',
        status: 'passed',
        duration: '1.5s',
        category: 'Accessibility'
      },
      {
        id: 'TC-008',
        name: '로그인 상태 유지 기능',
        status: 'passed',
        duration: '0.9s',
        category: 'Functionality'
      },
      {
        id: 'TC-009',
        name: '비밀번호 표시/숨김 토글',
        status: 'passed',
        duration: '0.4s',
        category: 'UI'
      },
      {
        id: 'TC-010',
        name: '로딩 상태 표시',
        status: 'passed',
        duration: '1.1s',
        category: 'UI'
      },
      {
        id: 'TC-011',
        name: '에러 메시지 스타일링',
        status: 'passed',
        duration: '0.6s',
        category: 'UI'
      },
      {
        id: 'TC-012',
        name: '키보드 네비게이션',
        status: 'skipped',
        duration: '0s',
        category: 'Accessibility'
      }
    ],
    errorLogs: [
      {
        testId: 'TC-003',
        timestamp: '2024-01-15 16:45:12',
        level: 'ERROR',
        message: 'Expected error message not displayed',
        details: `
AssertionError: Expected element with text "이메일을 입력해주세요" to be visible
    at Object.toBeVisible (/tests/login.test.js:45:23)
    at /tests/login.test.js:44:5
    at processTicksAndRejections (node:internal/process/task_queues:96:5)

Stack trace:
- Element selector: [data-testid="email-error"]
- Expected: visible
- Received: hidden
        `
      },
      {
        testId: 'TC-006',
        timestamp: '2024-01-15 16:45:18',
        level: 'ERROR',
        message: 'Mobile layout broken on 375px width',
        details: `
Layout Error: Elements overlapping in mobile view
    at checkResponsiveLayout (/tests/responsive.test.js:28:15)
    at /tests/responsive.test.js:25:3

Issues found:
- Login button extends beyond viewport width
- Social login buttons not properly stacked
- Footer overlaps with form content
- Viewport width: 375px
- Detected overlapping elements: 3
        `
      }
    ]
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'passed':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-600" />
    case 'skipped':
      return <AlertCircle className="w-4 h-4 text-yellow-600" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />
  }
}

const getStatusBadge = (status) => {
  const config = {
    passed: { label: '통과', className: 'bg-green-100 text-green-800' },
    failed: { label: '실패', className: 'bg-red-100 text-red-800' },
    skipped: { label: '건너뜀', className: 'bg-yellow-100 text-yellow-800' }
  }
  
  const statusConfig = config[status] || config.skipped
  return (
    <Badge variant="outline" className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  )
}

export function ReviewPage() {
  const { screenId } = useParams()
  const [testData, setTestData] = useState(null)
  const [isRunningTests, setIsRunningTests] = useState(false)

  useEffect(() => {
    if (screenId && mockTestData[screenId]) {
      setTestData(mockTestData[screenId])
    }
  }, [screenId])

  const handleRunTests = async () => {
    setIsRunningTests(true)
    // 실제로는 테스트 실행 API를 호출
    setTimeout(() => {
      setIsRunningTests(false)
      alert('테스트가 완료되었습니다!')
    }, 5000)
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">테스트 데이터를 불러오는 중...</p>
      </div>
    )
  }

  const { summary } = testData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">리뷰 (검증)</h1>
          <p className="text-muted-foreground">
            {testData.screenName} ({testData.screenId})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRunTests} disabled={isRunningTests}>
            {isRunningTests ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                테스트 실행 중...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                테스트 실행
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 테스트 결과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 테스트</CardTitle>
            <TestTube className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">총 테스트 케이스</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">통과</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
            <p className="text-xs text-muted-foreground">성공한 테스트</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실패</CardTitle>
            <XCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
            <p className="text-xs text-muted-foreground">실패한 테스트</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">성공률</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.successRate}%</div>
            <Progress value={summary.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 탭 */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="testcases" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="testcases">테스트 케이스</TabsTrigger>
              <TabsTrigger value="errors" className="flex items-center space-x-2">
                <Bug className="w-4 h-4" />
                <span>에러 로그</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="testcases" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">테스트 케이스 목록</h3>
                  <p className="text-sm text-muted-foreground">
                    마지막 실행: {testData.lastTestRun}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {testData.testCases.map((testCase) => (
                    <Card key={testCase.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(testCase.status)}
                            <div>
                              <h4 className="font-medium">{testCase.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {testCase.id} • {testCase.category} • {testCase.duration}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(testCase.status)}
                        </div>
                        {testCase.error && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            {testCase.error}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="errors" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">실패한 테스트 에러 로그</h3>
                
                {testData.errorLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
                    <p className="text-muted-foreground">에러가 없습니다!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testData.errorLogs.map((log, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center space-x-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>{log.testId}</span>
                            </CardTitle>
                            <Badge variant="destructive">{log.level}</Badge>
                          </div>
                          <CardDescription>{log.timestamp}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-800">{log.message}</h4>
                            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                              {log.details}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

