import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Monitor, CheckCircle } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '메인 페이지', icon: Home },
    { path: '/screen-assistant', label: '화면 개발 도우미', icon: Monitor },
    { path: '/review', label: '리뷰 (검증)', icon: CheckCircle },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              AGIS
            </Link>
            <span className="text-sm text-muted-foreground">
              AI-Powered Frontend Development Platform
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? 'default' : 'ghost'}
                asChild
                className="flex items-center space-x-2"
              >
                <Link to={path}>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

