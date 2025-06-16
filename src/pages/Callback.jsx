import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-blue-50 to-indigo-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div id="authentication-callback"></div>
    </div>
  )
}

export default Callback