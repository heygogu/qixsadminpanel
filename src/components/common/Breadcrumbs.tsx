// components/Breadcrumb.js
'use client'; // For client components in Next.js 13

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const isMainMenu = segments[0] === 'dashboard' || segments[0] === 'workspaces' || segments[0] === 'vendors' || segments[0] === 'accounting';
    const isSupportMenu = segments[0] === 'ticket-management';
    let firstBreadcrumb = "";
    if (isMainMenu) {
        firstBreadcrumb = "Main Menu";
    }
    else if (isSupportMenu) {
        firstBreadcrumb = "Support";
    }
    else {
        firstBreadcrumb = "";
    }
    return (
        <Breadcrumb className="my-4 text-sm">
            {firstBreadcrumb && <BreadcrumbItem>
                <BreadcrumbLink >{firstBreadcrumb}</BreadcrumbLink>
                <span className="mx-2">/</span> {/* Separator */}
            </BreadcrumbItem>}
            {segments.map((segment, index) => {
                if (segment.length > 23) return null;

                const href = `/${segments.slice(0, index + 1).join('/')}`;
                const label = segment.replace(/\[|\]/g, ''); // Remove square brackets from dynamic routes

                return (
                    <BreadcrumbItem key={index}>
                        {index === segments.length - 1 ? (
                            <span className='capitalize font-semibold'>{label}</span>
                        ) : (
                            <>
                                <BreadcrumbLink className='capitalize'>{label}</BreadcrumbLink>
                                <span className={"mx-2"}>/</span> {/* Separator */}
                            </>
                        )}
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
}