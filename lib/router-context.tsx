
import React, { createContext, useContext, useState, useEffect } from 'react';

type RouterContextType = {
  pathname: string;
  push: (path: string) => void;
  replace: (path: string) => void;
};

const RouterContext = createContext<RouterContextType | null>(null);

export const RouterProvider = ({ children }: { children?: React.ReactNode }) => {
  const [pathname, setPathname] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = (path: string) => {
    console.log(`Navigating to: ${path}`);
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('Navigation warning: History API restricted. Using in-memory navigation.', e);
    }
    setPathname(path);
  };

  const replace = (path: string) => {
    console.log(`Replacing path with: ${path}`);
    try {
      window.history.replaceState({}, '', path);
    } catch (e) {
      console.warn('Navigation warning: History API restricted. Using in-memory navigation.', e);
    }
    setPathname(path);
  };

  return (
    <RouterContext.Provider value={{ pathname, push, replace }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const usePathname = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('usePathname must be used within a RouterProvider');
  }
  return context.pathname;
};

export const Link = ({ 
  href, 
  children, 
  className, 
  onClick 
}: { 
  href: string; 
  children?: React.ReactNode; 
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
