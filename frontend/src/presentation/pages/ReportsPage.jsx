import React from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ReportGenerator from '../components/reports/ReportGenerator'
import '../assets/css/reports-page.css'

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="reports-page">
        <div className="page-header">
          <h1 className="page-title">Reports</h1>
          <p className="page-description">
            Generate and download analytics reports for your learning data
          </p>
        </div>

        <div className="page-content">
          <ReportGenerator />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReportsPage

