import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../application/state/AuthContext'
// CSS import removed - now using Tailwind CSS

const Navigation = () => {
  const { user } = useAuth()

  if (!user) return null

  const getNavigationLinks = () => {
    const baseLinks = [
      { path: '/analytics', label: 'Dashboard', icon: '📊' },
      { path: '/analytics', label: 'Analytics', icon: '📈' },
      { path: '/reports', label: 'Reports', icon: '📄' }
    ]

    // Role-specific links
    const roleLinks = {
      trainer: [
        { path: '/students', label: 'Students', icon: '👥' },
        { path: '/courses', label: 'Courses', icon: '📚' }
      ],
      org_admin: [
        { path: '/organization', label: 'Organization', icon: '🏢' },
        { path: '/users', label: 'Users', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
      ]
    }

    // Add role-specific links
    const userRoles = user.roles || [user.role]
    const additionalLinks = []
    
    userRoles.forEach(role => {
      if (roleLinks[role]) {
        additionalLinks.push(...roleLinks[role])
      }
    })

    // Remove duplicates
    const allLinks = [...baseLinks, ...additionalLinks]
    const uniqueLinks = allLinks.filter((link, index, self) =>
      index === self.findIndex((l) => l.path === link.path)
    )

    return uniqueLinks
  }

  const links = getNavigationLinks()

  return (
    <nav 
      className="flex-1 flex justify-center md:static fixed bottom-0 left-0 right-0 md:bg-transparent bg-background-card border-t border-background-tertiary md:border-t-0 md:shadow-none shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-[999] md:z-auto" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <ul className="flex list-none gap-4 md:gap-2 lg:gap-4 m-0 p-0 w-full justify-around md:justify-center md:w-auto md:px-2">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-2 md:gap-1 px-3 py-2 md:px-2 md:py-1 text-text-secondary md:text-text-secondary no-underline font-medium rounded-lg transition-all duration-300 relative 
                ${isActive 
                  ? 'text-primary-cyan bg-[rgba(15,118,110,0.15)] font-semibold' 
                  : 'hover:text-text-primary hover:bg-[rgba(15,118,110,0.1)] hover:-translate-y-0.5'
                }`
              }
              aria-label={link.label}
            >
              {({ isActive }) => (
                <>
                  <span className="text-xl md:text-[1.3rem] lg:text-[1.1rem]" aria-hidden="true">{link.icon}</span>
                  <span className="text-sm md:hidden lg:block text-[0.7rem] md:text-sm">{link.label}</span>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-2 md:-bottom-2 left-1/2 -translate-x-1/2 w-[40%] h-1 bg-gradient-to-r from-primary-blue to-primary-purple rounded-sm" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation

