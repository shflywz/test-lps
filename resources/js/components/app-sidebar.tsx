import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import AppLogo from './app-logo';

function DropdownNav({ items, level = 0 }: { items: any[]; level?: number }) {
    const [openIds, setOpenIds] = useState<number[]>([]);
    const { url: currentUrl } = usePage();

    const toggle = (id: number) => {
        setOpenIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const indent = 10 * level;

    return (
        <>
            {items.map(item => {
                const children = item.submenus ?? item.children ?? [];
                const hasChildren = item.expandable && children.length > 0;
                const isOpen = openIds.includes(item.id);
                const IconComponent = item.icon ? (Icons as any)[item.icon] : null;

                const href = item.route ? `/${item.route}` : item.url || '#';
                const isActive = currentUrl === href;

                if (hasChildren) {
                    return (
                        <div key={`${item.id}-${item.name}`} className="mb-1">
                            <div
                                onClick={() => toggle(item.id)}
                                className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded transition-colors ${
                                    isActive ? 'bg-gray-400 font-semibold' : 'hover:bg-gray-400'
                                }`}
                                style={{ paddingLeft: indent }}
                            >
                                <span className="flex items-center px-2">
                                    {IconComponent && (
                                        <IconComponent className="w-5 h-5 mr-2 inline-block" />
                                    )}
                                    {item.name}
                                </span>

                                <span
                                    className={`transform transition-transform duration-200 ${
                                        isOpen ? 'rotate-90' : 'rotate-0'
                                    }`}
                                >
                                    ▸
                                </span>
                            </div>

                            {isOpen && (
                                <div className="ml-4 transition-all duration-200">
                                    <DropdownNav items={children} level={level + 1} />
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <SidebarMenuItem key={`${item.id}-${item.name}`}>
                        <Link
                            href={href}
                            className={`flex items-center w-full px-2 py-2 rounded transition-colors ${
                                isActive ? 'bg-gray-400 font-semibold' : 'hover:bg-gray-400'
                            }`}
                            style={{ paddingLeft: `${indent + 8}px` }}
                            title={item.name}
                        >

                            {IconComponent && (
                                <IconComponent className="w-5 h-5 mr-2 inline-block" />
                            )}
                            {item.name}
                        </Link>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
}

// ====== SIDEBAR COMPONENT FINAL DENGAN HEADER MENU ======
export function AppSidebar() {
    const { mainNavItems } = usePage().props as { mainNavItems: any[] };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/" className="flex items-center px-4 py-2">
                            <AppLogo />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {/* ===== HEADER MENU PERTAMA ===== */}
                    <div className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase">
                        Daftar Menu
                    </div>

                    {/* ===== LIST MENU ===== */}
                    <DropdownNav items={mainNavItems} />
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
