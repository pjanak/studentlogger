import { useState } from 'react'
import { ChevronDown, Users, BookOpen, BarChart3 } from 'lucide-react'

export default function Dashboard({ userRole, setUserRole }) {
  const [expandedStudent, setExpandedStudent] = useState(0)
  const currentUser = {
    teacher: { name: 'Ms. Sarah Chen', title: 'Biology Instructor' },
    student: { name: 'Alex Johnson', title: 'Senior, Class of 2025' },
    admin: { name: 'Dr. James Wilson', title: 'School Administrator' }
  }[userRole]

  const students = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@school.edu',
      attendance: '94%',
      average: '87%',
      assignments: [
        { name: 'Chapter 2 Essay', grade: 92, dueDate: '2024-09-20', submitted: true },
        { name: 'Math Problem Set', grade: 88, dueDate: '2024-09-18', submitted: true },
        { name: 'Group Project', grade: null, dueDate: '2024-09-25', submitted: false }
      ]
    },
    {
      id: 2,
      name: 'Jordan Smith',
      email: 'jordan.smith@school.edu',
      attendance: '88%',
      average: '82%',
      assignments: [
        { name: 'Chapter 2 Essay', grade: 85, dueDate: '2024-09-20', submitted: true },
        { name: 'Math Problem Set', grade: 80, dueDate: '2024-09-18', submitted: true },
        { name: 'Group Project', grade: null, dueDate: '2024-09-25', submitted: false }
      ]
    },
    {
      id: 3,
      name: 'Morgan Lee',
      email: 'morgan.lee@school.edu',
      attendance: '92%',
      average: '95%',
      assignments: [
        { name: 'Chapter 2 Essay', grade: 98, dueDate: '2024-09-20', submitted: true },
        { name: 'Math Problem Set', grade: 96, dueDate: '2024-09-18', submitted: true },
        { name: 'Group Project', grade: null, dueDate: '2024-09-25', submitted: false }
      ]
    }
  ]

  const getGradeColor = (grade) => {
    if (!grade) return '#ccc'
    if (grade >= 90) return '#10b981'
    if (grade >= 80) return '#3b82f6'
    if (grade >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const renderRoleView = () => {
    if (userRole === 'student') {
      return (
        <div className="student-view">
          <h3>Your Grades & Assignments</h3>
          <div className="student-grades">
            <div className="grade-card">
              <div className="grade-label">Current Grade</div>
              <div className="grade-value" style={{ color: '#10b981' }}>87%</div>
            </div>
            <div className="grade-card">
              <div className="grade-label">Attendance</div>
              <div className="grade-value" style={{ color: '#3b82f6' }}>94%</div>
            </div>
          </div>
          <h4>Your Assignments</h4>
          <div className="assignments">
            {students[0].assignments.map((assignment, idx) => (
              <div key={idx} className="assignment">
                <div className="assignment-name">
                  {assignment.name}
                  {assignment.submitted && <span className="badge">Submitted</span>}
                  {!assignment.submitted && <span className="badge pending">Pending</span>}
                </div>
                <div className="assignment-info">
                  {assignment.grade && (
                    <span
                      className="assignment-grade"
                      style={{ color: getGradeColor(assignment.grade) }}
                    >
                      {assignment.grade}%
                    </span>
                  )}
                  <span className="due-date">Due: {assignment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (userRole === 'admin') {
      return (
        <div className="admin-view">
          <h3>School Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-icon">📊</div>
              <div className="analytics-label">Total Students</div>
              <div className="analytics-value">248</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">👥</div>
              <div className="analytics-label">Total Teachers</div>
              <div className="analytics-value">32</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">📚</div>
              <div className="analytics-label">Active Classes</div>
              <div className="analytics-value">24</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">✅</div>
              <div className="analytics-label">Avg Attendance</div>
              <div className="analytics-value">91%</div>
            </div>
          </div>
          <h4>Class Performance Overview</h4>
          <div className="class-performance">
            <div className="perf-row">
              <div className="class-name">Biology 101</div>
              <div className="class-metric">Avg: 88%</div>
              <div className="class-metric">Students: 24</div>
            </div>
            <div className="perf-row">
              <div className="class-name">Chemistry 201</div>
              <div className="class-metric">Avg: 85%</div>
              <div className="class-metric">Students: 21</div>
            </div>
            <div className="perf-row">
              <div className="class-name">Physics 101</div>
              <div className="class-metric">Avg: 92%</div>
              <div className="class-metric">Students: 19</div>
            </div>
          </div>
        </div>
      )
    }

    // Teacher view (default)
    return (
      <div className="teacher-view">
        <h3>Class Overview: Biology 101</h3>
          <div className="class-stats">
            <div className="stat">
              <span className="stat-label">Average Grade</span>
              <span className="stat-value">88%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">91%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Students</span>
              <span className="stat-value">{students.length}</span>
            </div>
          </div>
        </div>

        <div className="students-list">
          <h4>Student Tracking</h4>
          {students.map((student, index) => (
            <div key={student.id} className="student-card">
              <button
                className="student-header"
                onClick={() => setExpandedStudent(expandedStudent === index ? -1 : index)}
              >
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                </div>
                <div className="student-metrics">
                  <div className="metric">
                    <span className="metric-label">Grade</span>
                    <span
                      className="metric-value"
                      style={{ color: getGradeColor(parseInt(student.average)) }}
                    >
                      {student.average}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Attendance</span>
                    <span className="metric-value">{student.attendance}</span>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`chevron ${expandedStudent === index ? 'open' : ''}`}
                />
              </button>

              {expandedStudent === index && (
                <div className="student-details">
                  <h4>Recent Assignments</h4>
                  <div className="assignments">
                    {student.assignments.map((assignment, idx) => (
                      <div key={idx} className="assignment">
                        <div className="assignment-name">
                          {assignment.name}
                          {assignment.submitted && <span className="badge">Submitted</span>}
                          {!assignment.submitted && <span className="badge pending">Pending</span>}
                        </div>
                        <div className="assignment-info">
                          {assignment.grade && (
                            <span
                              className="assignment-grade"
                              style={{ color: getGradeColor(assignment.grade) }}
                            >
                              {assignment.grade}%
                            </span>
                          )}
                          <span className="due-date">Due: {assignment.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )
    }
  }

  return (
    <section className="dashboard-demo">
      <div className="container">
        <div className="dashboard-top-bar">
          <div className="user-info">
            <div className="user-avatar">{currentUser.name[0]}</div>
            <div>
              <div className="user-name">{currentUser.name}</div>
              <div className="user-title">{currentUser.title}</div>
            </div>
          </div>

          <div className="role-switcher">
            <span className="role-label">Demo As:</span>
            <div className="role-buttons">
              <button
                className={`role-btn ${userRole === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserRole('teacher')}
                title="View as Teacher"
              >
                <Users size={16} />
                Teacher
              </button>
              <button
                className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
                onClick={() => setUserRole('student')}
                title="View as Student"
              >
                <BookOpen size={16} />
                Student
              </button>
              <button
                className={`role-btn ${userRole === 'admin' ? 'active' : ''}`}
                onClick={() => setUserRole('admin')}
                title="View as Administrator"
              >
                <BarChart3 size={16} />
                Admin
              </button>
            </div>
          </div>
        </div>

        {renderRoleView()}
      </div>

      <style>{`
        .dashboard-demo {
          padding: 2rem 0 4rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .dashboard-top-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
        }

        .user-title {
          font-size: 0.875rem;
          color: #64748b;
        }

        .role-switcher {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .role-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .role-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .role-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .role-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .role-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .teacher-view h3,
        .student-view h3,
        .admin-view h3 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .student-grades {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .grade-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }

        .grade-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .grade-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .student-view h4,
        .admin-view h4 {
          margin: 2rem 0 1rem;
          color: #1e293b;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .analytics-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }

        .analytics-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .analytics-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .analytics-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .class-performance {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .perf-row {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .perf-row:last-child {
          border-bottom: none;
        }

        .class-name {
          font-weight: 600;
          color: #1e293b;
          flex: 1;
        }

        .class-metric {
          font-size: 0.875rem;
          color: #64748b;
          margin-left: 1rem;
        }

        .dashboard-header {
          margin-bottom: 3rem;
        }

        .dashboard-header h2 {
          margin-bottom: 1.5rem;
          color: var(--primary-color);
        }

        .class-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .students-list h3 {
          margin-bottom: 1.5rem;
          color: #1e293b;
        }

        .student-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        .student-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .student-header {
          width: 100%;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          justify-content: space-between;
        }

        .student-info {
          flex: 1;
          text-align: left;
        }

        .student-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .student-email {
          font-size: 0.875rem;
          color: #64748b;
        }

        .student-metrics {
          display: flex;
          gap: 2rem;
          margin: 0 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 500;
        }

        .metric-value {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .chevron {
          transition: transform 0.2s;
          color: #64748b;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .student-details {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .student-details h4 {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
        }

        .assignments {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .assignment {
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .assignment-name {
          flex: 1;
          font-weight: 500;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: #d1fae5;
          color: #065f46;
          font-weight: 600;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .assignment-info {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.875rem;
        }

        .assignment-grade {
          font-weight: 700;
          min-width: 40px;
        }

        .due-date {
          color: #64748b;
        }

        @media (max-width: 768px) {
          .dashboard-top-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .role-switcher {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .role-buttons {
            width: 100%;
            justify-content: flex-start;
          }

          .role-btn {
            flex: 1;
            justify-content: center;
          }

          .student-metrics {
            flex-direction: column;
            gap: 0.5rem;
            margin: 0;
          }

          .student-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .perf-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .class-metric {
            margin-left: 0;
          }
        }
      `}</style>
    </section>
  )
}
