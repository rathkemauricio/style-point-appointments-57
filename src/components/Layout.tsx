import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import {
    LayoutDashboard,
    Users,
    Scissors,
    Calendar,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';

export const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'professional'],
        },
        {
            title: 'Agendamentos',
            href: '/agendamentos',
            icon: Calendar,
            roles: ['admin', 'professional', 'customer'],
        },
        {
            title: 'Clientes',
            href: '/clientes',
            icon: Users,
            roles: ['admin', 'professional'],
        },
        {
            title: 'Serviços',
            href: '/servicos',
            icon: Scissors,
            roles: ['admin', 'professional'],
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        if (!item.roles.includes(user?.role || '')) {
            return null;
        }

        return (
            <Link
                to={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
                    isActive && 'bg-gray-100 text-gray-900'
                )}
                onClick={() => setIsOpen(false)}
            >
                <Icon className="h-4 w-4" />
                {item.title}
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar para desktop */}
            <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white">
                <div className="flex h-14 items-center border-b px-4 font-semibold">
                    Style Point
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                        {menuItems.map((item, index) => (
                            <MenuItem key={index} item={item} />
                        ))}
                    </nav>
                </div>
                <div className="border-t p-4">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">
                                {user?.name}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Header para mobile */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b bg-white px-4">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex h-14 items-center border-b px-4 font-semibold">
                            Style Point
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto py-2">
                            <nav className="grid gap-1 px-2">
                                {menuItems.map((item, index) => (
                                    <MenuItem key={index} item={item} />
                                ))}
                            </nav>
                        </div>
                        <div className="border-t p-4">
                            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="truncate text-sm text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-semibold">Style Point</div>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 lg:ml-64">
                <div className="h-14 lg:h-0" />
                <Outlet />
            </main>
        </div>
    );
}; 