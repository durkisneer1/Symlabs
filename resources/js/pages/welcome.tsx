import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function Welcome() {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="Home" />
            <div className="flex flex-col bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">

                <header className="w-full">
                    <NavigationMenu className="flex w-full max-w-none items-center justify-between">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink href='/'>Home</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Lessons</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>HTML</NavigationMenuLink>
                                    <NavigationMenuLink>CSS</NavigationMenuLink>
                                    <NavigationMenuLink>PHP</NavigationMenuLink>
                                    <NavigationMenuLink>MySQL</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                        <NavigationMenuList>
                            {auth.user ? (
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={dashboardUrl}>
                                            Dashboard
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ) : (
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={login()}>Log in</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </header>

                <main>

                </main>

                <footer>

                </footer>
            </div>
        </>
    );
}
