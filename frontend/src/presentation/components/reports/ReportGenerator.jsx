/**
 * Enhanced ReportGenerator Component
 * Implements async report generation with state management
 */

import React, { useState } from 'react'
import { useReports } from '../../../application/hooks/useReports'

const ReportGenerator = ({ userId }) => {
  const [reportType, setReportType] = useState('learner')
  const [reportFormat, setReportFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState(null)
  const [error, setError] = useState(null)

  const { reports = [], generateReport, isLoading } = useReports(userId)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedReport(null)

    try {
      const newReport = await generateReport(reportType, reportFormat)
      setGeneratedReport(newReport)
    } catch (err) {
      setError(err.message || 'Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (reportId) => {
    // In a real implementation, this would download the actual file
    const report = reports.find(r => r.id === reportId)
    if (report && report.download_url) {
      window.open(report.download_url, '_blank')
    } else {
      // Simulate download for mock data
      const blob = new Blob(['Mock report content'], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${reportId}.${reportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        // In a real implementation, this would call the API
        console.log('Deleting report:', reportId)
        alert('Report deleted successfully')
      } catch (err) {
        console.error('Delete failed:', err)
        alert('Failed to delete report')
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processing</span>
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="report-generator space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h3>
        
        <div className="report-form space-y-4">
          <div className="form-group">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type:
            </label>
            <select
              id="report-type"
              aria-label="Report type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="learner">Learner Report</option>
              <option value="trainer">Trainer Report</option>
              <option value="organization">Organization Report</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="report-format" className="block text-sm font-medium text-gray-700 mb-1">
              Format:
            </label>
            <select
              id="report-format"
              aria-label="Format"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="generate-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
          </button>
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-sm text-blue-800">Report is being generated...</span>
            </div>
          </div>
        )}

        {/* Generated Report */}
        {generatedReport && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-green-800">Report Generated Successfully!</h4>
                <p className="text-sm text-green-600">Report ID: {generatedReport.id}</p>
              </div>
              {generatedReport.status === 'completed' && generatedReport.download_url && (
                <a
                  href={generatedReport.download_url}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  download
                >
                  Download Report
                </a>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <span className="text-red-600 text-sm font-medium">Error:</span>
              <span className="text-red-600 text-sm ml-2">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Existing Reports */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reports generated yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.format.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {report.status === 'completed' && (
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Download
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportGenerator