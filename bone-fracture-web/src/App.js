import React, { useState, useRef } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LoginPage from './LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      type: 'Elbow Fracture',
      date: '2 hours ago',
      status: 'severe',
      confidence: 94.5
    },
    {
      id: 2,
      type: 'Hand X-Ray',
      date: '1 day ago',
      status: 'normal',
      confidence: 98.2
    }
  ]);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏥' },
    { id: 'analysis', label: 'Analysis', icon: '🔬' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setNotifications([
      { id: 1, message: 'Welcome to FractureAI!', type: 'success', time: new Date() },
      { id: 2, message: 'New analysis features available', type: 'info', time: new Date() }
    ]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAnalysisResult(null);
    setUploadedImage(null);
    setSelectedTab('overview');
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      time: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addNotification('Please upload a valid image file', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        addNotification('File size too large. Please upload an image smaller than 10MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setAnalysisResult(null);
        addNotification('Image uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = { target: { files: [file] } };
      handleImageUpload(event);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) {
      addNotification('Please upload an image first', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    addNotification('Starting AI analysis...', 'info');
    
    // Simulate AI analysis with progress updates
    const progressSteps = [
      { message: 'Preprocessing image...', delay: 500 },
      { message: 'Running bone detection...', delay: 800 },
      { message: 'Analyzing fracture patterns...', delay: 1000 },
      { message: 'Generating recommendations...', delay: 700 }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      addNotification(step.message, 'info');
    }
    
    // Generate random but realistic results
    const boneTypes = ['Elbow', 'Hand', 'Shoulder', 'Wrist', 'Ankle'];
    const severities = ['Mild', 'Moderate', 'Severe'];
    const locations = ['Proximal radius', 'Distal radius', 'Metacarpal', 'Humerus', 'Tibia'];
    
    const mockResult = {
      boneType: boneTypes[Math.floor(Math.random() * boneTypes.length)],
      fractureDetected: Math.random() > 0.3, // 70% chance of fracture
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      severity: severities[Math.floor(Math.random() * severities.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      recommendations: [
        'Immediate orthopedic consultation recommended',
        'X-ray follow-up in 2 weeks',
        'Immobilization with cast or splint',
        'Pain management with prescribed medication'
      ],
      riskFactors: [
        'Age-related bone density',
        'Previous fracture history',
        'Activity level'
      ],
      treatmentPlan: {
        phase1: 'Immobilization (4-6 weeks)',
        phase2: 'Physical therapy (6-8 weeks)',
        phase3: 'Gradual return to activity'
      },
      timeline: {
        healing: '6-8 weeks',
        fullRecovery: '3-4 months'
      }
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
    
    // Add to recent analyses
    const newAnalysis = {
      id: Date.now(),
      type: `${mockResult.boneType} ${mockResult.fractureDetected ? 'Fracture' : 'X-Ray'}`,
      date: 'Just now',
      status: mockResult.fractureDetected ? 'severe' : 'normal',
      confidence: mockResult.confidence
    };
    setRecentAnalyses(prev => [newAnalysis, ...prev.slice(0, 4)]);
    
    addNotification('Analysis complete!', 'success');
  };

  const downloadReport = async () => {
    if (!analysisResult) {
      addNotification('No analysis results to download', 'error');
      return;
    }
    
    try {
      // Create a comprehensive PDF report
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text('FractureAI Medical Report', 20, 30);
      
      // Add patient info
      pdf.setFontSize(12);
      pdf.text(`Patient: ${user?.name || 'Unknown'}`, 20, 50);
      pdf.text(`User Type: ${user?.userType || 'Unknown'}`, 20, 60);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
      pdf.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 80);
      
      // Add analysis results
      pdf.setFontSize(16);
      pdf.text('Analysis Results', 20, 100);
      
      pdf.setFontSize(12);
      let yPosition = 120;
      
      // Fracture detection
      pdf.text(`Fracture Detected: ${analysisResult.fractureDetected ? 'YES' : 'NO'}`, 20, yPosition);
      yPosition += 10;
      
      // Bone type
      pdf.text(`Bone Type: ${analysisResult.boneType}`, 20, yPosition);
      yPosition += 10;
      
      // Confidence
      pdf.text(`Confidence: ${analysisResult.confidence}%`, 20, yPosition);
      yPosition += 10;
      
      // Severity
      pdf.text(`Severity: ${analysisResult.severity}`, 20, yPosition);
      yPosition += 10;
      
      // Location
      pdf.text(`Location: ${analysisResult.location}`, 20, yPosition);
      yPosition += 15;
      
      // Detailed Analysis
      pdf.setFontSize(14);
      pdf.text('Detailed Analysis', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.text(`Healing Time: ${analysisResult.timeline.healing}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Full Recovery: ${analysisResult.timeline.fullRecovery}`, 20, yPosition);
      yPosition += 15;
      
      // Medical Recommendations
      pdf.setFontSize(14);
      pdf.text('Medical Recommendations', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      analysisResult.recommendations.forEach((rec, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${index + 1}. ${rec}`, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Treatment Plan
      pdf.setFontSize(14);
      pdf.text('Treatment Plan', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.text(`Phase 1: ${analysisResult.treatmentPlan.phase1}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Phase 2: ${analysisResult.treatmentPlan.phase2}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Phase 3: ${analysisResult.treatmentPlan.phase3}`, 20, yPosition);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by FractureAI - Advanced Medical AI Platform', 20, 280);
      
      // Save the PDF
      const fileName = `fracture-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      addNotification('Report downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      addNotification('Error generating report. Please try again.', 'error');
    }
  };

  const downloadHistoryReport = (analysis) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text('FractureAI Historical Report', 20, 30);
      
      // Add patient info
      pdf.setFontSize(12);
      pdf.text(`Patient: ${user?.name || 'Unknown'}`, 20, 50);
      pdf.text(`User Type: ${user?.userType || 'Unknown'}`, 20, 60);
      pdf.text(`Analysis Date: ${analysis.date}`, 20, 70);
      pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 80);
      
      // Add analysis results
      pdf.setFontSize(16);
      pdf.text('Historical Analysis Results', 20, 100);
      
      pdf.setFontSize(12);
      let yPosition = 120;
      
      // Analysis type
      pdf.text(`Analysis Type: ${analysis.type}`, 20, yPosition);
      yPosition += 10;
      
      // Confidence
      pdf.text(`Confidence: ${analysis.confidence}%`, 20, yPosition);
      yPosition += 10;
      
      // Status
      pdf.text(`Status: ${analysis.status === 'severe' ? 'Fracture Detected' : 'Normal'}`, 20, yPosition);
      yPosition += 15;
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by FractureAI - Advanced Medical AI Platform', 20, 280);
      
      // Save the PDF
      const fileName = `fracture-history-${analysis.id}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      addNotification('Historical report downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating historical PDF:', error);
      addNotification('Error generating historical report. Please try again.', 'error');
    }
  };

  const getDateRange = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* Background */}
      <div className="background">
        <div className="background-blur"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard">
        {/* Header */}
        <header className="dashboard-header">
          <div className="logo">
            <div className="logo-icon">🦴</div>
            <span className="logo-text">FractureAI</span>
          </div>
          
          <nav className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${selectedTab === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="header-actions">
            <button className="action-btn" onClick={() => addNotification('Notifications feature coming soon!', 'info')}>
              🔔
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            <button className="action-btn" onClick={() => setSelectedTab('settings')}>⚙️</button>
            <div className="user-info">
              <div className="user-avatar">
                {user?.userType === 'doctor' ? '👨‍⚕️' : user?.userType === 'radiologist' ? '🔬' : '👤'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-type">{user?.userType}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                🚪
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content">
          {selectedTab === 'overview' && (
            <div className="content-grid">
              {/* Left Panel */}
              <div className="left-panel">
                {/* Upload Section */}
                <div className="glass-card upload-section">
                  <h3>Upload X-Ray Image</h3>
                  <div 
                    className="upload-area" 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {uploadedImage ? (
                      <div className="uploaded-image-container">
                        <img src={uploadedImage} alt="Uploaded X-ray" className="uploaded-image" />
                        <button 
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                            setAnalysisResult(null);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📁</div>
                        <p>Click to upload or drag & drop X-ray image</p>
                        <small>Supports: JPG, PNG, DICOM (Max 10MB)</small>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="analyze-btn"
                    onClick={analyzeImage}
                    disabled={!uploadedImage || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <div className="loading-content">
                        <div className="spinner"></div>
                        Analyzing...
                      </div>
                    ) : (
                      '🔬 Analyze Fracture'
                    )}
                  </button>
                </div>

                {/* Recent Analysis */}
                <div className="glass-card recent-section">
                  <h3>Recent Analysis</h3>
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="analysis-item">
                      <div className="analysis-icon">🦴</div>
                      <div className="analysis-details">
                        <span className="analysis-type">{analysis.type}</span>
                        <span className="analysis-date">{analysis.date}</span>
                        <span className="analysis-confidence">Confidence: {analysis.confidence}%</span>
                      </div>
                      <div className={`analysis-status ${analysis.status}`}>
                        {analysis.status === 'severe' ? 'Fracture' : 'Normal'}
                      </div>
                    </div>
                  ))}
                  {recentAnalyses.length === 0 && (
                    <div className="no-analyses">
                      <p>No recent analyses</p>
                      <small>Upload an image to get started</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="right-panel">
                {/* Analysis Results */}
                {analysisResult && (
                  <div className="glass-card analysis-results" id="analysis-report">
                    <div className="results-header">
                      <h3>Fracture Analysis Results</h3>
                      <button className="download-btn" onClick={downloadReport}>
                        📥 Download Report
                      </button>
                    </div>
                    
                    <div className="results-grid">
                      <div className="result-card critical">
                        <div className="result-icon">⚠️</div>
                        <div className="result-content">
                          <span className="result-label">Fracture Detected</span>
                          <span className="result-value">{analysisResult.fractureDetected ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      
                      <div className="result-card">
                        <div className="result-icon">🎯</div>
                        <div className="result-content">
                          <span className="result-label">Confidence</span>
                          <span className="result-value">{analysisResult.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="result-card">
                        <div className="result-icon">🦴</div>
                        <div className="result-content">
                          <span className="result-label">Bone Type</span>
                          <span className="result-value">{analysisResult.boneType}</span>
                        </div>
                      </div>
                      
                      <div className="result-card">
                        <div className="result-icon">📊</div>
                        <div className="result-content">
                          <span className="result-label">Severity</span>
                          <span className="result-value">{analysisResult.severity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="detailed-analysis">
                      <h4>Detailed Analysis</h4>
                      <div className="analysis-details">
                        <div className="detail-item">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{analysisResult.location}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Healing Time:</span>
                          <span className="detail-value">{analysisResult.timeline.healing}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Full Recovery:</span>
                          <span className="detail-value">{analysisResult.timeline.fullRecovery}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="recommendations">
                      <h4>Medical Recommendations</h4>
                      <ul className="recommendations-list">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="recommendation-item">
                            <span className="rec-icon">💡</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatment Plan */}
                    <div className="treatment-plan">
                      <h4>Treatment Plan</h4>
                      <div className="treatment-phases">
                        <div className="phase">
                          <span className="phase-label">Phase 1:</span>
                          <span className="phase-content">{analysisResult.treatmentPlan.phase1}</span>
                        </div>
                        <div className="phase">
                          <span className="phase-label">Phase 2:</span>
                          <span className="phase-content">{analysisResult.treatmentPlan.phase2}</span>
                        </div>
                        <div className="phase">
                          <span className="phase-label">Phase 3:</span>
                          <span className="phase-content">{analysisResult.treatmentPlan.phase3}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D Bone Model */}
                <div className="glass-card bone-model">
                  <h3>3D Bone Analysis</h3>
                  <div className="bone-visualization">
                    <div className="bone-model-3d">🦴</div>
                    <div className="fracture-points">
                      <div className="fracture-point active" style={{top: '30%', left: '40%'}}></div>
                      <div className="fracture-point" style={{top: '60%', left: '70%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'analysis' && (
            <div className="analysis-tab">
              <div className="glass-card full-width">
                <h2>Advanced Fracture Analysis</h2>
                <p>Upload an X-ray image to begin comprehensive fracture analysis</p>
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div className="reports-tab">
              <div className="glass-card full-width">
                <h2>Medical Reports</h2>
                <div className="reports-grid">
                  {analysisResult ? (
                    <div className="report-card">
                      <div className="report-icon">📄</div>
                      <div className="report-info">
                        <span className="report-title">Fracture Analysis Report</span>
                        <span className="report-date">Today</span>
                        <span className="report-details">
                          {analysisResult.boneType} - {analysisResult.fractureDetected ? 'Fracture Detected' : 'Normal'}
                        </span>
                      </div>
                      <button className="download-btn" onClick={downloadReport}>📥</button>
                    </div>
                  ) : (
                    <div className="no-reports">
                      <p>No reports available</p>
                      <small>Complete an analysis to generate reports</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="settings-tab">
              <div className="glass-card full-width">
                <h2>Settings</h2>
                <div className="settings-content">
                  <div className="setting-group">
                    <h3>User Profile</h3>
                    <div className="setting-item">
                      <label>Name:</label>
                      <span>{user?.name}</span>
                    </div>
                    <div className="setting-item">
                      <label>Email:</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="setting-item">
                      <label>User Type:</label>
                      <span>{user?.userType}</span>
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h3>Analysis History</h3>
                    <div className="history-list">
                      {recentAnalyses.map((analysis) => (
                        <div key={analysis.id} className="history-item">
                          <div className="history-icon">🦴</div>
                          <div className="history-details">
                            <span className="history-type">{analysis.type}</span>
                            <span className="history-date">{analysis.date}</span>
                            <span className="history-confidence">Confidence: {analysis.confidence}%</span>
                          </div>
                          <div className="history-actions">
                            <button 
                              className="download-history-btn"
                              onClick={() => downloadHistoryReport(analysis)}
                              title="Download Report"
                            >
                              📥
                            </button>
                            <div className={`history-status ${analysis.status}`}>
                              {analysis.status === 'severe' ? 'Fracture' : 'Normal'}
                            </div>
                          </div>
                        </div>
                      ))}
                      {recentAnalyses.length === 0 && (
                        <div className="no-history">
                          <p>No analysis history available</p>
                          <small>Complete an analysis to see history</small>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h3>Notifications</h3>
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`notification-item ${notification.type}`}>
                          <span className="notification-message">{notification.message}</span>
                          <span className="notification-time">
                            {notification.time.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h3>Account Actions</h3>
                    <button className="logout-btn-main" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;