/**
 * @file AuthContext
 * @description Authentication context and provider following Onion Architecture
 * @author MS8 Learning Analytics Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AuthService } from '../services/AuthService';

// Create the context
const AuthContext = createContext(null);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  ROLE_SWITCH_SUCCESS: 'ROLE_SWITCH_SUCCESS',
  ROLE_SWITCH_ERROR: 'ROLE_SWITCH_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      // Ensure user object has roles array and active role
      const user = action.payload.user || action.payload;
      if (user && !user.roles) {
        user.roles = [user.role].filter(Boolean);
      }
      if (user && !user.role && user.roles && user.roles.length > 0) {
        user.role = user.roles[0];
      }
      return {
        ...state,
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.ROLE_SWITCH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null
      };
    
    case AUTH_ACTIONS.ROLE_SWITCH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

/**
 * AuthProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {AuthService} props.authService - Optional auth service instance
 */
export const AuthProvider = ({ children, authService = null }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const service = authService || new AuthService();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        const isAuthenticated = await service.isAuthenticated();
        
        if (isAuthenticated) {
          const user = await service.getCurrentUser();
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: null });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []); // Remove service dependency to prevent infinite loop

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await service.login(email, password);
      
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: { user: response.user || response } 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: error.message 
      });
      // Don't re-throw error to prevent unhandled promise rejections in tests
      return null;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, [service]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      await service.logout();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      // Even if server logout fails, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.warn('Logout error:', error.message);
    }
  }, [service]);

  // Switch role function
  const switchRole = useCallback(async (role) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const updatedUser = await service.switchRole(role);
      
      dispatch({ 
        type: AUTH_ACTIONS.ROLE_SWITCH_SUCCESS, 
        payload: updatedUser 
      });
      
      return updatedUser;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.ROLE_SWITCH_ERROR, 
        payload: error.message 
      });
      // Don't re-throw error to prevent unhandled promise rejections in tests
      return null;
    }
  }, [service]);

  // Check if user has specific role
  const hasRole = useCallback(async (role) => {
    try {
      return await service.hasRole(role);
    } catch (error) {
      return false;
    }
  }, [service]);

  // Get user permissions
  const getPermissions = useCallback(async () => {
    try {
      return await service.getPermissions();
    } catch (error) {
      return [];
    }
  }, [service]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      return await service.refreshToken();
    } catch (error) {
      // If refresh fails, logout user
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      throw error;
    }
  }, [service]);

  // Validate token function
  const validateToken = useCallback(async () => {
    try {
      return await service.validateToken();
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [service]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      await service.changePassword(passwordData);
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [service]);

  // Reset password function
  const resetPassword = useCallback(async (resetData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      await service.resetPassword(resetData);
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [service]);

  // Clear auth data function
  const clearAuthData = useCallback(async () => {
    try {
      await service.clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [service]);

  // Check session validity function
  const checkSessionValidity = useCallback(async () => {
    try {
      return await service.checkSessionValidity();
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [service]);

  // Context value
  const contextValue = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    switchRole,
    hasRole,
    getPermissions,
    refreshToken,
    validateToken,
    changePassword,
    resetPassword,
    clearAuthData,
    checkSessionValidity
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
