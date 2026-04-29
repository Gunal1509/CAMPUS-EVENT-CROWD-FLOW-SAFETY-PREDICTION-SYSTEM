# CAMPUS-EVENT-CROWD-FLOW-SAFETY-PREDICTION-SYSTEM
A fully serverless, cloud-native application built on Amazon Web Services that monitors crowd density at campus events in real time, detects overcrowding anomalies using machine learning, and provides intelligent decision support through an AI-powered safety assistant.

 Project Overview
The Campus Crowd Safety System addresses the critical challenge of managing crowd safety at high-attendance campus events by providing real-time gate occupancy monitoring, ML-based anomaly detection, SQL-based historical analytics, and AI-assisted safety recommendations. The system is deployed entirely on AWS using serverless architecture, ensuring automatic scalability, minimal operational overhead, and cost efficiency through pay-per-use pricing.
Key Features:

✅ Real-time gate occupancy monitoring with live density classification
✅ Z-score based ML anomaly detection trained on historical crowd baselines
✅ REST API with five endpoints for data ingestion and query
✅ Amazon Athena SQL analytics for historical crowd trend analysis
✅ Keyword-driven AI safety assistant for intelligent recommendations
✅ React-based dashboard with live monitoring, alerts, and analytics
✅ End-to-end encryption with SSE-S3 AES-256 and IAM role-based access control
✅ CloudWatch centralized monitoring with SNS email alerts


👥 Team Members
NameRoleContributionsGUNAL_SLead DeveloperAWS Infrastructure, Lambda Functions, API Gateway, IAM ConfigurationTeam Member 2Data EngineerS3 Bucket Configuration, Glue ETL Pipeline, Athena SQL AnalyticsTeam Member 3Frontend DeveloperReact Dashboard, Vite Configuration, API Integration, UI/UX

 Quick Start
Prerequisites

AWS Academy Learner Lab access
Node.js 18+ and npm installed
VS Code or any code editor
Git installed locally

Installation

Clone the Repository

bash   git clone https://github.com/yourusername/crowd-safety-system.git
   cd crowd-safety-system

Install Frontend Dependencies

bash   npm install

Configure Environment
Create a .env file in the project root:

   VITE_API_BASE_URL=https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
Replace xxxxxxxx with your actual API Gateway ID.

Start Development Server

bash   npm run dev
Open http://localhost:5173 in your browser.

📊 AWS Services Used
ServicePurposeConfigurationAWS LambdaServerless compute for crowd data processing and ML anomaly detection5 functions, Python 3.12, LabRoleAmazon API GatewayREST API for frontend-backend communication5 endpoints, prod stage, CORS enabledAmazon S3Encrypted data lake for raw, processed, and analytics data3 buckets, SSE-S3 AES-256, partitionedAWS GlueServerless ETL for automatic data catalog creationCrawler, crowd_safety_db databaseAmazon AthenaSQL analytics engine for crowd data queryingServerless, cost-optimized queriesAWS IAMRole-based access control and least-privilege enforcementLabRole with scoped permissionsAmazon CloudWatchCentralized monitoring, dashboards, alarms, and loggingDashboard, error alarms, SNS alertsAmazon SNSEmail notifications for critical system eventsEmail topic for error alerts

🧠 Machine Learning Implementation
Training Dataset

Size: 5,760 rows spanning 30 days
Gates: 8 campus entry points (gate-a to gate-h)
Features: entry_count, exit_count, occupancy, capacity, density_pct, status, event_type
Labels: is_anomaly (0 or 1) with 3% anomaly injection rate

Anomaly Detection Algorithm
Z-Score Statistical Model:
z = (live_occupancy − historical_mean) / historical_std_dev

Threshold: if z > 2.5 → anomaly detected 🚨
Per-Gate Statistical Baselines
GateMean OccupancyStd DevAnomaly Thresholdgate-a112.6113.2occ > 396gate-b84.587.3occ > 302gate-c48.551.9occ > 178gate-d130.0129.3occ > 453gate-e38.341.7occ > 142gate-f27.830.1occ > 103gate-g65.466.1occ > 231gate-h96.899.5occ > 345

📡 API Endpoints
EndpointMethodPurposeResponse/crowd/liveGETReal-time gate occupancy with ML anomaly detectionJSON with gates array, z_score, anomaly flags/eventsGETCampus event listingsJSON with event details and dates/alertsGET/POSTSafety alert managementJSON with critical density alerts/analytics/hourlyGETHourly crowd trend data (08:00–17:00)JSON with hourly gate occupancy chart data/assistant/queryPOSTAI-powered safety recommendationsJSON with keyword-matched safety responses
Example Request/Response
Request:
bashcurl -X POST https://api.example.com/assistant/query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "which gate is most dangerous?"}'
Response:
json{
  "answer": "⚠️ Gate D (Sports Arena) is at 118% capacity — immediate action required. Redirect incoming crowd to Gate C (Food Court) which is only at 27% capacity.",
  "insights": [
    {"label": "Critical Gate", "value": "Gate D — 118%", "severity": "critical"},
    {"label": "Safest Gate", "value": "Gate C — 27%", "severity": "low"},
    {"label": "Peak Time", "value": "14:00 – 15:30", "severity": "medium"}
  ],
  "model": "CrowdSafe AI (Keyword-Based)"
}

🔐 Security Implementation
IAM Access Control

LabRole with scoped permissions following principle of least privilege
Per-service granular permissions: S3, Lambda, Glue, Athena, CloudWatch
No hardcoded credentials — temporary STS tokens only

Data Encryption

At Rest: SSE-S3 AES-256 on all S3 buckets
In Transit: TLS/SSL on all API endpoints
Block Public Access: Enabled on all buckets to prevent unauthorized access

Audit & Compliance

AWS CloudTrail: Logs all API calls for audit trail
CloudWatch Logs: Centralized logging for all Lambda executions
IAM Policies: Enforced through CloudWatch and documented in this README


📈 Performance & Scalability
AspectPerformanceLambda Cold Start< 500ms (Python 3.12)API Response Time< 100ms per requestConcurrent ExecutionsAuto-scales from 0 to 1,000+Data Query Latency< 1 second (Athena on S3)Storage Cost< $0.01/month (S3 with standard storage class)Compute CostPay-per-invocation (typical event: $0.20–$1.00)

📚 Data Schema
Raw Crowd Data (JSON)
json{
  "event_id": "EVT001",
  "event_name": "TechFest 2024",
  "gate": "Gate D",
  "entry_count": 510,
  "exit_count": 200,
  "timestamp": "2024-03-15T11:00:00Z",
  "zone": "Sports Arena",
  "density_level": "CRITICAL"
}
Training Data (CSV)
csvtimestamp,gate_id,gate_name,occupancy,capacity,density_pct,status,event_type,is_anomaly
2024-03-01T08:00:00Z,gate-d,Sports Arena,130,500,26.0,LOW,normal,0
2024-03-15T15:00:00Z,gate-d,Sports Arena,590,500,118.0,CRITICAL,peak,1

🧪 Testing & Validation
Unit Testing
bash# Test Lambda functions individually
AWS Console → Lambda → Select Function → Test
Integration Testing
bash# Test complete API pipeline
curl https://api.example.com/crowd/live
curl https://api.example.com/analytics/hourly
End-to-End Testing

Open React dashboard: http://localhost:5173
Navigate through all pages:

Dashboard (live monitoring)
Events (campus events)
Alerts (safety alerts)
Analytics (hourly trends)
AI Assistant (safety queries)


Verify API calls in browser DevTools → Network tab
Confirm all endpoints return status 200 
