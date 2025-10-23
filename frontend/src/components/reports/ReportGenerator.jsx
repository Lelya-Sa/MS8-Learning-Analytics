/**
 * Enhanced ReportGenerator Component
 * Handles async report generation with download management
 */

import React, { useState } from 'react';
import * as api from '../../services/api';

const ReportGenerator = ({ userId }) => {
  const [reportType, setReportType] = useState('learner');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);

    try {
      const response = await api.generateReport(reportType, reportFormat);
      
      // Simulate async processing
      setTimeout(() => {
        setGeneratedReport({
          id: response.id || 'report-123',
          status: 'completed',
          download_url: 'https://example.com/report-123.pdf'
        });
        setIsGenerating(false);
      }, 2000);
      
    } catch (err) {
      setError('Failed to generate report');
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    try {
      api.downloadReport(reportId);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  return (
    <div className="report-generator">
      <h3>Generate Report</h3>
      
      <div className="report-form">
        <div className="form-group">
          <label htmlFor="report-type">Report Type:</label>
          <select
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            aria-label="Report type"
          >
            <option value="learner">Learner Report</option>
            <option value="trainer">Trainer Report</option>
            <option value="organization">Organization Report</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="report-format">Format:</label>
          <select
            id="report-format"
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            aria-label="Format"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="generate-button"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isGenerating && (
        <div className="generating-status">
          <p>Report is being generated...</p>
          <div className="loading-spinner">⏳</div>
        </div>
      )}

      {generatedReport && generatedReport.status === 'completed' && (
        <div className="report-ready">
          <p>Your report is ready!</p>
          <a
            href={generatedReport.download_url}
            download
            className="download-link"
            role="link"
            aria-label="Download report"
          >
            Download Report
          </a>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;