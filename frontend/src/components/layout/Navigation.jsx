import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import '../../assets/css/navigation.css'

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
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              aria-label={link.label}
            >
              <span className="nav-icon" aria-hidden="true">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation

